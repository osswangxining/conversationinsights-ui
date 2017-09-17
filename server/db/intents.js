const db = require('./db')

function getSingleIntent(req, res, next) {
  var intentID = parseInt(req.params.intent_id);
  db.one('select * from intents where intent_id = $1', intentID)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAgentIntents(req, res, next) {
  console.log("intents.getAgentIntents");
  var AgentID = parseInt(req.params.agent_id);
  db.any('select * from intents where agent_id = $1', AgentID)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getUniqueIntents(req, res, next) {
  console.log("intents.getUniqueIntents");
  var IntentID = parseInt(req.params.intent_id);
  db.any('select * from unique_intent_entities where intent_id = $1', IntentID)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createAgentIntent(req, res, next) {
  console.log("intents.createAgentIntent");
  db.any('insert into intents(agent_id, intent_name)' +
      'values(${agent_id}, ${intent_name})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeIntent(req, res, next) {
  var intentID = parseInt(req.params.intent_id);
  db.result('delete from intents where intent_id = $1', intentID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount}'
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAgentIntents: getAgentIntents,
  createAgentIntent: createAgentIntent,
  getSingleIntent: getSingleIntent,
  removeIntent: removeIntent,
  getUniqueIntents: getUniqueIntents
};
