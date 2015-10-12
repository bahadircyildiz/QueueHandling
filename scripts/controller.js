function Controller($scope){
	$scope.processes = [{ interArrivalTime: 1, serverTime1: 1, serverTime2: 1}];
	
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
	
	$scope.unitTest = function(){
		var lecturerSample = [{ interArrivalTime: 1, serverTime1: 1, serverTime2: 1}, { interArrivalTime: 3, serverTime1: 1, serverTime2: 1}, { interArrivalTime: 2, serverTime1: 5, serverTime2: 5},
								{ interArrivalTime: 4, serverTime1: 1, serverTime2: 1},	{ interArrivalTime: 1, serverTime1: 1, serverTime2: 1},	{ interArrivalTime: 7, serverTime1: 2, serverTime2: 2}];
		$scope.processes = lecturerSample;
		$scope.start();
	}
	
	
	
	$scope.start = function(){
		var processes = angular.copy($scope.processes);
		var systemClock = 0, arrivalTime = processes[0].interArrivalTime , departTime1 = Infinity, departTime2 = Infinity;
		var queue1 = [], queue2 = []; 
		var logs = [], log = {};
		log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
		logs.push(log);
		systemClock = processes[0].interArrivalTime;
		var arrive = function(){
			arrivalTime = systemClock + processes[0].interArrivalTime;
			queue1.push(processes[0]);
			processes.splice(0,1);
			departTime1 = systemClock + queue1[0].serverTime1;
			if(processes.length == 0) arrivalTime = Infinity; else arrivalTime = systemClock + processes[0].interArrivalTime;
			log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
			logs.push(log);
		}
		
		var depart1 = function(){
			queue2.push(queue1[0]);
			queue1.splice(0,1);
			queue1[0] ? departTime1 = systemClock + queue1[0].serverTime1 : departTime1 = Infinity;
			departTime2 = systemClock + queue2[0].serverTime2;
			log = {systemClock: systemClock, arrivalTime: arrivalTime, departTime1: departTime1, departTime2: departTime2, queue1: queue1.length, queue2: queue2.length};
			logs.push(log);
		}
		var depart2 = function(){
			queue2.splice(0,1);
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
