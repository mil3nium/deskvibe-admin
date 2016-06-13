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
        scope: {
            venue: '=',
            updatePositionData: '&',
            getGoogleDataFunction: '&'
        }
        
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
            office: '=',
            goodies: '=',
            goodieAdd: '&'
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
        template: '<a href="" class="tag" >{{ tag }}</a>',
        replace: true,
        scope: {
            tag: '@'
        }
    }
})

myApp.directive('venueGoodiesList', function() {
    return {
        template: '<a href="" class="venueGoodie">{{ goodie }}<br /></a>',
        replace: true,
        scope: {
            goodie: '@'
        }
    }
})

