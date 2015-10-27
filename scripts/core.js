Array.prototype.addProcess = function(lambda, u1, u2)	{
	var newProcess = { interArrivalTime: lambda, serverTime1: u1, serverTime2: u2};
	this.push(newProcess);
}

var app = angular.module('queueHandler', []);

app.controller('global', Controller);