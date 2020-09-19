const request = require('supertest');
const {User} = require('../../models/user'); 
const {Todo} = require('../../models/todo'); 


describe("Auth middleware", () => {

    beforeEach(() => { server = require('../../index') })
    afterEach(async() => { 
        server.close();
        await Todo.remove({});
    });

    let token;

    const exec = () => {
        return request(server)
        .post('/api/todos')
        .set('x-auth-token', token)
        .send({ tittle: 'tittle1', description: 'description'})
    }

    beforeEach(() => {
        token = new User().generateAuthToken()
    })

    it('Should return 401 if no token is provided', async () => {
        token = ''

        const res = await exec();
        
        expect(res.status).toBe(401)
    })

    it('Should return 400 if token is invalid', async () => {
        token = 'a'

        const res = await exec();
        
        expect(res.status).toBe(400)
    })

    it('Should return 200 if token is valid', async () => {
        const res = await exec();
        
        expect(res.status).toBe(200)
    })

})