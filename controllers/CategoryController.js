const {Router} = require('express')
const m$category = require('../modules/category.module')
const response = require('../helpers/response')
const auth = require('../middleware/auth_middleware')
const CategoryController = Router()

CategoryController.get('/',auth, async (req, res)=>{
    const list = await m$category.listCategory()
    response.sendResponse(res, list)
})

CategoryController.post('/',auth, async(req, res)=>{
    const add = await m$category.createCategory(req.body)
    response.sendResponse(res, add)
})

CategoryController.put('/:id',auth, async (req,res) => {
    
    const update = await m$category.updateCategory(req.body, req.params.id)
   response.sendResponse(res, update)
})
CategoryController.delete('/:id',auth, async (req,res) => {
    
    const del = await m$category.destroyCategory( req.params.id)
   response.sendResponse(res, del)
})

module.exports = CategoryController