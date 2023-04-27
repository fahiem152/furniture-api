const {Router} = require('express')
const m$incomeProduct = require('../modules/incomeProduct.module')
const response = require('../helpers/response')
const auth = require('../middleware/auth_middleware')
const IncomeProductController = Router()

IncomeProductController.get('/',auth, async (req, res)=>{

    let starDate = req.query.starDate
    let endDate = req.query.endDate
    let page = req.query.page
    let perpage = req.query.perpage
    const list = await m$incomeProduct.listIncomeProduct({starDate : starDate, endDate: endDate, page: page, perpage: perpage})
    response.sendResponse(res, list)
})

IncomeProductController.get('/date/:tanggal',auth, async (req, res)=>{
    let tanggal = req.params.tanggal
    let enddate = req.query.enddate
    const list = await m$incomeProduct.listIncomeProductByDate({tanggal : tanggal, enddate: enddate})
    response.sendResponse(res, list)
})
IncomeProductController.get('/page',auth, async (req, res)=>{
    let page = parseInt(req.query.page) || 1 // halaman yang diminta, default: 1
    let perpage = parseInt(req.query.perpage) || 5; // jumlah item per halaman, default: 20
    const list = await m$incomeProduct.listIncomeProductByPage({perpage : perpage, page: page})
    response.sendResponse(res, list)
})


// IncomeProductController.get('/:id',auth, async (req, res)=>{
//     const list = await m$incomeProduct.listIncomeProductById(req.params.id)
//     response.sendResponse(res, list)
// })

IncomeProductController.post('/',auth, async(req, res)=>{
    const add = await m$incomeProduct.createIncomeProduct(req.body)
    response.sendResponse(res, add)
})


IncomeProductController.put('/:id', auth, async(req, res)=>{
    const update = await m$incomeProduct.updateIncomeProduct(req.body, req.params.id)
    response.sendResponse(res, update)
})

IncomeProductController.delete('/:id', auth, async(req, res)=>{
    const del = await m$incomeProduct.destroyIncomeProduct(req.params.id)
    response.sendResponse(res, del)
})


module.exports = IncomeProductController