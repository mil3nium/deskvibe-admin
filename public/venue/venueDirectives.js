myApp.directive('venueMenu', function() {
    return {
        templateUrl: 'venue/directives/venueMenu.html',
        replace: true,
    }
});

myApp.directive('venueInfo', function() {
    return {
        templateUrl: 'venue/directives/venueInfo.html',
        replace: true,
        transclude: true,
        scope: {
            venue: '=',
            getGoogleDataFunction: '&'
        },
        transclude: true
    }
});

myApp.directive('venueListItem', function() {
    return {
        templateUrl: 'venue/directives/venueListItem.html',
        scope: {
            header: '@',
            description: '@'
        }
    }
})

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

/**
*   ========== DETAILS =============
**/

myApp.directive('venueOpenHours', function() {
    return {
        templateUrl: 'venue/directives/venueOpenHours.html',
        replace: true,
        scope: {
            recursiveDay: '@',
            day: '='
        }
    }
})

/**
*   ========== OFFICES =============
**/

myApp.directive('venueOfficeAdd', function() {
    return {
        templateUrl: 'venue/directives/venueOfficeAdd.html',
        replace: true,
        scope: {
            office: '='
        }
    }
})

myApp.directive('venueOfficeList', function() {
    return {
        templateUrl: 'venue/directives/venueOfficeList.html',
        scope: {
            office: '='
        }
    }
})


/**
*   ========== GOODIES =============
**/

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

