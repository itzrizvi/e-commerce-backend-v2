const { Op } = require("sequelize");

// Rating HELPER
module.exports = {
    // CREATE Rating API
    createRating: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            // GET DATA
            const { user_id, product_id, rating, title, description } = req;

            // Need to implement this user buy or not this product after order module finished
            // To DO

            // Check The Rating Is Already given or Not
            const checkRatingExist = await db.rating.findOne({
                where: {
                    [Op.and]: [{
                        product_id: product_id,
                        user_id: user_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkRatingExist) return { message: "Rating already given!", status: false }


            // Check The Product Exist or Not
            const checkProductExist = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: product_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!checkProductExist) return { message: "Product not exist!", status: false }

            const createRating = await db.rating.create({
                user_id,
                product_id,
                rating_title: title,
                rating_description: description,
                rating,
                tenant_id: TENANTID
            });

            if (createRating) {
                return {
                    tenant_id: createRating.tenant_id,
                    message: "Successfully Created Rating.",
                    status: true
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },
    getAllRatingByUser: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET ALL Rating
            // GET DATA
            const { user_id } = req;

            // Find All Roles With permissions
            const findAllRating = await db.rating.findAll({
                where: {
                    tenant_id: TENANTID,
                    user_id: user_id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findAllRating,
                message: "All Rating Get Successfully by User ID!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    },
    getAllRatingByProduct: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET ALL Rating
            // GET DATA
            const { product_id } = req;

            // Find All Roles With permissions
            const findAllRating = await db.rating.findAll({
                where: {
                    tenant_id: TENANTID,
                    product_id: product_id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findAllRating,
                message: "All Rating Get Successfully by Product ID!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    },
    getSingleRating: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET Rating
            // GET DATA
            const { rating_id } = req;

            // Find All Roles With permissions
            const findRating = await db.rating.findOne({
                where: {
                    tenant_id: TENANTID,
                    id: rating_id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findRating,
                message: "Single Rating Get Successfully!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    }
}