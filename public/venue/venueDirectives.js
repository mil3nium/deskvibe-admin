myApp.directive('venueMenu', function() {
    return {
        templateUrl: 'venue/directives/venueMenu.html',
        replace: true
    }
});

myApp.directive('venueDetails', function() {
    return {
        templateUrl: 'venue/directives/venueDetails.html',
        replace: true
    }
});

myApp.directive('venueSearchResults', function() {

    return {
        restrict: 'AE',
        templateUrl: 'venue/directives/venueSearchResult.html',
        replace: true,
        scope: {
            venueId: '@',
            venueName: '@',
            venueDescription: '@',
            activeVenue: '@'
        }
    }
});

myApp.directive('venueTagList', function() {
    return {
        templateUrl: 'venue/directives/venueTag.html',
        replace: true,
        scope: {
            tag: '@'
        }
    }
})

myApp.directive('venueGoodiesList', function() {
    return {
        templateUrl: 'venue/directives/venueGoodie.html',
        replace: true,
        scope: {
            goodie: '@'
        }
    }
})