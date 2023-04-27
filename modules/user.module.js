const prisma = require("../helpers/database");
const Joi = require("joi");
const bcrypt = require("bcrypt");


class _user {
    listUser = async () => {
        try {
            const list = await prisma.authUser.findMany({
                include: {
                    authUserRoles: true,
                    
                }
            });
            return {
                status: true,
                code: 200,
                data: list,
            };
        } catch (error) {
            console.error("listUser user module error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    createUser = async (body) => {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
            }).options({
                abortEarly: false
            });

            const validation = schema.validate(body);
            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const checkEmail = await prisma.authUser.findFirst({
                where: {
                    email: body.email,
                },
            });

            if (checkEmail) {
                return {
                    status: false,
                    code: 422,
                    error: "Email already exists",
                };
            }

            const password = await bcrypt.hashSync(body.password, 10);

            const add = await prisma.authUser.create({
                data: {
                    email: body.email,
                    password: password,
                    name: body.name,
                    authUserRoles: {
                        create: [
                            {
                                auth_role_id: 4,
                            },
                        ]
                },}
            });
            return {
                status: true,
                code: 201,
                data: add,
            };
        } catch (error) {
            console.error("createUser user module error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    detailUser = async (id) => {
        try {
            const detail = await prisma.authUser.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            return {
                status: true,
                code: 200,
                data: detail,
            };
        } catch (error) {
            console.error("detailUser user module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateUser = async (body, id) => {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
            }).options({
                abortEarly: false
            });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }
            const checkEmail = await prisma.authUser.findFirst({
                where: {
                    email: body.email,
                },
            });

            if (checkEmail && checkEmail.id != id) {
                return {
                    status: false,
                    code: 422,
                    error: "Email already exists",
                };
            }

            const password = await bcrypt.hashSync(body.password, 10);

            const update = await prisma.authUser.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: body.name,
                    email: body.email,
                    password,
                },
            });
            return {
                status: true,
                code: 200,
                message: "User updated successfully",
                data: update,
            };
        } catch (error) {
            console.error("updateUser user module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    destroyUser = async (id) => {
        try {
            const destroy = await prisma.authUser.delete({
                where: {
                    id: parseInt(id),
                },
            });
            return {
                status: true,
                code: 200,
                data: destroy,
            };
        } catch (error) {
            console.error("destroyUser user module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _user();