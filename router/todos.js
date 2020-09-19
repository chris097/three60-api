const validObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const { Todo, validation } = require('../models/todo')
const _ = require('lodash')
const router = express.Router()

//GET- all todos
router.get('/', async (req, res ) => {
    const todo = await Todo.find()

    res.send(todo)
})

//GET- id
router.get('/:id', validObjectId, async (req, res) => {
    const todo = await Todo.findById(req.params.id)
    //validation
    if(!todo) return res.status(404).send('They give ID was not found.')
    //send to the client
    res.send(todo)
})

//POST- 
router.post('/', auth, async(req, res) => {
    
    const { error } = validation(req.body)
    if( error ) return res.status(400).send(error.details[0].message)

    let todo = new Todo(_.pick(req.body, ['tittle', 'description']))

    todo = await todo.save()

    res.send(todo)
})

//PUT- upadate
router.put('/:id', [auth, validObjectId], async (req, res) => {
    const { error } = validation(req.body)
    if( error ) return res.status(400).send(error.details[0].message)

    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        (_.pick(req.body, ['tittle', 'description'])),
        {new: true}
        )
    //validation
    if(!todo) return res.status(404).send('They give ID was not found.')

    //send to client
    res.send(todo)
})

//DELETE
router.delete('/:id', [auth, validObjectId, admin], async(req, res) => {
    const todo = await Todo.findByIdAndRemove(req.params.id)
    //validation
    if(!todo) return res.status(404).send('They give ID was not found.')
    
    res.send(todo)
})

module.exports = router;
