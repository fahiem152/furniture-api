const prisma = require('../helpers/database')
const Joi = require('joi')

class _incomeProduct{
    listIncomeProduct = async({
        starDate,
        endDate,
        page,
        perpage
    }) =>{
        try {
            if (starDate == undefined && endDate == undefined && page == undefined && perpage == undefined) {
                const list = await prisma.incomeProduct.findMany({
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        product: true,
                        supplier: true
                    }
                })
                return {
                    status: true,
                    code: 200,
                    message: "Data Income Product berhasil di ambil",
                    data: list
                }
            } else if (starDate == undefined && endDate == undefined && page != undefined && perpage != undefined) {
                const totalItems = await prisma.incomeProduct.count()
                const list = await prisma.incomeProduct.findMany({
                    skip: (page - 1) * parseInt(perpage),
                    take: parseInt(perpage),
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        product: true,
                        supplier: true
                    }
                })
                return {
                    status: true,
                    code: 200,
                    message: "Data Income Product By Page berhasil di ambil",
                    data: list,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalItems / parseInt(perpage))
                }
            } else if (starDate != undefined && endDate != undefined && page == undefined && perpage == undefined) {
                const list = await prisma.incomeProduct.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(starDate),
                            lte: new Date(endDate)
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        product: true,
                        supplier: true
                    }
                })
                return {
                    status: true,
                    code: 200,
                    message: "Data Income Product By Date berhasil di ambil",
                    data: list
                }
            } else if (starDate != undefined && endDate != undefined && page != undefined && perpage != undefined) {
                const totalItems = await prisma.incomeProduct.count()
                const list = await prisma.incomeProduct.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(starDate),
                            lte: new Date(endDate)
                        }
                    },
                    skip: (page - 1) * parseInt(perpage),
                    take: parseInt(perpage),
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        product: true,
                        supplier: true
                    }
                })
                return {
                    status: true,
                    code: 200,
                    message: "Data Income Product By Date berhasil di ambil",
                    data: list,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalItems / parseInt(perpage))

                }
            }
            
        } catch (error) {
            console.error('listIncomeProduct module. error : ', error)
            return {
                status: false,
                error
            }
        }
    }
    // listIncomeProduct = async() =>{
    //     try {
    //         const list = await prisma.incomeProduct.findMany({
    //             orderBy: {
    //                 updatedAt: 'desc'
    //             },
    //             include: {
    //                 product: true,
    //                 supplier: true
    //             }
    //         })
    //         return {
    //             status: true,
    //             code: 200,
    //             message: "Data Income Product berhasil di ambil",
    //             data: list
    //         }
    //     } catch (error) {
    //         console.error('listIncomeProduct module. error : ', error)
    //         return {
    //             status: false,
    //             error
    //         }
    //     }
    // }

    listIncomeProductByDate = async({tanggal, enddate}) =>{
        try {

            if (enddate == undefined) {
                const list = await prisma.incomeProduct.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                        }
                    },
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        product: true,
                        supplier: true
                    }
                })
                return {
                    status: true,
                    code: 200,
                    message: "Data Income Product By Date berhasil di ambil",
                    data: list
                }
            } else{
            const list = await prisma.incomeProduct.findMany({
                where: {
                    updatedAt: {
                        gte: new Date(tanggal),
                        lte: new Date(enddate)
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    product: true,
                    supplier: true
                }
            })
            return {
                status: true,
                code: 200,
                message: "Data Income Product By Date berhasil di ambil",
                data: list
            }
        }} catch (error) {
            console.error('listIncomeProductByDate module. error : ', error)
            return {
                status: false,
                error
            }
        }
    }

    listIncomeProductByPage = async({perpage, page}) =>{
        try {
            console.log( "perPage:" +perpage)
            console.log( "Page:" +page)
            const totalItems = await prisma.incomeProduct.count()
            const list = await prisma.incomeProduct.findMany({
                skip: (page - 1) * parseInt(perpage),
            take: parseInt(perpage),
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    product: true,
                    supplier: true
                }
            })
            return {

                status: true,
                code: 200,
                message: "Data Income Product By Page berhasil di ambil",
                data: list,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(perpage))
            }
        } catch (error) {
            console.error('listIncomeProductByPage module. error : ', error)
            return {
                status: false,
                error
            }
        }
    }



    // listIncomeProductByDate = async() =>{
    //     try {
    //         const today = new Date()
    //         const list = await prisma.incomeProduct.findMany({
    //             where: {
    //                 updatedAt: {
    //                     gte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
    //                     lte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
                    
    //                 }
    //             },
    //             orderBy: {
    //                 id: 'desc'
    //             },
    //             include: {
    //                 product: true,
    //                 supplier: true
    //             }
    //         })
    //         return {
    //             status: true,
    //             code: 200,
    //             message: "Data Income Product berhasil di ambil",
    //             data: list
    //         }
    //     } catch (error) {
    //         console.error('listIncomeProduct module. error : ', error)
    //         return {
    //             status: false,
    //             error
    //         }
    //     }
    // }

    createIncomeProduct = async(body)=>{
        try {
            const schema = Joi.object({
                product_id: Joi.number().required(),
                supplier_id: Joi.number().required(),
                price: Joi.number().required(),
                quantity: Joi.number().required(),
                total_price: Joi.number().optional()
              
            }).options({
                abortEarly: false
            })
            const validation = schema.validate(body)
            if (validation.error) {
                    const errorDetails = validation.error.details.map(details => details.message)
                    return{
                        status: false,
                        code: 422,
                        error: errorDetails.join(', ')
                    }
            }
           
            const newIncomeProduct = await prisma.incomeProduct.create({
                data:{
                    product_id: body.product_id,
                    supplier_id: body.supplier_id,
                    price: body.price,
                    quantity: body.quantity,
                    total_price: body.price * body.quantity,
                }
            })
            return {
                status: true,
                code: 200,
                message: "Data Income Product Berhasil ditambahkan",
                data: newIncomeProduct
            }
        } catch (error) {
            
            console.error('create Income Product module error: ',error)
            return {
                status: false,
                error
            }
        }
    }

    updateIncomeProduct = async(body, id)=>{
        try {
            const schema = Joi.object({
                product_id: Joi.number().required(),
                supplier_id: Joi.number().required(),
                price: Joi.number().required(),
                quantity: Joi.number().required(),
                total_price: Joi.number().optional()
              
            }).options({
                abortEarly: false
            })
            const validation = schema.validate(body)
            if (validation.error) {
                    const errorDetails = validation.error.details.map(details => details.message)
                    return{
                        status: false,
                        code: 422,
                        error: errorDetails.join(', ')
                    }
            }

            const update = await prisma.incomeProduct.update({
                where:{
                    id: parseInt(id)
                },
                data:{
                    product_id: body.product_id,
                    supplier_id: body.supplier_id,
                    price: body.price,
                    quantity: body.quantity,
                    total_price: body.price * body.quantity,
                }
            })
            return{ 
                status: true,
                code: 200,
                message: "Data Product Berhasil di update",
                data: update
            }
        } catch (error) {
            console.error('update IncomeProduct Error : ', error)
            return{
                status: false,
                error
            }
        }
    }

    destroyIncomeProduct  = async(id)=>{
        try {
            const destroyIncomeProduct= await prisma.incomeProduct.delete({
                where:{
                    id: Number(id)
                }
            })

            return{
                status: true,
                code: 200,
                message: "Data income Product berhasil di hapus",
            data: destroyIncomeProduct
            }
        } catch (error) {
            console.error('destroy Income Product Error: ', error)
            return{
                status: false,
                error
            }
        }
    }
}

module.exports = new _incomeProduct()