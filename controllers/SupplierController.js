const {Router} = require('express')
const m$supplier = require('../modules/supplier.module')
const response = require('../helpers/response')
const auth = require('../middleware/auth_middleware')
const SupplierController = Router()

SupplierController.get('/', auth, async (req,res) => {
    const list = await m$supplier.listSupplier()
    response.sendResponse(res, list)
}
)
SupplierController.post('/', auth,  async (req,res) => {
    const add = await m$supplier.createSupplier(req.body)
   response.sendResponse(res, add)
} )
SupplierController.put('/:id', auth,  async (req,res) => {
    const update = await m$supplier.updateSupplier(req.body, req.params.id)
   response.sendResponse(res, update)
})
SupplierController.delete('/:id', auth,  async (req,res) => {
    const del = await m$supplier.destroySupplier( req.params.id)
   response.sendResponse(res, del)
})

// SupplierController.get('/sort_by_incomeProduct', auth, async (req,res) => {
//     const desc = req.query.sort_by
//     const list = await m$supplier.listSupplierSortByIncomeProduct({desc})
//     response.sendResponse(res, list)
// })

SupplierController.get('/sort_by_incomeProduct_quantity', auth, async(req, res)=>{
    const desc = req.query.sort_by
    const list =await m$supplier.listSupplierSortByIncomeProductQuantity({desc})
    response.sendResponse(res, list)
})

module.exports = SupplierController