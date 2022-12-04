// All Requires
const { Op } = require("sequelize");


// Quote HELPER
module.exports = {
    // Add To Quote API
    addToQuote: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { user_id, product_id, quantity } = req;

            // Check If User Already Have Quote Data
            const findQuote = await db.quote.findOne({
                where: {
                    [Op.and]: [{
                        user_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // GET Product Data
            const findProduct = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: product_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { prod_regular_price } = findProduct

            // IF QUOTE FOUND
            if (findQuote) {

                // GET QUOTE DATA
                const { id, grand_total } = findQuote;
                let updatedGrandTotal = grand_total + (prod_regular_price * quantity ?? 1);

                // Update Quote
                await db.quote.update({
                    grand_total: updatedGrandTotal
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            user_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Update Quote Items
                // Check the Product is Already in Quote Items
                const checkQuoteItem = await db.quote_item.findOne({
                    where: {
                        product_id,
                        quote_id: id,
                        tenant_id: TENANTID
                    }
                });
                const { id: quoteItemID, total_price, quantity: quoteItemQuantity } = checkQuoteItem;

                if (checkQuoteItem) {

                    await db.quote_item.update({
                        quantity: quantity ? quoteItemQuantity + quantity : quoteItemQuantity,
                        total_price: quantity ? quantity * prod_regular_price : total_price
                    }, {
                        [Op.and]: [{
                            id: quoteItemID,
                            product_id,
                            quote_id: id,
                            tenant_id: TENANTID
                        }]
                    });





                }






            } else {



            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}