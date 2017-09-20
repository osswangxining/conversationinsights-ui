angular
.module('app')
.controller('SettingsController', SettingsController)

function SettingsController($scope, Settings) {
  $scope.updateSettings = function(setting_name, setting_value) {
    Settings.update({key: setting_name}, {key: setting_name, value: setting_value}).$promise.then(function() {
      console.log('saved');
    });
  }
}
