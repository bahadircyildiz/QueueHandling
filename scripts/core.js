Array.prototype.addProcess = function()	{
	var newProcess = { interArrivalTime: 0, serverTime: 0};
	this.push(newProcess);
}

var app = angular.module('queueHandler', []);

app.controller('global', Controller);