angular
.module('app')
.controller('NLUConfigController', NLUConfigController)

function NLUConfigController($scope, $rootScope, NLU_Config) {
  loadConfig();

  function loadConfig() {
    NLU_Config.get().$promise.then(function(data) {
      $scope.config = data.toJSON();
    });
  }
  /* TODO: Future feature
  $scope.updateConfigParam = function(param_name) {
    var param_value = $('#' + param_name).val();
    Set_NLU_Config.get( {key: param_name, value: param_value} ).$promise.then(function(data) {
      loadConfig();
    });
  }
  */
}
