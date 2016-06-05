myApp.controller('venueController', ['$scope', '$log', '$location', '$http', function($scope, $log, $location, $http) {
    
    $scope.defaultCountry = "Norway";
        
    $scope.searchString = '';
    $scope.activeVenueId = '';
    $scope.activeVenue = null;
    $scope.venues;
    $scope.emptyVenue = null;
    $scope.tag = '';
    $scope.saveActiveVenue = false;
    $scope.SearchAddress = "";
    
    var updateVenue = false;
    
    $scope.$on('$routeChangeStart', function(next, current) {
        $log.info();
        if($scope.activeVenue || current.$$route.originalPath === "/venue/add")
            $scope.saveActiveVenue();
        else 
            $location.path('');
    });
    
    $scope.$watch('activeVenueId', function(){
        $log.info($scope.activeVenueId);
        angular.forEach($scope.venues, function(val, key) {
            if(val._id === $scope.activeVenueId)
                $scope.activeVenue = $scope.venues[key];
        });
    }); 
    
    $scope.$watch('emptyVenue', function(){
        $log.log("Changed");
    }, true);
    
    $scope.$watch('activeVenue', function(newValue, oldValue) {
        if(!updateVenue && $location.path() !== "/"){
            updateVenue = true;
            $log.info("Venue changed, saving on next page switch");
        }
    }, true)
    
    $scope.addVenue = function() {
        $scope.venues.push($scope.emptyVenue);
        $http.post('/saveVenue', {venue: $scope.emptyVenue})
            .success(function(data, status, headers, config) {
                if(status === 200) {
                    $scope.emptyVenue = __emptyVenue;
                    $log.info("Venue saved: " + data);
                }
            });
        $location.path('');
    }

    $scope.setActiveVenue = function(id) {
        $scope.activeVenueId = id;
    }
    
    $scope.$watch('saveActiveVenue', function() {
        if($scope.saveActiveVenue === "save") {
            $scope.saveActiveVenue = "false";
        } else {
            
        }
    })
 
    /*
    * Goodies
    */
    
    $scope.toggleGoodie = function(goodie){
        $log.info(goodie);
    }
    
    $scope.removeTag = function(tag) {
        $scope.activeVenue.tags.splice(tag, 1);
    }
    
    $scope.addTag = function(tag) {
        $log.info(tag);
        $scope.activeVenue.tags.push(tag);
        $scope.tag = '';
    }
    
    /*
    *   HTTP Requests
    */
    
    $http.get('/getTemplate').success(function(data, status, headers, config) {
        __emptyVenue = data;
        $scope.emptyVenue = data;
    })
    
    $http.get('/getVenues').success(function(data, status,  headers, config) {
        $scope.venues = data;
    });
    
    $scope.getGoogleData = function(address, data) {
        $http.post('/getGoogleData', {googleAddress: address})
        .success(function(data, status, headers, config) {
            if(status === 200) {
                $log.log(data);
            }
        });
    }
    
    $scope.saveActiveVenue = function() {
        if(updateVenue) {
            $http.post('/saveVenue', {venue: $scope.activeVenue})
            .success(function(data, status, headers, config) {
                if(status === 200) {
                    $log.info("Successfully saved venue");
                }
            });
            updateVenue = false;
        } 
    }
}]);