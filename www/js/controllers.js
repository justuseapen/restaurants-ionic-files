angular.module('controllers', [])

.controller('ListCtrl', function($scope, $http, $ionicPlatform, $cordovaGeolocation, restaurantService) {

    $scope.restaurants;

    //attach service function to scope
    $scope.setSelected = restaurantService.setSelected;

    //refresh restaurant list whenever we enter this view
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.refreshLocation();
    });

    $scope.refreshLocation = function() {
        var posOptions = {
            timeout: 10000,
            maximumAge: 30000,
            enableHighAccuracy: false
        };

        $ionicPlatform.ready(function() {
            // $scope.getRestaurants();
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    userLat = position.coords.latitude;
                    userLong = position.coords.longitude;
                    $scope.getRestaurants(userLat, userLong);
                }, function(err) {
                    // error
                });
        });
    }


    //function needs to be attached to scope for pull to refresh
    $scope.getRestaurants = function(userLat, userLong) {
        $http.get('http://grewis-test.apigee.net/api-mobile-app/yelp?ll=' + userLat + ',' + userLong)
            .success(function(data, status, headers, config) {
                console.log(data)
                $scope.restaurants = data.entities;
                $scope.$broadcast('scroll.refreshComplete');
                angular.element(document.querySelector('.spinnerdiv')).addClass('hidden');
            });
    }
})

.controller('DetailsCtrl', function($scope, $http, restaurantService) {

    $scope.restaurant;
    $scope.reviews;
    $scope.stars;
    $scope.map;
    $scope.restID;
    $scope.userLocation;
    $scope.markerOptions;
    $scope.restID;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.restaurant = restaurantService.getSelected();
        $scope.restID = $scope.restaurant.restID;
        $scope.userLocation = {
            latitude: $scope.restaurant.location.latitude,
            longitude: $scope.restaurant.location.longitude
        }

        $scope.map = {
            center: $scope.userLocation,
            zoom: 15
        };
        $scope.markerOptions = {
            animation: google.maps.Animation.DROP
        };

        getReviews($scope.restID);
    });

    var getReviews = function(restID) {
        $http.get('http://api.usergrid.com/grewis/sandbox/reviews?limit=999&ql=restID=' + restID + ' order by modified DESC')
            .success(function(data, status, headers, config) {
                angular.element(document.querySelector('.reviewsdiv')).addClass('hidden');
                $scope.reviews = data.entities;
                if ($scope.reviews.length <= 0) {
                    angular.element(document.querySelector('.first-review')).removeClass('hidden');
                }
            });
    }

    $scope.getRating = function(ratingIndex) {
        var rating = parseInt($scope.reviews[ratingIndex].rating);
        return new Array(rating)
    }

})

.controller('FormCtrl', function($scope, $http, $ionicHistory, restaurantService) {
    $scope.restaurant;
    $scope.restID;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.restaurant = restaurantService.getSelected();
        $scope.restID = $scope.restaurant.restID;
    });

    $scope.createReview = function(review) {
        var payload = {
            restID: $scope.restID,
            title: review.title,
            reviewer: review.name,
            rating: +review.rating,
            body: review.body
        }
        $http.post('http://api.usergrid.com/grewis/sandbox/reviews', payload)
            .success(function(data, status, headers, config) {
                review.title = null;
                review.name = null;
                review.rating = null;
                review.body = null;
                $ionicHistory.goBack();
            })
    }
});