const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex)
    process.exit(1)
})

module.exports = function (){
    winston.handleExceptions(
    new winston.transports.File({filename: 'uncaughtExceptions.log'}))

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1)
})

    winston.add(winston.transports.File, { filename: "logfile.log"})
    winston.add(winston.transports.MongoDB, { 
        db: "mongodb://localhost/three60-db",
        level: "info"
    })
}