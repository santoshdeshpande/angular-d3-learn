'use strict';

define([
  'angular', 
  'angularResource'
], function (angular) {
	angular.module('myApp.services', ['ngResource'])
		.factory('Pie', function($resource){
			// Please implement a REST Resource here
			// the url is: 'app/api/v1/pie.json'
            return $resource("app/api/v1/pie.json")
  		});
});
