const prisma = require('../helpers/database')
const Joi = require('joi')



class _category{
    listCategory = async() =>{
        try {
            const list = await prisma.category.findMany({
                include:{
                    product: true
                }
            })
            
            return {
                status: true,
                code: 201,
                message: "Data Category berhasil di ambil",
                data: list
            }
        } catch (error) {
            console.error('listCategory module. error : ', error)
            return {
                status: false,
                error
            }
        }
    }

    createCategory = async(body)=>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                category_img: Joi.string().required(),
                
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
            const newCategory = await prisma.category.create({
                data:{
                    name: body.name,
                    category_img: body.category_img
                }
            })
            return {
                status: true,
                code: 201,
                data: newCategory
            }
        } catch (error) {
            
            console.error('create Category module error: ',error)
            return{
                status: false,
                error
            }
        }
    }
    updateCategory = async(body, id) =>{
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                category_img: Joi.string().required(),
                
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

            const updateCategory = await prisma.category.update({

                where:{
                    id: Number(id)
                },
                data:{
                    name: body.name,
                    category_img: body.category_img
                }
            })
            return{
                status: true,
                code: 201,
                message: "Data Category Berhasil di update",
                data: updateCategory
            }
        } catch (error) {
            console.error('updateCategory module Error: ', error)
            return{
                status: false,
                error
            }
        }
    }

    destroyCategory = async(id)=>{
        try {
            const destroyCategory = await prisma.category.delete({
                where:{
                    id: parseInt(id)
                }
            })
            return{
                status: true,
                code: 201,
                message: "Data Category berhasil di hapus",
                data: destroyCategory
            }
        } catch (error) {
            console.error('destroyCategory module Error', error)
            return{
                status: false,
                error
            }
        }
    }
}

module.exports = new _category()