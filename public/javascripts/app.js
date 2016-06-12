var app = angular.module('chitChat', ['btford.socket-io']);
app.factory('socket', function(socketFactory){
	return socketFactory();
});
app.controller('mainController', ['$scope','socket', function($scope,socket){
	$scope.message="";
	$scope.messages = [];
	$scope.sendMessage = function(data){
		console.log(data);
		socket.emit('new message',{message: data})
		$scope.message='';
	}
	socket.on('new message',function(data){
		console.log(data);
		$scope.messages.push(data.message);
		console.log($scope.messages);

	});

}]);
// app.controller('mainController', ['$scope',function($scope){
// 	$scope.message="";
// 	$scope.sendMessage = function(data){
// 		console.log(data);
// 	}
// }]);

