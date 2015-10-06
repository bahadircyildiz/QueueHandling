Array.prototype.addProcess = function()	{
	var newProcess = { interArrivalTime: 1, serverTime: 1};
	this.push(newProcess);
}

var app = angular.module('queueHandler', []);

app.controller('global', Controller);