const prisma = require('../helpers/database');

const Joi = require('joi');
class _brand{
    listBrand = async () => {
        try {
            const list = await prisma.brand.findMany({
                
                include: {
                    product: true
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Brand Berhasil Diambil",
                data: list
            }
        } catch (error) {
            console.error('list Brand module error : ', error)
            return {
                status: false,
                error
            }
        }
    }

    createBrand = async (body) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                brand_img: Joi.string().required(),
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
            const newBrand = await prisma.brand.create({
                data: {
                    name: body.name,
                    brand_img: body.brand_img,
                }
            })
            return {
                status: true,
                code: 201,
                data: newBrand
            }
        
        } catch (error) {
            console.error('create Brand module error : ', error)
            return {
                status: false,
                error
            }
        }
    }

    updateBrand = async (body, id) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                brand_img: Joi.string().required(),
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
            }const updateBrand = await prisma.brand.update({
                where:{
                    id: Number(id)
                },
                data: {
                    name: body.name,
                    brand_img: body.brand_img,
                }
            })
            return {
                status: true,
                code: 201,
                message: "Data Brand Berhasil DiUpdate",
                data: updateBrand
            }
        
        } catch (error) {
            console.error('updateBrand brand module error : ', error)
            return {
                status: false,
                error
            }
        }
    }

    destroyBrand = async(id) =>{
        try {
            const destroyBrand = await prisma.brand.delete({
                            where:{
                                id: parseInt(id)
                            },
                            
                        })
                        return {
                            status: true,
                            code: 201,
                            message: "Data Brand Berhasil delete",
                            data: destroyBrand
                        }
        } catch (error) {
            console.error('delete brand module error : ', error)
            return {
                status: false,
                error
            }
        }
    }
    
}

module.exports = new _brand()