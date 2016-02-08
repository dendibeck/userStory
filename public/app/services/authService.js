angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){
	
	var authFactory = {};

	//method for login
	authFactory.login = function(username, password){
		return $http.post('/api/login',{
			username: username,
			password: password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			return data;
		})
	}

	//method for logout
	authFactory.logout = function(){
		AuthToken.setToken();
	}

	//method for check user is login or not 
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	// methood for getting user information
	authFactory.getUser = function(){
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({message: "User has no token"});
	}

	return authFactory;

})

.factory('AuthToken', function($window){
	var authTokenFactory = {};

	//method get token from the browser
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	//method to set the token to the localstorage browser if valid or remove if not valid
	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}

	return authTokenFactory;

})

.factory('AuthInterceptor', function($q, $location, AuthToken){
	var interceptorFactory = {};

	interceptorFactory.request = function(config){
		var token = AuthToken.getToken();
		if(token){
			config.headers['x-access-token'] = token;
		}
		return config;
	};

	interceptorFactory.responseError = function(response){
		if(response.status == 403)
			$location.path('/login');

		return $q.reject(response);
	}

	return interceptorFactory;
});