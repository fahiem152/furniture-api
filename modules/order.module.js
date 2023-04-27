const { DeliveryType, DeliveryStatus } = require("@prisma/client");
const Joi = require("joi");

const prisma = require("../helpers/database");

class _order {
    listOrder = async ({
        delivery,
        takeaway,
        delivered,
        pending,
        perpage,
        page,
        tanggal,enddate,
    }) => {
        try {
            
            const filters = {};
            if (delivery === "true") {
                filters.delivery_type = DeliveryType.Delivery;
            }
            if (takeaway === "true") {
                filters.delivery_type = DeliveryType.TakeAway;
            }
            if (delivered === "true") {
                filters.delivery_status = DeliveryStatus.Delivered;
            }
            if (pending === "true") {
                filters.delivery_status = DeliveryStatus.Pending;
            }
            if (tanggal && enddate) {
                filters.updatedAt = {
                    gte: new Date(tanggal),
                    lte: new Date(enddate),
                };
            }
            const listCount = await prisma.order.findMany({
                where: filters
            });
            const totalItems = listCount.length;
            const list = await prisma.order.findMany({
                skip: (page - 1) * parseInt(perpage),
                take: parseInt(perpage),
                where: filters,
                orderBy: {
                    updatedAt: "desc",
                },
                include: {
                    product: true,
                    auth_user: true,
                },
            });


            console.log(totalItems);
            console.log(filters);
            return {
                status: true,
                code: 200,
                message: "Data Order berhasil di ambil",
                data: list,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(perpage)),
            };
        } catch (error) {
            console.error("list Order module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    listOrderByUser = async ({
        userId,
        delivery,
        takeaway,
        delivered,
        pending,
        perpage,
        page
    }) => {
        try {
            const filters = {};
            if (delivery === "true") {
                filters.delivery_type = DeliveryType.Delivery;
            }
            if (takeaway === "true") {
                filters.delivery_type = DeliveryType.TakeAway;
            }
            if (delivered === "true") {
                filters.delivery_status = DeliveryStatus.Delivered;
            }
            if (pending === "true") {
                filters.delivery_status = DeliveryStatus.Pending;
            }
            // const totalItems = await prisma.order.count();
            const listCount = await prisma.order.findMany({
                where: {
                    auth_user_id: parseInt(userId),
                    ...filters,
                },
            });
            const totalItems = listCount.length;
            const list = await prisma.order.findMany({
                skip: (page - 1) * parseInt(perpage),
                take: parseInt(perpage),
                where: {
                    auth_user_id: parseInt(userId),
                    ...filters,
                },
                // where: {
                //  auth_user_id: parseInt(userId),
                // },
                include: {
                    product: true,
                    auth_user: true,
                },
            });
            // const totalItems = list.length 
            console.log(totalItems);
            // console.log(userId);
            console.log(filters);
            return {
                status: true,
                code: 200,
                data: list,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(perpage)),
                totalItems: totalItems,
            };

        } catch (error) {
            console.error("listOrderById module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    listOrderByDate = async ({
        tanggal,
        enddate,
    }) => {
        try {
            if (enddate == undefined) {
                const list = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                    include: {
                        product: true,
                        auth_user: true,
                    },
                });
                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By One Date berhasil di ambil",
                    data: list,
                };
            } else {

                const orders = await prisma.order.findMany({
                    where: {
                        AND: [{
                                updatedAt: {
                                    gte: new Date(tanggal),
                                },
                            },
                            {
                                updatedAt: {
                                    lte: new Date(enddate),
                                },
                            },
                        ],
                    },

                    select: {
                        product_id: true,
                        quantity: true,
                        product: true
                    },
                    // where: {
                    //     updatedAt: {
                    //         gte: new Date(tanggal),
                    //         lte: new Date(enddate),
                    //     },
                    // },
                    // orderBy: {
                    //     updatedAt: "desc",
                    // },
                    // include: {
                    //     product: true,
                    //     auth_user: true,
                    // }
                });

                const result = {

                };
                orders.forEach((order) => {
                    if (!result[order.product_id]) {
                        result[order.product_id] = {
                            product_id: order.product_id,
                            quantity: order.quantity,
                            product: order.product,
                        };
                    } else {
                        result[order.product_id].quantity += order.quantity;
                    }
                });
                // orders.forEach(order=>{
                //     const {product_id , quantity} = order;
                //     if (!result[product_id]) {
                //         result[product_id]={
                //             product_id, quantity: 0
                //         };
                //     }
                //     result[product_id].quantity += quantity;

                // })

                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By Range Date berhasil di ambil",
                    data: Object.values(result),
                    // data: result,
                };
            }
        } catch (error) {
            console.error("listOrderByDate module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
    listOrderByDateCategory = async ({
        tanggal,
        enddate,
        category_id
    }) => {
        try {
            if (enddate == undefined && category_id == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),

                        },
                    },
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }

                });
                const categoryMap = new Map();
                for (const order of orders) {
                    const category = order.product.category.name;
                    const quantity = order.quantity;
                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, {
                            name: category,
                            quantity: 0,
                            orders: [],
                        })
                    }
                    const categoryData = categoryMap.get(category);
                    categoryData.quantity += quantity;
                    categoryData.orders.push(order);
                }
                const categories = Array.from(categoryMap.values());
                const totalQuantity = categories.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    message: "Data Order Product By One Date All Category berhasil di ambil",
                    code: 200,
                    data: {
                        categories,
                        totalQuantity,
                    },
                }
            } else if (enddate == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                        },
                        product: {
                            category_id: parseInt(category_id)
                        }
                    },
                    // orderBy: {
                    //     updatedAt: "desc",
                    // },
                    include: {
                        product: true,
                    },
                });
                const result = orders.reduce((acc, order) => {
                    const {
                        product_id,
                        quantity,
                        product
                    } = order;
                    if (!acc[product_id]) {
                        acc[product_id] = {
                            product_id,
                            quantity,
                            product,
                        };
                    } else {
                        acc[product_id].quantity += quantity;
                    }
                    return acc;
                }, {});
                const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By One Date Per Kategori berhasil di ambil",
                    data: {
                        orders: Object.values(result),
                        totalQuantity,
                    }
                };
            } else if (category_id == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),

                        },
                    },
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                    // select: {
                    //     product_id: true,
                    //     quantity: true,
                    //     product: true
                    // },

                });

                const categoryMap = new Map();
                let totalQuantity = 0; 
                for (const order of orders) {
                    const category = order.product.category.name;
                    const quantity = order.quantity;

                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, {
                            name: category,
                            quantity: 0,
                            persen: 0,
                            orders: [],
                        })
                    }
                    const categoryData = categoryMap.get(category);
                    categoryData.quantity += quantity;
                    categoryData.orders.push(order);
                    totalQuantity += quantity;

                    // const {product} = order;
                    // const {category} = product;
                    // if(!categoryMap.has(category.id)){
                    //     categoryMap.set(category.id, {
                    //         category,
                    //         products: []
                    //     })
                    // }
                    // const categoryData = categoryMap.get(category.id);
                    // categoryData.products.push({
                    //     product,
                    //     quantity: order.quantity
                    // })
                }
                for (const categoryData of categoryMap.values()) {
                    const persenBulat = (categoryData.quantity / totalQuantity) * 100;

                    categoryData.persen = persenBulat.toFixed(0);
                    
                    
                }
                const categories = Array.from(categoryMap.values());
                // const totalQuantity = categories.reduce((acc, curr) => acc + curr.quantity, 0);
                // const totalQuantity = categories.reduce((total, category)=>{
                //     return total + category.quantity;
                // }, 0);
                // const categories = await prisma.category.findMany();
                // const categorizedProducts = [];
                // for(const category in categories){
                //     const products = await prisma.product.findMany({
                //         where:{
                //             category_id: category.id
                //         }
                //     })
                //     categorizedProducts.push({
                //         category: category.name,
                //         products,
                //     })
                // }
                return {
                    status: true,
                    message: "Data Order Product By Range Date berhasil di ambil",
                    code: 200,
                    data: categories, totalQuantity
                }
            } else {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),
                        },
                        product: {
                            category_id: parseInt(category_id)
                        }
                    },
                    include: {
                        product: true,
                    }
                });
                const result = orders.reduce((acc, order) => {
                    const {
                        product_id,
                        quantity,
                        product
                    } = order;
                    if (!acc[product_id]) {
                        acc[product_id] = {
                            product_id,
                            quantity,
                            product,
                        };
                    } else {
                        acc[product_id].quantity += quantity;
                    }
                    return acc;
                }, {});
                const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By Range Date Per Category berhasil di ambil",
                    data: {
                        orders: Object.values(result),
                        totalQuantity,
                    }
                    // data: result,
                };
            }
        } catch (error) {
            console.error("listOrderByDateCategory module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
    listOrderByDateBrand = async ({
        tanggal,
        enddate,
        brand_id
    }) => {
        try {
            if(enddate == undefined && brand_id == undefined){
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),

                        },
                    },
                    include: {
                        product: {
                            include: {
                                brand: true
                            }
                        }
                    }

                });
                const brandMap = new Map();
                for (const order of orders) {
                    const brand = order.product.brand.name;
                    const quantity = order.quantity;
                    if (!brandMap.has(brand)) {
                        brandMap.set(brand, {
                            name: brand,
                            quantity: 0,
                            orders: [],
                        })
                    }
                    const brandData = brandMap.get(brand);
                    brandData.quantity += quantity;
                    brandData.orders.push(order);
                }
                const brands = Array.from(brandMap.values());
                const totalQuantity = brands.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    message: "Data Order Product By One Date All brand berhasil di ambil",
                    code: 200,
                    data: {
                        brands,
                        totalQuantity,
                    },
                }
            }
          else if (enddate == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                        },
                        product: {
                            brand_id: parseInt(brand_id)
                        }
                    },
                    // orderBy: {
                    //     updatedAt: "desc",
                    // },
                    include: {
                        product: true,
                        // auth_user: true,
                    },
                });
                const result = orders.reduce((acc, order) => {
                    const {
                        product_id,
                        quantity,
                        product
                    } = order;
                    if (!acc[product_id]) {
                        acc[product_id] = {
                            product_id,
                            quantity,
                            product,
                        };
                    } else {
                        acc[product_id].quantity += quantity;
                    }
                    return acc;
                }, {});
                const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By One Date Per Brand berhasil di ambil",
                    data: {
                        orders: Object.values(result),
                        totalQuantity,
                    }
                };
            } else if (brand_id == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),

                        },
                    },
                    include: {
                        product: {
                            include: {
                                brand: true
                            }
                        }
                    }

                });

                const brandMap = new Map();
                let totalQuantity = 0; 
                for (const order of orders) {
                    const brand = order.product.brand.name;
                    const quantity = order.quantity;

                    if (!brandMap.has(brand)) {
                        brandMap.set(brand, {
                            name: brand,
                            quantity: 0,
                            persen: 0,
                            orders: [],
                        })
                    }
                    const brandData = brandMap.get(brand);
                    brandData.quantity += quantity;
                    brandData.orders.push(order);
                    totalQuantity += quantity;
                }
                for (const brandData of brandMap.values()) {
                    const persenBulat = (brandData.quantity / totalQuantity) * 100;

                    brandData.persen = persenBulat.toFixed(0);
                    
                    
                }
                const categories = Array.from(brandMap.values());
               
                return {
                    status: true,
                    message: "Data Order Product By Range Date berhasil di ambil",
                    code: 200,
                    data: categories, totalQuantity
                }
            } else {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),
                        },
                        product: {
                            brand_id: parseInt(brand_id)
                        }
                    },
                    include: {
                        product: true,
                    }
                });
                const result = orders.reduce((acc, order) => {
                    const {
                        product_id,
                        quantity,
                        product
                    } = order;
                    if (!acc[product_id]) {
                        acc[product_id] = {
                            product_id,
                            quantity,
                            product,
                        };
                    } else {
                        acc[product_id].quantity += quantity;
                    }
                    return acc;
                }, {});
                const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0);
                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By Range Date Per Category berhasil di ambil",
                    data: {
                        orders: Object.values(result),
                        totalQuantity,
                    }
                    // data: result,
                };
            }
        } catch (error) {
            console.error("listOrderByDate module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
    listOrderByDateUser = async ({
        tanggal,
        enddate,
        userid
    }) => {
        try {
            if (enddate == undefined && userid == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                      createdAt: {
                        gte: new Date(tanggal),
                        lte: new Date(enddate)
                      },
                      auth_user_id: userid || undefined,
                    },
                    include: {
                      product: true,
                    },
                  });
                
                  let data = [];
                  let total_quantity = 0;
                
                  // Membuat objek dengan format yang diinginkan
                  for (let order of orders) {
                    let found = false;
                    for (let item of data) {
                      if (item.auth_user_id == order.auth_user_id) {
                        item.quantity += order.quantity;
                        item.orders.push(order);
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      data.push({
                        auth_user_id: order.auth_user_id,
                        quantity: order.quantity,
                        orders: [order],
                      });
                    }
                    total_quantity += order.quantity;
                  }
                
             return{
                    status: true,
                    message: "Data Order Product By One Date All User berhasil diambil",
                    data: data,
                    total_quantity: total_quantity,
                  };
                 
            } else if (user_id == undefined) {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),
                        },
                    },
                    include: {
                        product: {
                            select: {
                                brand: true
                            }
                        }
                    },
                });
                const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0)
                const result = orders.map((order) => {
                    return {
                        category: order.product.category.name,
                        quantity: totalQuantity,
                        orders: order
                    }
                })
                return {
                    status: true,
                    message: "Data Order Product By Range Date berhasil di ambil",
                    data: result,
                }
            } else {
                const orders = await prisma.order.findMany({
                    where: {
                        updatedAt: {
                            gte: new Date(tanggal),
                            lte: new Date(enddate),
                        },
                        auth_user: {
                            id: parseInt(user_id)
                        }
                    },
                    include: {
                        product: true,
                    }
                });
                const result = orders.reduce((acc, order) => {
                    const {
                        product_id,
                        quantity,
                        product
                    } = order;
                    if (!acc[product_id]) {
                        acc[product_id] = {
                            product_id,
                            quantity,
                            product,
                        };
                    } else {
                        acc[product_id].quantity += quantity;
                    }
                    return acc;


                }, {});

                return {
                    status: true,
                    code: 200,
                    message: "Data Order Product By Range Date berhasil di ambil",
                    data: Object.values(result),
                    // data: result,
                };
            }
        } catch (error) {
            console.error("listOrderByDate module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };



    listOrderByPage = async ({
        perpage,
        page
    }) => {
        try {
            console.log("perPage:" + perpage);
            console.log("Page:" + page);
            const totalItems = await prisma.order.count();
            const list = await prisma.order.findMany({
                skip: (page - 1) * parseInt(perpage),
                take: parseInt(perpage),
                orderBy: {
                    updatedAt: "desc",
                },
                include: {
                    product: true,
                    auth_user: true,
                },
            });
            return {
                status: true,
                code: 200,
                message: "Data Order By Page berhasil di ambil",
                data: list,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(perpage)),
            };
        } catch (error) {
            console.error("listOrderByPage module. error : ", error);
            return {
                status: false,
                error,
            };
        }
    };

    // listOrderByDelivery = async ()

    createOrder = async (body) => {
        try {
            const schema = Joi.object({
                auth_user_id: Joi.number().required(),
                product_id: Joi.number().required(),
                quantity: Joi.number().required(),
                product_price: Joi.number().required(),
                total_price: Joi.number().optional(),
                customer_name: Joi.string().required(),
                customer_addres: Joi.string().required(),
                customer_phone: Joi.string().required(),
                address_details: Joi.string().required(),
                delivery_type: Joi.valid("TakeAway", "Delivery").optional(),
                delivery_status: Joi.valid("Pending", "Delivered").optional(),
            }).options({
                abortEarly: false,
            });
            const validation = schema.validate(body);
            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (details) => details.message
                );
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }
            // const result = await prisma.product.findUnique({
            //     where:{
            //         id: body.product_id
            //     },
            // })
            // console.log(result)
            // if (!result) {
            //     throw new Error(`Product with ID ${body.product_id} not found`)
            // }
            // const checkOrder = await prisma.order.findUnique({
            //     where: {
            //         product_id: body.product_id
            //     }
            // })
            // if (checkOrder) {
            //     throw new Error(`Product with ID ${body.product_id} already ordered`)
            // }
            const availabelStock = await prisma.product.findUnique({
                where: {
                    id: body.product_id,
                },

            });
            if (availabelStock.stock == 0) {
                return {
                    status: false,
                    code: 409,
                    error: `Stock Product sudah habis`,
                };
            } else if (availabelStock.stock < body.quantity) {
                return {
                    status: false,
                    code: 422,
                    error: `Stock Product tidak mencukupi`,
                };
            }

            const newOrder = await prisma.order.create({
                data: {
                    auth_user_id: body.auth_user_id,
                    product_id: body.product_id,
                    quantity: body.quantity,
                    product_price: body.product_price,
                    // product_price: result.price,
                    total_price: body.product_price * body.quantity,
                    customer_name: body.customer_name,
                    customer_addres: body.customer_addres,
                    customer_phone: body.customer_phone,
                    address_details: body.address_details,
                    delivery_type: body.delivery_type,
                    delivery_status: body.delivery_status,
                },
                include: {
                    product: true,
                    auth_user: true,
                },
            });
            return {
                status: true,
                code: 200,
                message: "Data Order berhasil ditambahkan",
                data: newOrder,
            };
        } catch (error) {
            console.error("createOrder module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
    updateOrder = async (body, id) => {
        try {
            const schema = Joi.object({
                auth_user_id: Joi.number().required(),
                product_id: Joi.number().required(),
                quantity: Joi.number().required(),
                product_price: Joi.number().optional(),
                total_price: Joi.number().optional(),
                customer_name: Joi.string().required(),
                customer_addres: Joi.string().required(),
                customer_phone: Joi.string().required(),
                address_details: Joi.string().required(),
                delivery_type: Joi.valid("TakeAway", "Delivery").optional(),
                delivery_status: Joi.valid("Pending", "Delivered").optional(),
            }).options({
                abortEarly: false,
            });
            const validation = schema.validate(body);
            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (details) => details.message
                );
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }
            // const result = await prisma.product.findUnique({
            //     where:{
            //         id: body.product_id
            //     },

            // })
            // console.log(result)
            // if (!result) {
            //     throw new Error(`Product with ID ${body.product_id} not found`)
            // }
            const updateOrder = await prisma.order.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    auth_user_id: body.auth_user_id,
                    product_id: body.product_id,
                    quantity: body.quantity,
                    product_price: body.product_price,
                    total_price: body.product_price * body.quantity,
                    customer_name: body.customer_name,
                    customer_addres: body.customer_addres,
                    customer_phone: body.customer_phone,
                    address_details: body.address_details,
                    delivery_type: body.delivery_type,
                    delivery_status: body.delivery_status,
                },
            });
            return {
                status: true,
                code: 200,
                message: "Data Order berhasil update",
                data: updateOrder,
            };
        } catch (error) {
            console.error("updateOrder module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    destroyOrder = async (id) => {
        try {
            const deleteOrder = await prisma.order.delete({
                where: {
                    id: Number(id),
                },
            });
            return {
                status: true,
                code: 200,
                message: "Data Order berhasil di hapus",
                data: deleteOrder,
            };
        } catch (error) {
            console.error("destroyOrder module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _order();

