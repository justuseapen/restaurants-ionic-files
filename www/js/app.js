angular.module('RESTaurants', ['ionic', 'controllers', 'services', 'directives', 'uiGmapgoogle-maps', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.StatusBar) {
            StatusBar.styleLightContent();;
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

    .state('list', {
        url: "/",
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
    })

    .state('details', {
        url: '/details',
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl'
    })

    .state('form', {
        url: '/form',
        templateUrl: 'templates/reviewForm.html',
        controller: 'FormCtrl'
    })

    $urlRouterProvider.otherwise('/');

    $ionicConfigProvider.backButton.previousTitleText(false).text(' ');

});
