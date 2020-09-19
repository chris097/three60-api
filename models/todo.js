const mongoose = require('mongoose')
const Joi = require('joi')

const Todo = mongoose.model('Todos', new mongoose.Schema({
    tittle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    }
}))


function validation(todo){
    const schema = {
        tittle : Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(1000).required()
    }
    return Joi.validate(todo, schema)
}

exports.Todo = Todo;
exports.validation = validation;
