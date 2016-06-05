var myApp = angular.module('myApp', ['ngRoute']);

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
    .when('/venue/:venueId/goodies', {
        templateUrl: 'pages/venue_goodies.html',
        controller: ''
    })
    
});

var __emptyVenue = {};


const __venues = [
        {
        "_id": "574c70bcb9dee9108163a04f",
        "name": "Emils WebBod",
        "description": "This is my crib",
        "sqm": 50,
        "expertise": "Webdesign",
        "type": "Home office",
        "offices": [
            {
                "month": 100,
                "week": 10,
                "day": 1,
                "description": "My room",
                "seats": "2",
                "type": "Closed office",
                "_id": {
                    "$oid": "57507d0b0fa77f252aab7b24"
                }
            }
        ],
        "location": {
            "street": "Hvalstadåsen",
            "street_number": 41,
            "postal_code": 1395,
            "postal_town": "Hvalstad",
            "county": "Asker",
            "country": "Norway",
            "lat": 59.8557171,
            "lng": 10.457649
        },
        "amenities": [
            "Wi-Fi",
            "24/7",
            "Coffee/tea",
            "Shared Kitchen",
            "Pets"
        ],
        "open_hours": [
            {
                "open": true,
                "start": "9:00",
                "end": "21:00"
            },
            {
                "open": true,
                "start": "9:00",
                "end": "21:00"
            },
            {
                "open": true,
                "start": "9:00",
                "end": "21:00"
            },
            {
                "open": true,
                "start": "9:00",
                "end": "21:00"
            },
            {
                "open": true,
                "start": "9:00",
                "end": "21:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            }
        ],
        "tags": [
            "Webdesign",
            "Cozy"
        ],
        "contact": {
            "email": "emil@webbod.no",
            "name": "Emil Andreas Olsen"
        },
        "state": [
            "Akershus"
        ],
        "__v": 33
    },
    {
        "_id": "575074912613a8e025726b8c",
        "name": "DeskVibe",
        "description": "",
        "sqm": 0,
        "expertise": "",
        "type": "",
        "offices": [],
        "location": {
            "street": "Nedre Slottsgate",
            "street_number": 8,
            "postal_code": 157,
            "postal_town": "Oslo",
            "county": "Oslo",
            "country": "Norway",
            "lat": 59.91215389999999,
            "lng": 10.7427627
        },
        "amenities": [],
        "open_hours": [
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            },
            {
                "open": false,
                "start": "0:00",
                "end": "0:00"
            }
        ],
        "tags": [],
        "contact": {
            "email": "a@a.no",
            "name": "Marius"
        },
        "state": [
            "Oslo"
        ],
        "__v": 0
    }];