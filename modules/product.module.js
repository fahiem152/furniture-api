const prisma = require('../helpers/database');

const Joi = require('joi');


class _product{
    listProduct = async ({category_id , brand_id ,  perpage, page,sortByStock })=>{
        try {
            const filters = {}
            if (category_id != undefined) {
                filters.category_id = parseInt(category_id)
            }
            if (brand_id != undefined) {
                filters.brand_id = parseInt(brand_id)
            }
            const listCount = await prisma.product.findMany({
                where: filters
            })
            const totalItems = listCount.length;
            // sorting by stock
    let orderByClause = { updatedAt: 'desc' }
    if (sortByStock !== undefined) {
        if (sortByStock === 'asc') {
          orderByClause = { stock: 'asc' }
        } else if (sortByStock === 'desc') {
          orderByClause = { stock: 'desc' }
        }
      }

            const list = await prisma.product.findMany({
                // skip: (page - 1) * parseInt(perpage),
                // take: parseInt(perpage),
                where: filters,
                orderBy: orderByClause,
                include: {
                    brand: true,
                            category: true
                },
            });
            // console.log('ini adalah current page '+ page);
            // console.log(totalItems);
            // console.log(filters);
            return {
                status: true,
                code: 200,
                message: "Data Product berhasil di ambil",
                data: list,
                // currentPage: parseInt(page),
                // totalPages: Math.ceil(totalItems / parseInt(perpage)),
            };
          
        
        } catch (error) {
            console.error('listProduct module Error: ', error)
            return{
                status: false, error
            }
        }
    }

    createProduct = async (body)=>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                description: Joi.string().required(),
                price: Joi.number().required(),
                urlImage: Joi.string().required(),
                brand_id: Joi.number().required(),
                category_id: Joi.number().required()
            }).options({
                abortEarly: false
            })

            const validation = schema.validate(body)

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            const create = await prisma.product.create({
                data: body
            })
            return{
                status: true,
                code: 201,
                message: "Data Product Berhasil di tambahkan",
                data: create
            }
        } catch (error) {
            console.error('createProduct module Error: ', error)
            return{
                status: false, error
            }
        }
    }

    updatedProduct = async(body, id)=>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                description: Joi.string().required(),
                price: Joi.number().required(),
                urlImage: Joi.string().required(),
                brand_id: Joi.number().required(),
                category_id: Joi.number().required()
            }).options({
                abortEarly: false
            })

            const validation = schema.validate(body)

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }
            const update = await prisma.product.update({
                where:{
                    id: parseInt(id)
                },
                data:{
                    name: body.name,
                    description: body.description,
                    price: body.price,
                    urlImage: body.urlImage,
                    brand_id: body.brand_id,
                    category_id: body.category_id,
                }
            })
            return{
                status: true,
                code: 201,
               
                message: "Data Product Berhasil di update",
                data: update
            }
        } catch (error) {
            console.error('updateProduct module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    destroyProduct = async(id)=>{
        try {
            const destroyProduct = await prisma.product.delete({
                where: {
                    id: Number(id)
                }
            })
            return{
                status: true,
                code: 201,
                message: "Data Berhasil di hapus",
                data: destroyProduct
            }
        } catch (error) {
            console.error('destroyProduct module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    listProductSortByStock = async ({desc})=>{
        try {
            if (desc != undefined) {
                const list = await prisma.product.findMany({
                    orderBy:{
                        stock: 'desc'
                    }
                })
                return{
                    status: true,
                    code: 201,
                    message: "Data Product By Stock descending berhasil di ambil",
                    data: list
                }
            } else{
                const list = await prisma.product.findMany({
                    orderBy:{
                        stock: 'asc'
                    }
                })
                return{
                    status: true,
                    code: 201,
                    message: "Data Product By Stock ascending berhasil di ambil",
                    data: list
                }
            }
        } catch (error) {
                console.error('listProductSortByStock module Error: ', error)
                return{
                    status: false, error
                }
        }
    }
}
module.exports = new _product()