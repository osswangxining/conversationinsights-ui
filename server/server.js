var express = require('express');
var proxy = require('http-proxy-middleware');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var routes = require('./routes/index')
var cors = require('cors')
const db = require('./db/db')

app.use(cors())

const url = require('url');

app.use(bodyParser.json());

/** Serve static files for UI website on root / */
app.use('/', express.static('web/src/'));

app.use('/api/v2/', routes);

app.use('/api/v2/agents', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/intents', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/expressions', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/parameters', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/entities', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/synonyms', function(req, res) { executeRequest(req, res)} );
app.use('/api/v2/variants', function(req, res) { executeRequest(req, res)} );

function executeRequest(req, res) {
  try {
    //Strip /api off request
    var request_url = req.originalUrl.split('/api/v2')[1];

    console.log(req.method + ": " + request_url + " -> " + process.env.npm_package_config_mynluserver + request_url);

    var path = url.parse(req.url).pathname.split('/').pop();

    if (req.method === 'GET') {
      myresponse = "";
      response_text = "";

      request(process.env.npm_package_config_mynluserver + request_url, function (error, response, body) {
        try {
          if (body !== undefined) {
            sendOutput(200, res, body);
            // TODO: Check that the response includes the required fields, otherwise, return the incomplete flag? Maybe this should rather be in the backend
          } else {
            sendOutput(404, res, '{"error" : "Server Error"}');
          }
          //res.end();
        } catch (err) {
          console.log(err);
        }
      });
    } else if (req.method === 'OPTIONS') {
      try {
        sendOutput(200, res);
      } catch (err) {
        console.log(err);
      }
    } else if (req.method === 'POST' && path == 'parse') {

    } else {
      request({
        method: req.method,
        uri: process.env.npm_package_config_mynluserver + request_url,
        body: JSON.stringify(req.body),
        headers: req.headers
      }, function (error, response, body) {
        try {
          sendOutput(200, res, "");
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      });
    }
  } catch (err) {
    console.log("Error: " + err);
  }
}

app.use('/api/v2/conversationinsights/', function(req, res) {
  try {
    //Strip /api off request
    var request_url = req.originalUrl.split('/conversationinsights')[1];

    console.log(req.method + ": " + request_url + " -> " + process.env.npm_package_config_mynluserver + request_url);

    var path = url.parse(req.url).pathname.split('/').pop();

    if (req.method === 'GET') {
      myresponse = "";
      response_text = "";

      request(process.env.npm_package_config_mynluserver + request_url, function (error, response, body) {
        try {
          if (body !== undefined) {
            if (path == 'parse') {
              myresponse = body;
              getResponseText(JSON.parse(myresponse).intent.name, res);
              augmentParse(res);
            } else {
              sendOutput(200, res, body);
            }
            // TODO: Check that the response includes the required fields, otherwise, return the incomplete flag? Maybe this should rather be in the backend
          } else {
            sendOutput(404, res, '{"error" : "Server Error"}');
          }
          //res.end();
        } catch (err) {
          console.log(err);
        }
      });
    } else if (req.method === 'OPTIONS') {
      try {
        sendOutput(200, res);
      } catch (err) {
        console.log(err);
      }
    } else if (req.method === 'POST' && path == 'parse') {
      myresponse = "";
      response_text = "";

      request({
        method: req.method,
        uri: process.env.npm_package_config_mynluserver + request_url,
        body: JSON.stringify(req.body),
        headers: req.headers
      },  function (error, response, body) {
        try {
          if (body !== undefined) {
              myresponse = body;
              getResponseText(JSON.parse(myresponse).intent.name, res);
              augmentParse(res);
          } else {
            sendOutput(404, res, '{"error" : "Server Error"}');
          }
          //res.end();
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      request({
        method: req.method,
        uri: process.env.npm_package_config_mynluserver + request_url,
        body: JSON.stringify(req.body),
        headers: req.headers
      }, function (error, response, body) {
        try {
          sendOutput(200, res, "");
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (path == 'parse') {
      var model = getParameterByName('model', request_url) !== undefined ? getParameterByName('model', request_url) : "default";
      logRequest(req, path, {model: model, intent: '', query: getParameterByName('q', request_url)});
    } else {
      logRequest(req, path);
    }
  } catch (err) {
    console.log("Error: " + err);
  }
});

function augmentParse(res){
  if (myresponse !== '' && response_text !== '') {
    var objResponse = JSON.parse(myresponse);
    objResponse.response_text = response_text;
    sendOutput(200, res, JSON.stringify(objResponse));
  }
}

function sendOutput(http_code, res, body) {
  res.writeHead(http_code, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  if (body !== "") {
    res.write(body);
  }
  res.end();
}

function getResponseText(intent_name, res) {
  db.any('SELECT responses.response_text FROM responses, intents where responses.intent_id = intents.intent_id and intents.intent_name = $1 order by random() LIMIT 1', intent_name)
    .then(function (data) {
      if (data.length > 0) {
        response_text = data[0].response_text;
      } else {
        response_text = undefined;
      }
      augmentParse(res);
    })
    .catch(function (err) {
      //res.write(err);
      console.log(err);
    });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function logRequest(req, type, data) {
  try {
    var obj = {};
    obj.ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    obj.query = req.originalUrl;
    obj.event_type = type;
    obj.event_data = data;

    db.any('insert into nlu_log(ip_address, query, event_type, event_data)' +
      'values(${ip_address}, ${query}, ${event_type}, ${event_data})',
      obj)
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log("Error: " + err);
  }
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

app.listen(5001);
console.log("The UI application is running on port 5001.")
