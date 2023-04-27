const prisma = require('../helpers/database');
const Joi = require('joi');

class _supplier{
    listSupplier = async () => {
        try {
            const list = await prisma.supplier.findMany({
                include: {
                    incomeProduct: true
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Supplier Berhasil Diambil",
                data: list
            }
        } catch (error) {
            console.error('list Supplier module error : ', error)
            return {
                status: false,
                error
            }
        }
    }
    createSupplier = async(body) =>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                address: Joi.string().required(),
                phone: Joi.string().required(),
            }).options({abortEarly: false})
            const validation = schema.validate(body)
            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }
            const newSupplier = await prisma.supplier.create({
                data: {
                    name: body.name,
                    address: body.address,
                    phone: body.phone,
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Supplier berhasil di tambahnkan",
                data: newSupplier
            }
        } catch (error) {
            console.error('Create Supplier module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    updateSupplier = async(body, id) =>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                address: Joi.string().required(),
                phone: Joi.string().required(),
            }).options({abortEarly: false})
            const validation = schema.validate(body)
            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }
            const updateSupplier = await prisma.supplier.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: body.name,
                    address: body.address,
                    phone: body.phone,
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Supplier berhasil di update",
                data: updateSupplier
            }
        } catch (error) {
            console.error('Update Supplier module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    destroySupplier = async(id) =>{
        try {
            const destroySupplier = await prisma.supplier.delete({
                where: {
                    id: parseInt(id)
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Supplier berhasil di hapus",
                data: destroySupplier
            }
        } catch (error) {
            console.error('Destroy Supplier module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    listSupplierSortByIncomeProduct = async({desc}) =>{
        try {
            if (desc != undefined) {
                const list = await prisma.supplier.findMany({
                    include: {
                        IncomeProducts: true
                    },
                    orderBy: {
                        IncomeProducts: {
                            _count: 'desc'
                        }
                    }
                })
                return {
                    status: true,
                    code: 201,
                    message: "Data Supplier SortByIncomeProduct descending  Berhasil Diambil",
                    data: list
                }
                
            } else{
                const list = await prisma.supplier.findMany({
                    include: {
                        IncomeProducts: true
                    },
                    orderBy: {
                        IncomeProducts: {
                            _count: 'asc'
                        }
                    }
                })
                return {
                    status: true,
                    code: 201,
                    message: "Data Supplier SortByIncomeProduct ascending  Berhasil Diambil",
                    data: list
                }
            }
        } catch (error) {
            console.error('listSupplierSortByIncomeProduct module error : ', error)
            return {
                status: false,
                error
            }
        }
    }
    // listSupplierSortByIncomeProductQuantity = async({desc}) =>{
    //     try {
    //         // if (desc != undefined) {
    //         //     const list = await prisma.supplier.findMany({
    //         //         include: {
    //         //             IncomeProducts: true
    //         //         },
    //         //         orderBy: {
    //         //             IncomeProducts: {
    //         //                 _count: {
    //         //                     quantity: 'desc'
    //         //                 }
    //         //             }
    //         //         }
    //         //     })
    //         //     return {
    //         //         status: true,
    //         //         code: 201,
    //         //         message: "Data Supplier SortByIncomeProductQuantity descending  Berhasil Diambil",
    //         //         data: list
    //         //     }
                
    //         // } else{
    //             const list = await prisma.supplier.findMany({
    //                 include: {
    //                     IncomeProducts: true
    //                 },
    //                 orderBy: {
    //                     IncomeProducts: {
    //                         _count: {
    //                             quantity: 'asc'
    //                         }
    //                     }
    //                 }

    //             })
    //             return {
    //                 status: true,
    //                 code: 201,
    //                 message: "Data Supplier SortByIncomeProductQuantity ascending  Berhasil Diambil",
    //                 data: list
    //             }
            
    //     } catch (error) {
    //         console.error('listSupplierSortByIncomeProductQuantity module error : ', error)
    //         return {
    //             status: false,
    //             error
    //         }
    //     }
    // }
}

module.exports = new _supplier()