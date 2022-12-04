// All Requires
const { Op } = require("sequelize");


// Quote HELPER
module.exports = {
    // Add To Quote API
    addToQuote: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
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
                const updateQuote = await db.quote.update({
                    grand_total: updatedGrandTotal,
                    updatedBy: user.id
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            user_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!updateQuote) return { message: "Quote Update Failed!!", status: false }

                // Update Quote Items
                // Check the Product is Already in Quote Items
                const checkQuoteItem = await db.quote_item.findOne({
                    where: {
                        product_id,
                        quote_id: id,
                        tenant_id: TENANTID
                    }
                });


                if (checkQuoteItem) {
                    const { id: quoteItemID, total_price, quantity: quoteItemQuantity } = checkQuoteItem;

                    const quoteItemUpdate = await db.quote_item.update({
                        quantity: quantity ? quoteItemQuantity + quantity : quoteItemQuantity,
                        total_price: quantity ? (quantity + quoteItemQuantity) * prod_regular_price : total_price,
                        updatedBy: user.id
                    }, {
                        where: {
                            [Op.and]: [{
                                id: quoteItemID,
                                product_id,
                                quote_id: id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!quoteItemUpdate) return { message: "Quote Item Update Failed!!", status: false }

                } else {

                    const quoteItemCreate = await db.quote_item.create({
                        product_id,
                        quote_id: id,
                        price: prod_regular_price,
                        quantity: quantity ?? 1,
                        total_price: quantity ? quantity * prod_regular_price : 1 * prod_regular_price,
                        tenant_id: TENANTID,
                        createdBy: user.id,
                        updatedBy: user.id
                    });
                    if (!quoteItemCreate) return { message: "Quote Item Create Failed!!", status: false }
                }


            } else {

                // Create Quote
                const createQuote = await db.quote.create({
                    user_id,
                    status: "new",
                    grand_total: quantity ? quantity * prod_regular_price : prod_regular_price,
                    createdBy: user.id,
                    tenant_id: TENANTID
                });
                if (!createQuote) return { message: "Quote Create Failed!!", status: false }

                // Create Quote Item
                const createQuoteItem = await db.quote_item.create({
                    product_id,
                    quote_id: createQuote.id,
                    price: prod_regular_price,
                    quantity: quantity ?? 1,
                    total_price: quantity ? quantity * prod_regular_price : prod_regular_price,
                    createdBy: user.id,
                    tenant_id: TENANTID
                });
                if (!createQuoteItem) return { message: "New Quote Item Create Failed!!", status: false }
            }

            await quoteTransaction.commit();

            // Return Formation
            return {
                message: "Successfully Created a Quote",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add To Quote API
    submitQuote: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { quote_id, user_id } = req;

            // Check If User Already Have Quote Data
            const findQuote = await db.quote.findOne({
                where: {
                    [Op.and]: [{
                        id: quote_id,
                        user_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findQuote) return { message: "User Has No Quote Yet", status: false }

            // Check Already Have Quotation
            const checkQuote = await db.submitted_quote.findOne({
                where: {
                    [Op.and]: [{
                        user_id,
                        quote_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (checkQuote) return { message: "You Cannot Make Quote When You Have One Pending Already!!!", status: false };

            // Submit Quote
            const submitquote = await db.submitted_quote.create({
                user_id,
                quote_id,
                createdBy: user.id,
                tenant_id: TENANTID
            });
            if (!submitquote) return { message: "Quote Cannot Be Submitted!!!", status: false }


            await quoteTransaction.commit();

            // Return Formation
            return {
                message: "Submitted The Quote!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}