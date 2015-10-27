function Controller($scope){
	$scope.processes = [];
	
	$scope.debugMode = false;
	
	
	
	var queuecount = 2;
	$scope.queuecount  = queuecount;
	var queue = [];

	for(var x = 0; x<queuecount;x++){
		queue.push({departTime: 0, elements: []});
	}
	
	$scope.queue = queue;
	
	$scope.toggleDebug = function(){
		$scope.debugMode = !$scope.debugMode;
	}
	
	$scope.exponential = function(param){
		return  -(1/param)*Math.log((1-Math.random()));
	}
	
	$scope.unitTest = function(){
		var processNumber = 100;
		var i = 0;
		var lambda = $scope.lambda;
		var u1= $scope.u1;
		var u2=	$scope.u2;
		while(i < processNumber){
			lambda = $scope.exponential(lambda);
			u1 = $scope.exponential(u1);
			u2 = $scope.exponential(u2);
			$scope.processes.addProcess(lambda, u1, u2);
			i++	
		}
		$scope.start();
	}
	
	
	
	$scope.start = function(){
		var processes = angular.copy($scope.processes);
		var systemClock = 0, arrivalTime = processes[0].interArrivalTime , departTime1 = Infinity, departTime2 = Infinity, d1iIsSet = false, d2IsSet = false;
		var queue1 = [], queue2 = []; 
		var logs = [], log = {};
		var tempvar;
		log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
		logs.push(log);
		systemClock = processes[0].interArrivalTime;
		var arrive = function(){
			arrivalTime = systemClock + processes[0].interArrivalTime;
			queue1.push(processes[0]);
			processes.splice(0,1);
			if(processes.length == 0) arrivalTime = Infinity; else arrivalTime = systemClock + processes[0].interArrivalTime;
			if(!d1iIsSet) {
				if (arrivalTime == Infinity) departTime1 = logs[logs.length-1].departTime1;
				else departTime1 = systemClock + queue1[0].serverTime1;
				if(departTime1 == Infinity) departTime1 = systemClock + queue1[0].serverTime1;
				d1iIsSet = true;
			}
			log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
			logs.push(log);
		}
		
		var depart1 = function(){
			queue2.push(queue1[0]);
			queue1.splice(0,1);
			queue1[0] ? departTime1 = systemClock + queue1[0].serverTime1 : departTime1 = Infinity;
			d1iIsSet = false;
			if(!d2IsSet){
				departTime2 = systemClock + queue2[0].serverTime2;
				d2IsSet = true;
			}
			log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
			logs.push(log);
		}
		var depart2 = function(){
			queue2.splice(0,1);
			d2IsSet = false;
			queue2[0] ? departTime2 = systemClock + queue2[0].serverTime2 : departTime2 = Infinity;
			log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
			logs.push(log);
		}
		
		while (processes.length != 0 || queue1.length != 0 || queue2.length != 0){
			systemClock = Math.min(arrivalTime, departTime1, departTime2);
			if(systemClock == Infinity) break;
			if(systemClock == arrivalTime) arrive();
			systemClock = Math.min(arrivalTime, departTime1, departTime2);
			if(systemClock == Infinity) break;
			if(systemClock == departTime1) depart1();
			systemClock = Math.min(arrivalTime, departTime1, departTime2);
			if(systemClock == Infinity) break;
			if(systemClock == departTime2) depart2();
		}
		$scope.logs = logs;		
	}
}
