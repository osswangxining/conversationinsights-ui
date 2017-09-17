angular
.module('app')
.controller('AsideController', AsideController)

function AsideController($scope, $rootScope, $interval, NLU_Parse, NLU_Config, NLU_Version, Settings, NLU_Status, IntentResponse) {
  $scope.test_text = 'I want italian food in new york';
  $scope.test_text_response = {};
  $rootScope.config = {}; //Initilize in case server is not online at startup
  var configcheck;

  NLU_Version.get().$promise.then(function(data) {
    $rootScope.version = data.version;
  });

  Settings.query(function(data) {
      $rootScope.settings = data;

      for(var key in data) {
        $rootScope.settings[data[key]['setting_name']] = data[key]['setting_value'];
      }

      if ($rootScope.settings['refresh_time'] !== "-1" && $rootScope.settings['refresh_time'] !== undefined) {
        configcheck = $interval(getConfig, parseInt($rootScope.settings['refresh_time']));
      }

      getConfig();
  });

  $scope.$on('executeTestRequest', function(event, expression_text) {
    $scope.test_text = expression_text;
    $scope.executeTestRequest();
  });

  $scope.$on("$destroy", function(){
    $interval.cancel(configcheck);
  });

  function getConfig() {
    // Add a status param to config and set to 0 if server is offline
    NLU_Status.get(function(statusdata) {
      NLU_Config.get().$promise.then(function(data) {
        $rootScope.config = data.toJSON();
        $rootScope.config.isonline = 1;
        $rootScope.config.server_model_dirs_array = getAvailableModels(statusdata.available_models);
        if ($rootScope.config.server_model_dirs_array.length > 0) {
          $rootScope.modelname = $rootScope.config.server_model_dirs_array[0].name;
        } else {
          $rootScope.modelname = "Default";
        }
      }, function(error) {
        // error handler
        $rootScope.config.isonline = 0;
      });
    });
  }

  $scope.executeTestRequest = function() {
    $scope.response_text=''
    var options = {};
    var model = '';
    if ($scope.modelname !== 'Default') {
      model = $scope.modelname;
    }
    options = {query: $scope.test_text, model: model};
    var inputData = {'q':$scope.test_text};
    NLU_Parse.parse(options, JSON.stringify(inputData), function(data) {
      console.log(data.intent);
      console.log(data.entities);
      console.log(data.intent_ranking);
      var t = {'intent': data.intent, 'entities': data.entities, 'intent_ranking': data.intent_ranking};
      $scope.test_text_response = t;
      $scope.response_text = data.intent.name;
    });
  }
}
