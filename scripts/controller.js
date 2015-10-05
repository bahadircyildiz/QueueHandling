function Controller($scope){
	$scope.processes = [{ interArrivalTime: 0, serverTime: 0 }];
	
	$scope.debugMode = false;
	
	$scope.toggleDebug = function(){
		$scope.debugMode = !$scope.debugMode;
	}
	
	$scope.start = function(){
		
		//Retrieving Main Timeline
		var timeLine = [];
		var mainClock = 0;
		$scope.processes.forEach(function(process, index){
			var timeLineEntity = {};
			timeLineEntity.interArrivalTime = mainClock + process.interArrivalTime;
			timeLineEntity.serverTime = timeLineEntity.interArrivalTime+process.serverTime;
			timeLine.push(timeLineEntity);
			mainClock = timeLineEntity.interArrivalTime;
		});
		$scope.timeLine = timeLine;
		
		//Main Process
		var logs = [];
		var systemClock = 0;
		var queue = [];
		var departTime = 0;
		var serverBusy = false;
		var log;
		var nextArrivalTime = 0;
		
 		for(var index=0, process = timeLine[index]; index < timeLine.length ; index++, process = timeLine[index] ){			
			log = { systemClock: systemClock, arrivalTime: process.interArrivalTime, departTime : departTime, inQueue: queue.length };
			logs.push(log);
			departTime = process.serverTime;
			systemClock = process.interArrivalTime;
			queue.push(process);
			
			queueDepartTime = process.serverTime;
			
			while(systemClock != queueDepartTime){
				if(index == timeLine.length-1){
					if(queue.length != 0){
						log = { systemClock: systemClock, arrivalTime: queue[0].interArrivalTime, departTime : queue[0].serverTime , inQueue: queue.length };
						logs.push(log);
						systemClock = Math.max(queue[0].interArrivalTime, systemClock);
						queueDepartTime = systemClock + queue[0].serverTime - queue[0].interArrivalTime; 
						queue.splice(0,1);
						if(queue.length == 0){
							systemClock = queueDepartTime;
							log = { systemClock: queueDepartTime , arrivalTime: 0, departTime : 0 , inQueue: queue.length };
							logs.push(log);	
						}
					}
				}	
				else{
					if(queue[0].serverTime <= timeLine[index+1].interArrivalTime){ // Depart Part
						departTime= timeLine[index].serverTime;
						log = { systemClock: systemClock, arrivalTime: timeLine[index+1].interArrivalTime, departTime :departTime , inQueue: queue.length };
						logs.push(log);
						systemClock = queue[0].serverTime;
						departTime = 0;
						queue.splice(0,1);
					}
					if(queue.length !=0 ) if(queue[0].serverTime > timeLine[index+1].interArrivalTime){ // Arrival Part
						log = { systemClock: systemClock, arrivalTime: timeLine[index+1].interArrivalTime, departTime : departTime, inQueue: queue.length };
						logs.push(log);
						queue.push(timeLine[index]);
						systemClock = timeLine[index+1].interArrivalTime;
						index++;
					}
				}
			}
		}
		
		$scope.logs = logs;			
	}		
}
