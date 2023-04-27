const m$userRole = require('../modules/userRole.module')
const {Router} = require('express')
const response = require('../helpers/response')
const { prisma } = require('@prisma/client')

const UserRoleController = Router()

UserRoleController.get('/', async (req, res)=>{
    const list = await m$userRole.listUserRole()
    response.sendResponse(res, list)
})

UserRoleController.post('/', async (req, res)=>{
    const add = await m$userRole.createUserRole(req.body)
    response.sendResponse(res, add)
})

UserRoleController.get('/:id', async(req, res)=>{
    const detail = await m$userRole.detailUserRole(req.params.id)
    response.sendResponse(res, detail)
})

UserRoleController.put('/:id', async (req, res )=>{
    const update = await m$userRole.updateUserRole(req.body, req.params.id)
    response.sendResponse(res, update)
})

UserRoleController.delete('/:id', async(req, res)=>{
    const del = await m$userRole.destroyUserRole(req.params.id)
    response.sendResponse(res, del)
})
module.exports = UserRoleController