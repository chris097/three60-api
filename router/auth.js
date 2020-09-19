const {User} = require('../models/user')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()


router.post('/', async(req, res) => {

    const {error} = authValidation(req.body)
    if(error) return res.status(404).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Invalid Email or Password.')
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Email Password.')

    const token = user.generateAuthToken()
    res.send(token)
})

function authValidation(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1050).required()
    }

    return Joi.validate(req, schema)
}

module.exports = router