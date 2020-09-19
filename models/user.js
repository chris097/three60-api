const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    email:{
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1050,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token;
}
const User = mongoose.model('User', userSchema)


function userValidation(user){
    const schema = {
        username: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1050).required()
    }

    return Joi.validate(user, schema)
}

exports.User = User;
exports.userValidation = userValidation;
