const winston = require('winston')
const express = require('express')
const app = express()

require('./startup/logging')();
require('./startup/router')(app);
require('./startup/db')();
require('./startup/config')()
require('./startup/prod')(app)

const port = process.env.PORT || 3030;
const server = app.listen(port, () => winston.info(`listening on port ${port}`))

module.exports = server;


