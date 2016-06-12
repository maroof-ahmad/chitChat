var app = angular.module('chitChat', ['btford.socket-io']);
app.factory('socket', function(socketFactory){
	return socketFactory();
});
app.controller('mainController', ['$scope','socket', function($scope,socket){
	$scope.message="";
	$scope.sendMessage = function(data){
		console.log(data);
		$scope.message='';
	}
}]);
// app.controller('mainController', ['$scope',function($scope){
// 	$scope.message="";
// 	$scope.sendMessage = function(data){
// 		console.log(data);
// 	}
// }]);

