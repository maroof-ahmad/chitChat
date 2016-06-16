var app = angular.module('chitChat', ['btford.socket-io', 'ngRoute']);
app.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : './login.html',
		controller : 'loginController'
	})
	.when('/chat',{
		templateUrl : './chat.html',
		controller : 'mainController'
	})
	.otherwise('/');
});
app.factory('socket', function(socketFactory){
	return socketFactory();
});
// app.factory('users', function(){
// 	var users=[];
// 	return {
// 		userlist:users
// 	}
// });
app.controller('mainController', ['$scope','$http', 'socket', function($scope,$http,socket){

	$scope.message="";
	$scope.messages = [];
	$scope.users = [];
	$scope.username = socket.username;
	$http({
		method: 'GET',
		url: '/instantiate'
	}).then(function successCallback(res){
		$scope.messages = res.data.messages;
		$scope.users = res.data.users;
		// console.log($scope.messages);
		// console.log($scope.users);

	}, function errorCallback(err){
		console.log(err);
	});
	$scope.sendMessage = function(data){
		console.log(data);
		socket.emit('new message',{username: $scope.username, message: data})
		$scope.message='';
	}
	socket.on('new message',function(data){
		console.log(data);
		// console.log($scope);
		$scope.messages.push(data);
		console.log($scope.messages);

	});
	socket.on('user',function(users){
		$scope.$apply(function(){$scope.users = users});
		console.log("users " + users);
	});

}]);
app.controller('loginController', ['$scope', 'socket', '$location',function($scope,socket,$location){
	$scope.changeView = function(){
		if(!$scope.username){
			alert("username can't be empty");
			$location.path('/');
		}
		else{
			console.log("username in login Controller" + $scope.username);
			socket.emit('new user', $scope.username, function(data){
				if(data) {
					socket.username = $scope.username;
					$location.path('/chat');
					$scope.username='';

				}else{	
					alert("use another username as "+$scope.username+" is already taken");
				}
			});
			
		}
	}
}]);
// app.controller('mainController', ['$scope',function($scope){
// 	$scope.message="";
// 	$scope.sendMessage = function(data){
// 		console.log(data);
// 	}
// }]);

