myApp.controller('venueController', ['$scope', '$log', '$location', '$http', function($scope, $log, $location, $http) {
    
    $scope.defaultCountry = "Norway";
    
    $scope.ModalAddressShow = false;
        
    $scope.searchString = '';
    $scope.activeVenueId = '';
    $scope.activeVenue = null;
    $scope.venues;
    $scope.emptyVenue = null;
    $scope.saveActiveVenue = false;
    $scope.SearchAddress = "";
    
    
    $scope.testVariable = "Test";
    
    var updateVenue = false;
    
    $scope.$on('$routeChangeStart', function (next, current) {
        $log.info();
        if($scope.activeVenue || current.$$route.originalPath === "/venue/add")
            $scope.saveActiveVenue();
        else 
            $location.path('');
    });
    
    /*
    * =============== VENUE LIST =============================
    */ 
    
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
    
    $scope.removeActiveVenue = function() {
        var index = $scope.venues.indexOf($scope.activeVenue);
        if(index != -1) {
            $log.debug("Deleting venue : " + $scope.activeVenue.name + " ... ")
            $http.post('/deleteVenue', {_id: $scope.activeVenue._id})
            .success( function(data, status, headers, config) {
                $scope.venues.splice(index, 1);
                $scope.activeVenue = null;
                $location.path('');
                $scope.saveActiveVenue();
                $log.debug("Deleted venue");
            } )
        }
    }

    $scope.setActiveVenue = function(id) {
        $scope.activeVenueId = id;
    }
    
    
    
    /*
    * =============== WATCHERS =============================
    */ 
    
    $scope.$watch('activeVenueId', function(){
        $log.info($scope.activeVenueId);
        angular.forEach($scope.venues, function(val, key) {
            if(val._id === $scope.activeVenueId)
                $scope.activeVenue = $scope.venues[key];
        });
        $log.log($scope.activeVenue)
    }); 
    
    
    $scope.$watch('activeVenue', function(newValue, oldValue) {
        if(!updateVenue && $location.path() !== "/"){
            updateVenue = true;
        }
    }, true)
 
    $scope.$watch('saveActiveVenue', function() {
        if($scope.saveActiveVenue === "save") {
            $scope.saveActiveVenue = "false";
        }
    })
    
    /*
    * =============== DETAILS =============================
    */ 
    
    $scope.detailsSameDay = false;
    $scope.detailsOpenHours = {
        day: "Monday through friday: ",
        open: false,
        start: "00:00",
        end: "00:00"
    }
    
    $scope.$watch('detailsOpenHours', function(newValue, oldValue) {
        if($scope.activeVenue) {
                angular.forEach($scope.activeVenue.open_hours, function(day, i) {
                if(i < 5) {
                    day.open = newValue.open;
                    day.start = newValue.start;
                    day.end = newValue.end;
                }
            })
        }
        
    }, true)
    
    
    
    /*
    * ================ Offices ==================================
    */
    
    $scope.activeOffice = null;
    
    $scope.addNewOffice = function(office) {
        $log.debug("Saving office...");
        
        $scope.activeVenue.offices.push(office);
        $scope.emptyVenue = __emptyVenue;
        
        $location.path("venue/" + $scope.activeVenue._id + "/offices");
        
        $log.debug("Saved office")
    }
    
    $scope.updateOffice = function(index) {
        $log.debug("Office: " + index)
        $scope.activeOffice = index;
        $location.path($location.path() + "/"+index+"/update");
    }
    
    $scope.removeActiveOffice = function() {
       $scope.activeVenue.offices.splice([$scope.activeOffice], 1);
        $location.path("venue/" + $scope.activeVenue._id + "/offices");
    }
    
    
    
    /*
    * ================ Goodies ==================================
    */
    
    $scope.goodieAdd = function(goodie) {
        if($scope.activeVenue.amenities.indexOf(goodie) == -1){
            $scope.activeVenue.amenities.push(goodie);
            $scope.activeVenue.amenities.sort();
        }
    }
    
    $scope.goodieRemove = function(goodie) {
        var index = $scope.activeVenue.amenities.indexOf(goodie);
        if(index != -1)
            $scope.activeVenue.amenities.splice(index, 1);  
    }
    
    $scope.removeTag = function(tagId) {
        $scope.activeVenue.tags.splice(tagId, 1);
    }
    
    $scope.addTag = function(tag) {
        $log.debug("Tag added: " + tag);
        if( $scope.activeVenue.tags.indexOf(tag) == -1){
            $scope.activeVenue.tags.push(tag);
            $scope.activeVenue.tags.sort();
        }
    }
    
    
    
    
    /*
    *   ================ HTTP Requests ==================================
    */
    
    $http.get('/getTemplate').success(function(data, status, headers, config) {
        __emptyVenue = data;
        $scope.emptyVenue = data;
        $log.debug($scope.emptyVenue);
    })
    
    $http.get('/getVenues').success(function(data, status,  headers, config) {
        $scope.venues = data;
    });
    
    $scope.getGoogleData = function(address) {
        
        $http.post('/getGoogleData', {googleAddress: address})
        .success(function(data, status, headers, config) {
            if(status === 200) {
                if($location.path() === "/venue/add") {
                    console.log(data.results[0]);
                    updatePositionData($scope.emptyVenue, data.results[0]);
                } 
            }
        });
    }
    
    $scope.saveActiveVenue = function() {
        if(updateVenue) {
            $http.post('/saveVenue', {venue: $scope.activeVenue})
            .success(function(data, status, headers, config) {
                if(status === 200) {
                    $log.debug("Successfully saved venue");
                }
            });
            updateVenue = false;
        } 
    }
    
    function updatePositionData(venue, dataList) {
        
        angular.forEach( dataList.address_components, function(data, i) {
            switch (data.types[0]) {
                case 'street_number': 
                    venue.location.street_number = data.long_name; break;
                case 'route': 
                    venue.location.street = data.long_name; break;
                case 'postal_town': 
                    venue.location.postal_town = data.long_name; break;
                case 'postal_code': 
                    venue.location.postal_code = parseInt(data.long_name); break;
                case 'administrative_area_level_1': 
                    venue.state = data.long_name; break;
                case 'administrative_area_level_2': 
                    venue.location.county = data.long_name; break;
                case 'country': 
                    venue.location.country = data.long_name; break;
            }
        });
        venue.location.lat = dataList.geometry.location.lat;
        venue.location.lng = dataList.geometry.location.lng;
        venue.location.formatedAddress = dataList.formated_address;
        
    }
}]);