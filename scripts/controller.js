function Controller($scope){
	$scope.processes = [{ interArrivalTime: 1, serverTime: 1	}];
	
	$scope.debugMode = false;
	
	$scope.toggleDebug = function(){
		$scope.debugMode = !$scope.debugMode;
	}
	
	$scope.unitTest = function(){
		var lecturerSample = [{ interArrivalTime: 1, serverTime: 1}, { interArrivalTime: 3, serverTime: 1}, { interArrivalTime: 2, serverTime: 5},
								{ interArrivalTime: 4, serverTime: 1},	{ interArrivalTime: 1, serverTime: 1},	{ interArrivalTime: 7, serverTime: 2}];
		$scope.processes = lecturerSample;
		$scope.start();
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
				if(index == timeLine.length-1){ // After all elements were arrived, 
					if(queue.length != 0){ // Process moves on queue
						var lastArrivalTime;
						queue[1] ? lastArrivalTime = Math.max(systemClock, queue[1].interArrivalTime) : lastArrivalTime = 0;
						log = { systemClock: systemClock, arrivalTime: lastArrivalTime, departTime : queue[0].serverTime , inQueue: queue.length };
						logs.push(log);
						if (lastArrivalTime < queue[0].serverTime && lastArrivalTime != 0){
							if(systemClock  == lastArrivalTime){
								systemClock = queue[0].serverTime;
								log = { systemClock: systemClock, arrivalTime: 0, departTime : queue[0].serverTime , inQueue: queue.length };
								logs.push(log);
							}
							else systemClock = lastArrivalTime;
						} 
						else{
							systemClock = queue[0].serverTime;
							queue[1] ? queueDepartTime = queue[1].serverTime : queueDepartTime = 0;
							queue.splice(0,1);							
						}
						if(queue.length == 0){ 
							log = { systemClock: systemClock , arrivalTime: 0, departTime : 0 , inQueue: queue.length };
							logs.push(log);	
							break;
						}
					}
				}	
				else{
					if(queue[0].serverTime <= timeLine[index+1].interArrivalTime){ // Depart Part
						departTime= queue[0].serverTime;
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
