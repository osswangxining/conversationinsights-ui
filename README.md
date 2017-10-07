## Features

- Training data stored in DB
- UI for managing training data
- Initiate training from UI
- Review configuration and component pipelines
- Log requests for usage tracking, history, improvements
- Usage dashboard
- Easily execute intent parsing using different models


## Getting Started

Start this as one nodejs application.


### Prerequisites

[MongoDB](https://www.mongodb.com/) - Used for storing training data (entities, intents, synonyms, etc.)

[Node.js/npm](https://nodejs.org/en/) - Serves UI and acts as a middleware server for logging to the mongodb DB)


### Installing

Please ensure prerequisites are fulfilled

Clone/download the UI repository

```

npm install
```

## Running

Run npm start from the server folder

```
npm start
```

- Update your package.json file to include the IP Addresses of your mynlu server and the connection string of your postgres instance.
- Update your web/src/app.js file to include the IP Addresses of your local middleware server (no need to change this if they are running on the same instance)

Your web application should be available on http://localhost:5001
