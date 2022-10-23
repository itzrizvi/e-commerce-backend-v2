const { Op } = require("sequelize");

// Rating HELPER
module.exports = {
    // CREATE Rating API
    createRating: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try{
            // GET DATA
            const { user_uuid, product_uuid, rating, title, description } = req;

            // Need to implement this user buy or not this product after order module finished
            // To DO

            // Check The Rating Is Already given or Not
            const checkRatingExist = await db.rating.findOne({
                where: {
                    [Op.and]: [{
                        product_id: product_uuid,
                        user_id: user_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkRatingExist) return { message: "Rating already given!", status: false }

            const createRating = await db.rating.create({
                user_id: user_uuid,
                product_id: product_uuid,
                rating_title: title,
                rating_description: description,
                rating: rating,
                tenant_id: TENANTID
            });

            if(createRating){
                return {
                    tenant_id: createRating.tenant_id,
                    message: "Successfully Created Rating.",
                    status: true
                }
            }

        }catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },
    getAllRating: async (req, db, user, isAuth, TENANTID) => {
         // Try Catch Block
        //  try {
            // GET ALL Rating
            // GET DATA
            const { user_uuid, product_uuid } = req;
            // Check If User Has Alias or Not 
            if (!db.rating.hasAlias('user')) {
                await db.rating.hasOne(db.users, { sourceKey: 'user_id', foreignKey: 'uid', as: 'user' });
            }

            // Check If User Has Alias or Not 
            if (!db.rating.hasAlias('product')) {
                await db.rating.hasOne(db.products, { sourceKey: 'prod_uuid', foreignKey: 'product_id', as: 'product' });
            }

            // Find All Roles With permissions
            const findAllRating = await db.rating.findAll({
                include: [
                    {
                        model: db.users,
                        as: 'user'
                    },
                    {
                        model: db.products,
                        as: 'product'
                    },
                ],
                where: {
                    tenant_id: TENANTID,
                    user_id: user_uuid,
                    product_id: product_uuid
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findAllRating,
                message: "All Roles And Permissions GET Success!!!",
                status: true
            }

        // } catch (error) {
        //     if (error) return { message: "Something Went Wrong", status: false }
        // }
    }
}