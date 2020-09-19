const {User} = require('../../../models/user')
const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')


describe('user.generateAuthToken', () => {
    it('Should return valid JWT token', () =>{
        const payLoad = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const user = new User(payLoad)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        expect(decoded).toMatchObject(payLoad)
    })
})