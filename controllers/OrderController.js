const {Router} = require('express');
const m$order = require('../modules/order.module');
const response = require('../helpers/response');
const auth = require('../middleware/auth_middleware');


const OrderController = Router();

OrderController.get('/',auth, async (req, res)=>{
    const { delivery, takeaway, delivered, pending, tanggal, enddate } = req.query;
    let page = parseInt(req.query.page) || 1 // halaman yang diminta, default: 1
    let perpage = parseInt(req.query.perpage) || 10; // jumlah item per halaman, default: 10
    const list = await m$order.listOrder({delivery, takeaway, delivered, pending, perpage, page, tanggal, enddate })
    response.sendResponse(res, list)
})
OrderController.get('/:userId',auth, async (req, res)=>{
    const userId = req.params.userId
     const { delivery, takeaway, delivered, pending } = req.query;
    let page = parseInt(req.query.page) || 1 // halaman yang diminta, default: 1
    let perpage = parseInt(req.query.perpage) || 10; // 
    const list = await m$order.listOrderByUser({userId, delivery, takeaway, delivered, pending, perpage, page})
    response.sendResponse(res, list)
})
OrderController.get('/date/:tanggal',auth, async (req, res)=>{
    let tanggal = req.params.tanggal
    let enddate = req.query.enddate
    const category_id = req.query.category_id
    const brand_id = req.query.brand_id

    const list = await m$order.listOrderByDate({tanggal : tanggal, enddate: enddate, category_id: category_id, brand_id: brand_id})
    response.sendResponse(res, list)
})
OrderController.get('/category/date/:tanggal',auth, async (req, res)=>{
    let tanggal = req.params.tanggal
    let enddate = req.query.enddate
    const category_id = req.query.category_id
    // const brand_id = req.query.brand_id

    const list = await m$order.listOrderByDateCategory({tanggal : tanggal, enddate: enddate, category_id: category_id, })
    response.sendResponse(res, list)
})
OrderController.get('/brand/date/:tanggal',auth, async (req, res)=>{
    let tanggal = req.params.tanggal
    let enddate = req.query.enddate
    const brand_id = req.query.brand_id
    // const brand_id = req.query.brand_id

    const list = await m$order.listOrderByDateBrand({tanggal : tanggal, enddate: enddate, brand_id: brand_id, })
    response.sendResponse(res, list)
})
OrderController.get('/user/date/:tanggal',auth, async (req, res)=>{
    let tanggal = req.params.tanggal
    let enddate = req.query.enddate
    const userid = req.query.userid
        // const brand_id = req.query.brand_id

    const list = await m$order.listOrderByDateUser({tanggal : tanggal, enddate: enddate, userid: userid, })
    response.sendResponse(res, list)
})
OrderController.get('/page',auth, async (req, res)=>{
    let page = parseInt(req.query.page) || 1 // halaman yang diminta, default: 1
    let perpage = parseInt(req.query.perpage) || 5; // jumlah item per halaman, default: 20
    const list = await m$order.listOrderByPage({perpage : perpage, page: page})
    response.sendResponse(res, list)
})
OrderController.post('/',auth, async(req, res)=>{

    const add = await m$order.createOrder(req.body,  )
    response.sendResponse(res, add)
})
OrderController.put('/:id', auth, async(req, res)=>{
    const update = await m$order.updateOrder(req.body, req.params.id)
    response.sendResponse(res, update)
})
OrderController.delete('/:id', auth, async(req, res)=>{
    const del = await m$order.destroyOrder(req.params.id)
    response.sendResponse(res, del)
})

module.exports = OrderController