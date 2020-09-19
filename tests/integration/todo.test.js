const request = require('supertest');
const {Todo} = require('../../models/todo'); 
const {User} = require('../../models/user'); 
const mongoose = require('mongoose');
let server;



describe('/api/todos', () => {
    beforeEach(() => { server = require('../../index') })
    afterEach(async() => { 
        server.close();
        await Todo.remove({})  
    })

    describe('GET /', () => {
        it("it should return all todos", async() => {
            await Todo.collection.insertMany([
                {tittle: "todos1", decription: "todos1"},
                {tittle: "todos2", decription: "todos2"}
            ])

            const res = await request(server).get('/api/todos')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)

            expect(res.body.some(g => g.tittle === 'todos1')).toBeTruthy()
            expect(res.body.some(g => g.tittle === 'todos2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('Should return a todo if a valid a id is passed', async() => {
            const todo = new Todo({tittle: 'todos1', description: 'description'})
            await todo.save()

            const res = await request(server).get('/api/todos/' + todo._id)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('tittle', todo.tittle)
        })

        it('Should return 404 if invalid id is passed', async() => {
            const id = mongoose.Types.ObjectId()
            const res = await request(server).get('/api/todos/' + id)

            expect(res.status).toBe(404)
        })
    })


    describe('POST /', () => {
        let token;
        let tittle;
        let description;

        const exec = async() => {
            return await request(server)
            .post('/api/todos')
            .set('x-auth-token', token)  
            .send({tittle, description})
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
            tittle = 'tittle';
            description = 'description';
        })
        
        it('should return 401 if client is not logged in', async() => {
            token  = '';

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if todo is less than 5 character', async() => {
            tittle = '1234'
            description = "1234"
            
            const res = await exec()
            
            expect(res.status).toBe(400)
        })

        it('should return 400 if todo is more than 50 character', async() => {
            tittle = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should save the todo if it is valid', async() => {
            await exec()
            const todo = await Todo.find(({ tittle: 'tittle', description: 'description'}))

            expect(todo).not.toBeNull()
        })

        it('should return todo if it is valid', async() => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('tittle', 'tittle')
        })
    })

    describe('PUT /:id', () => {
        let token;
        let newName;
        let newDesc;
        let todo;
        let id;

        const exec = async () => {
            return await request(server)
            .put('/api/todos/' + id)
            .set('x-auth-token', token)
            .send({tittle: newName, description: newDesc})
        }

        beforeEach(async () => {
            todo = new Todo({tittle: 'names1', description: 'description'})
            await todo.save()

            token = new User().generateAuthToken()
            id = todo._id
            newName = 'updateName';
            newDesc = 'updateDesc'
        })

        it('should return 401 if client is not logged in', async() => {
            token = '';
            
            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if todo is less than 5 characers', async() => {
            newName = '1234'
            newName = '1234'

            const res = await exec();

            expect(res.status).toBe(400)
        })

        it('should return 400 if todo is more than 50 characters', async() =>{
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400)
        })

        it('should return 404 if id is invalid', async() => {
            id = 1;

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if names with the given id was not found', async() =>{
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404)
        })

        it('should return the todos if input is valid', async() => {
            await exec();

            const updateTodo = await Todo.findById(todo._id);

            expect(updateTodo.todo).toBe(newName)
        })

        it('should return the updated todos if it is valid', async() =>{
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('tittle', newName)
        })
    })

    describe('DELETE /:id', () => {
        let token;
        let todo;
        let id;

        const exec = async() => {
            return await request(server)
            .delete('/api/todos/' + id)
            .set('x-auth-token', token)
            .send()
        }

        beforeEach(async() => {
            todo = new Todo({ tittle: 'tittle', description: 'description'})
            await todo.save()

            id = todo._id;
            token = new User({ isAdmin: true}).generateAuthToken();
        })

        it('should return 401 if todo is not login', async() => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 404 if id is invalid', async() => {
            id = 1;

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if no todo with the given id was found', async() => {
            id = mongoose.Types.ObjectId();

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should delete the todo if input is valid', async() => {
            await exec()

            const todoInDb = await Todo.findById(id)

            expect(todoInDb).toBeNull()
        })

        it('should return the removed todo', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', todo._id.toHexString())
            expect(res.body).toHaveProperty(todo.tittle)
        })
    })
})

