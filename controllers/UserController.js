const m$user = require('../modules/user.module')
const {
    Router
} = require('express')
const response = require('../helpers/response')
const UserController = Router();

UserController.get('/', async (req, res) => {
    const list = await m$user.listUser();
    response.sendResponse(res, list);
});
UserController.post('/', async (req, res) => {
    const add = await m$user.createUser(req.body);
    response.sendResponse(res, add);
});

UserController.get('/:id', async (req, res) => {
    const detail = await m$user.detailUser(req.params.id)
    response.sendResponse(res, detail)
})

UserController.put('/:id', async (req, res) => {
    const update = await m$user.updateUser(req.body, req.params.id)
    response.sendResponse(res, update)
})

UserController.delete('/:id', async (req, res) => {
    const destory = await m$user.destroyUser(req.params.id)
    response.sendResponse(res, destory)
})
module.exports = UserController