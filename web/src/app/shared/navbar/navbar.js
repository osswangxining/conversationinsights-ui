angular
.module('app')
.controller('NavBarController', NavBarController)

function NavBarController($scope, $rootScope) {
  $scope.toggleAside = function () {
    if (angular.element('body').hasClass('aside-menu-hidden')) {
      angular.element('body').removeClass('aside-menu-hidden').addClass('aside-menu-fixed');
    } else {
      angular.element('body').removeClass('aside-menu-fixed').addClass('aside-menu-hidden');
    }
  }

  $scope.toggleSidebar = function () {
    if (angular.element('body').hasClass('sidebar-fixed')) {
      angular.element('body').removeClass('sidebar-fixed').addClass('sidebar-hidden');
    } else {
      angular.element('body').addClass('sidebar-fixed').removeClass('sidebar-hidden');
    }
  }

}
