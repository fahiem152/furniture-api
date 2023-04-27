const { Router } = require('express')
const m$brand = require('../modules/brand.module')
const response = require('../helpers/response')
const auth = require('../middleware/auth_middleware')
const BrandController = Router()

BrandController.get('/',auth, async (req,res) => {
    
    const list = await m$brand.listBrand()
    response.sendResponse(res, list)
})
BrandController.post('/', auth,  async (req,res) => {
    
    const add = await m$brand.createBrand(req.body)
   response.sendResponse(res, add)
})
BrandController.put('/:id', auth,  async (req,res) => {
    
    const update = await m$brand.updateBrand(req.body, req.params.id)
   response.sendResponse(res, update)
})
BrandController.delete('/:id', auth,  async (req,res) => {
    
    const del = await m$brand.destroyBrand( req.params.id)
   response.sendResponse(res, del)
})

module.exports = BrandController