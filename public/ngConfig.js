var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

myApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/venue_list.html',
        controller: ''
    })
    .when('/venue/add', {
        templateUrl: 'pages/venue_add.html',
        controller: ''
    })
    .when('/venue/:venueId', {
        templateUrl: 'pages/venue_info.html',
        controller: ''
    })
    .when('/venue/:venueId/details', {
        templateUrl: 'pages/venue_details.html',
        controller: ''
    })
    .when('/venue/:venueId/offices', {
        templateUrl: 'pages/venue_offices.html',
        controller: ''
    })
    .when('/venue/:venueId/offices/add', {
        templateUrl: 'pages/venue_office_add.html',
        controller: ''
    })
    .when('/venue/:venueId/offices/:id/update', {
        templateUrl: 'pages/venue_office_update.html',
        controller: ''
    })
    .when('/venue/:venueId/goodies', {
        templateUrl: 'pages/venue_goodies.html',
        controller: ''
    })
    
});

var __emptyVenue = {};