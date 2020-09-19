const winston = require('winston')

module.exports = function(err, req, res, next){
    winston.error(500).send(err.message, err)
}