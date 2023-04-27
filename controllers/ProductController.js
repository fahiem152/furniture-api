const {Router} = require("express")
const m$product = require('../modules/product.module')
const response = require('../helpers/response')
const auth = require('../middleware/auth_middleware')
const ProductController = Router()


ProductController.get('/', auth, async (req, res)=>{
    const category_id = req.query.category_id
    const brand_id = req.query.brand_id
    const sortByStock = req.query.sort_by_stock
    // const desc = req.query.sort_by
    let page = parseInt(req.query.page) || 1 // halaman yang diminta, default: 1
    let perpage = parseInt(req.query.perpage) || 10; // jumlah item per halaman, default: 10

    const list = await m$product.listProduct({category_id, brand_id,  perpage, page,  sortByStock})
    response.sendResponse(res, list)
})
// ProductController.get('/',auth ,  async (req, res)=>{
//     const category_id = req.query.category_id
//     const brand_id = req.query.brand_id

//     const list = await m$product.listProduct({category_id, brand_id, })
//     response.sendResponse(res, list)
// })

ProductController.post('/', auth, async (req, res)=>{
    const create = await m$product.createProduct(req.body)
    response.sendResponse(res, create)
})

ProductController.put('/:id',  auth, async (req, res)=>{
    const update = await m$product.updatedProduct(req.body, req.params.id)
    response.sendResponse(res, update);
})

ProductController.delete('/:id',  auth, async(req, res)=>{
    const del = await m$product.destroyProduct(req.params.id)
    response.sendResponse(res, del)
})

ProductController.get('/sort_by_stock', auth, async(req, res)=>{
    const desc = req.query.sort_by
    const list = await m$product.listProductSortByStock({desc})
    response.sendResponse(res, list)
})

module.exports = ProductController