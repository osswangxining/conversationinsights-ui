angular
.module('app')
.controller('AddIntentController', AddIntentController)

function AddIntentController($scope, Agent, Intent) {
  Agent.get({agent_id: $scope.$routeParams.agent_id}, function(data) {
      $scope.agent = data;
  });

  $scope.addIntent = function(params) {
    this.formData.agentId = $scope.$routeParams.agent_id;
    Intent.save(this.formData).$promise.then(function(resp) {
      $scope.formData.name = "";
      $scope.go('/agent/' + $scope.$routeParams.agent_id);
    });
  };
}
