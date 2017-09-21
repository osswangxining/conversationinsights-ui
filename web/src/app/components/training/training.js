angular
.module('app')
.controller('TrainingController', TrainingController)

function TrainingController($scope, $rootScope, $interval, $http, NLU_Status, Agent, Intents, Expressions, ExpressionParameters, NLU_Config
  , NLU_AgentModel) {
  var exportData;
  var statuscheck = $interval(getMynluStatus, 6000000);
  $scope.generateError = "";
  $scope.trainings_under_this_process = 0;

  getMynluStatus();

  $scope.$on("$destroy", function(){
    $interval.cancel(statuscheck);
  });

  Agent.query(function(data) {
    $scope.agentList = data;
  });

  $scope.train = function() {
    var agentname = objectFindByKey($scope.agentList, 'id', $scope.agent.id).name;

    var id = new XDate().toString('yyyyMMdd-HHmmss');
    console.log(api_endpoint_v2 + "/conversationinsights/agent/"+$scope.agent.id+"/train?name=" + agentname + "_" + id);
    $http.post(api_endpoint_v2 + "/conversationinsights/agent/"+$scope.agent.id+"/train?name=" + agentname + "_" + id, '{}');
    //$http.post(api_endpoint_v2 + "/conversationinsights/train?name=" + agentname + "_" + id, JSON.stringify(exportData));
    //Minimize training data
    $scope.exportdata = {};
  }

  $scope.savetofile = function() {
      var data = new Blob([JSON.stringify($scope.exportdata, null, 2)], {type: 'text/plain'});

      var a = document.getElementById("a");
      a.download = "trainingdata.txt";
      a.href = URL.createObjectURL(data);
      a.click();
  }

  $scope.getData = function(agent_id) {
    NLU_AgentModel.get({'agentId':agent_id}).$promise.then(function(data) {
      $scope.exportdata = data;
      $scope.generateError = "";
    });
  }


  function getMynluStatus() {
    NLU_Status.get(function(statusdata) {
      NLU_Config.get(function(configdata) {
        try {
          $rootScope.config = configdata.toJSON();
          $rootScope.config.isonline = 1;
          $rootScope.config.server_model_dirs_array = getAvailableModels(statusdata.available_models);
          if ($rootScope.config.server_model_dirs_array.length > 0) {
            $rootScope.modelname = $rootScope.config.server_model_dirs_array[0].name;
          } else {
            $rootScope.modelname = "Default";
          }

          if (statusdata !== undefined || statusdata.available_models !== undefined) {
            $rootScope.available_models = sortArrayByDate(getAvailableModels(statusdata.available_models), 'xdate');
            $rootScope.trainings_under_this_process = statusdata.trainings_queued;
          }
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
}
