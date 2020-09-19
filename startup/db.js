const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function(){
    mongoose.connect('mongodb://localhost/three60-db')
    .then(() => winston.info("Connected to Database..."))
}