const express = require('express')
const todos = require('../router/todos')
const user = require('../router/user')
const auth = require('../router/auth')
const error = require('../middleware/error')

module.exports = function(app){
    app.use(express.json())
    app.use(express.static('public'))
    app.use('/api/todos', todos)
    app.use('/api/user', user)
    app.use('/api/auth', auth)
    app.use(error)
}