angular.module('starter.directives', [])
  .directive('restaurantDetails', function() {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'templates/restaurantDetails.html'
    };
  })
