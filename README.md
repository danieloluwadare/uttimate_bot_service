# uttimate_bot_service

# Solution Overview

### Technologies Used
- Nodejs Express Framework
- Mongodb database
- mongodb-memory-server InMemory Database for integration test


### Starting the project

- copy .env.example file and rename it to .env file
- Run <code>docker-compose up --build</code> to build service and start it on port 5000

### Addition features
- save users input, the response sent from the intent service, the reply sent to the user
- get intent that do not have configured reply in the database and configure reply with its minimum confidence score
- create endpoint to fetch failed response. (for analysis)
- if external customer service personal are available route the request of a user to them when intent service can't interpret intent
