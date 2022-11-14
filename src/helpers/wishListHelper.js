// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Wish List HELPER
module.exports = {
    // Add Wish List API
    addWishList: async (req, db, user, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { product_id } = req;

            // Check If the wish list is already there
            const checkExistWishList = await db.wishlist.findOne({
                where: {
                    [Op.and]: [{
                        user_id: user.id,
                        product_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkExistWishList) return { message: "You Already Have This Product on Your WishList!!!", status: false }

            // Insert Wish List
            const insertToWishlist = await db.wishlist.create({
                user_id: user.id,
                product_id,
                tenant_id: TENANTID,
                created_by: user.id
            });

            if (!insertToWishlist) return { message: "Wish List Couldn't Be Created!!!", status: false }

            return {
                message: "Successfully Added The Product To Your Wishlist!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Remove Product From Wish List API
    removeFromWishList: async (req, db, user, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { product_id } = req;

            // Find and Remove Product From Wish List
            const findAndRemoveFromWishList = await db.wishlist.destroy({
                where: {
                    [Op.and]: [{
                        product_id,
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!findAndRemoveFromWishList) return { message: "Try Again Please!!!", status: false }

            return {
                message: "Successfully Removed The Product From Your Wishlist!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Wish List 
    getWishList: async (db, user, TENANTID) => {
        // Try Catch Block
        try {

            // Check If Has Alias with Users and Order
            if (!db.wishlist.hasAlias('product') && !db.wishlist.hasAlias('wishedProduct')) {

                await db.wishlist.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'wishedProduct'
                });
            }

            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

            if (!db.wishlist.hasAlias('user') && !db.wishlist.hasAlias('wishedBy')) {

                await db.wishlist.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'wishedBy'
                });
            }

            // Find WishList with Details
            const getwishlist = await db.wishlist.findAll({
                include: [
                    {
                        model: db.product, as: 'wishedProduct',
                        include: { model: db.category, as: 'category' }
                    },
                    {
                        model: db.user, as: 'wishedBy',
                    }
                ],
                order: [
                    [{ model: db.product, as: 'wishedProduct' }, 'prod_slug', 'ASC']
                ],
                where: {
                    [Op.and]: [{
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });


            if (getwishlist.length != 0) {
                // GET FORMATTED
                const wishlist = {
                    created_by: getwishlist[0].created_by,
                    updated_by: getwishlist[0].updated_by,
                    tenant_id: getwishlist[0].tenant_id,
                    wishedBy: getwishlist[0].wishedBy,
                };
                const wishedProducts = [];
                // 
                getwishlist.forEach(async (list) => {
                    wishedProducts.push(list.wishedProduct);
                });

                //
                wishlist.wishedProducts = wishedProducts;


                // Return Formation
                return {
                    message: "GET Wish List Success!!!",
                    tenant_id: TENANTID,
                    status: true,
                    data: wishlist
                }

            } else {
                // Return Formation
                return {
                    message: "You Dont Have Any Wish List",
                    tenant_id: TENANTID,
                    status: true
                }
            }




        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }
}