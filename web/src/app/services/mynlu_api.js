app.factory('NLU_Parse', function($resource) {
  return $resource(api_endpoint_v2 + '/conversationinsights/parse', {q:'@id', model: '@id'}, {
    parse: {
      method:'POST'
    }
  });
});

app.factory('NLU_AgentModel', function($resource) {
  return $resource(api_endpoint_v2 + '/conversationinsights/agent/:agentId/model', {agentId:'@id'});
});

app.factory('NLU_Status', function($resource) {
  return $resource(api_endpoint_v2 + '/conversationinsights/status');
});

app.factory('NLU_Config', function($resource) {
  return $resource(api_endpoint_v2 + '/conversationinsights/config');
});

app.factory('NLU_Version', function($resource) {
  return $resource(api_endpoint_v2 + '/conversationinsights/version');
});

/* TODO: future feature
app.factory('Set_NLU_Config', function($resource) {
  return $resource(api_endpoint + '/setconfig?:key=:value', {key: '@id', value: '@id'});
});
*/
