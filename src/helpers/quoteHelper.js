// All Requires
const { Op } = require("sequelize");
const { Mail } = require("../utils/email");
const config = require('config');
const { crypt, decrypt } = require("../utils/hashes");
const { default: slugify } = require("slugify");


// Quote HELPER
module.exports = {
    // Add To Quote API
    addToQuote: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { product_id, quantity } = req;

            // Check If User Already Have Quote Data
            const findQuote = await db.quote.findOne({
                where: {
                    [Op.and]: [{
                        user_id: user.id,
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
            const { prod_regular_price, prod_sale_price } = findProduct

            let productPrice;
            if (prod_sale_price > 0) {
                productPrice = prod_sale_price;
            } else {
                productPrice = prod_regular_price;
            }

            // IF QUOTE FOUND
            if (findQuote) {
                // GET QUOTE DATA
                const { id, grand_total } = findQuote;
                // Check the Product is Already in Quote Items
                const checkQuoteItem = await db.quote_item.findOne({
                    where: {
                        product_id,
                        quote_id: id,
                        tenant_id: TENANTID
                    }
                });

                // Update Quote Items
                if (checkQuoteItem) {
                    const { id: quoteItemID, total_price, quantity: quoteItemQuantity } = checkQuoteItem;

                    let restTotal = grand_total - total_price;
                    let updatedGrandTotal = restTotal + (productPrice * quantity ?? 1);

                    // Update Quote
                    const updateQuote = await db.quote.update({
                        grand_total: updatedGrandTotal,
                        updatedBy: user.id
                    }, {
                        where: {
                            [Op.and]: [{
                                id,
                                user_id: user.id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!updateQuote) return { message: "Quote Update Failed!!", status: false }

                    const quoteItemUpdate = await db.quote_item.update({
                        quantity: quantity ? quantity : quoteItemQuantity,
                        total_price: quantity ? quantity * productPrice : total_price,
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

                    let updatedGrandTotal = grand_total + (productPrice * quantity ?? 1);

                    // Update Quote
                    const updateQuote = await db.quote.update({
                        grand_total: updatedGrandTotal,
                        updatedBy: user.id
                    }, {
                        where: {
                            [Op.and]: [{
                                id,
                                user_id: user.id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!updateQuote) return { message: "Quote Update Failed!!", status: false }


                    const quoteItemCreate = await db.quote_item.create({
                        product_id,
                        quote_id: id,
                        price: productPrice,
                        quantity: quantity ?? 1,
                        total_price: quantity ? quantity * productPrice : 1 * productPrice,
                        tenant_id: TENANTID,
                        createdBy: user.id,
                        updatedBy: user.id
                    });
                    if (!quoteItemCreate) return { message: "Quote Item Create Failed!!", status: false }
                }

                await quoteTransaction.commit();
                // Return Formation
                return {
                    message: "Successfully Added The New Item In Your Quote",
                    status: true,
                    tenant_id: TENANTID,
                    id,
                }

            } else {

                // Create Quote
                const createQuote = await db.quote.create({
                    user_id: user.id,
                    status: "new",
                    grand_total: quantity ? quantity * productPrice : productPrice,
                    createdBy: user.id,
                    tenant_id: TENANTID
                });
                if (!createQuote) return { message: "Quote Create Failed!!", status: false }

                // Create Quote Item
                const createQuoteItem = await db.quote_item.create({
                    product_id,
                    quote_id: createQuote.id,
                    price: productPrice,
                    quantity: quantity ?? 1,
                    total_price: quantity ? quantity * productPrice : productPrice,
                    createdBy: user.id,
                    tenant_id: TENANTID
                });
                if (!createQuoteItem) return { message: "New Quote Item Create Failed!!", status: false }

                await quoteTransaction.commit();
                // Return Formation
                return {
                    message: "Successfully Created Quote",
                    status: true,
                    tenant_id: TENANTID,
                    id: createQuote.id,
                }
            }

        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Quote Item Delete API
    quoteItemDelete: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;

            // Inlcude Quote Items
            if (!db.quote_item.hasAlias('quote')) {
                await db.quote_item.hasOne(db.quote, {
                    sourceKey: "quote_id",
                    foreignKey: 'id',
                    as: 'quote'
                });
            }
            // Check If User Already Have Quote Data
            const findQuoteitem = await db.quote_item.findOne({
                include: { model: db.quote, as: "quote" },
                where: {
                    [Op.and]: [{
                        id,
                        createdBy: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            //
            const { grand_total, id: quoteID } = findQuoteitem.quote;
            const { total_price } = findQuoteitem;

            // Update Grand Total On Quote
            const updategrandtotal = await db.quote.update({
                grand_total: grand_total - total_price
            }, {
                where: {
                    [Op.and]: [{
                        id: quoteID,
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updategrandtotal) return { message: "Quote Grand Total Couldn't Updated", status: false }

            // Delete Quote Item
            const deleteQuoteItem = await db.quote_item.destroy({
                where: {
                    [Op.and]: [{
                        id,
                        createdBy: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!deleteQuoteItem) return { message: "Quote Item Couldn't Deleted", status: false }


            await quoteTransaction.commit();
            // Return Formation
            return {
                message: "Successfully Deleted Quote Item",
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
            const { quote_id, note } = req;

            // Inlcude Quote Items
            if (!db.quote.hasAlias('quote_item') && !db.quote.hasAlias('quoteitems')) {

                await db.quote.hasMany(db.quote_item, {
                    foreignKey: 'quote_id',
                    as: 'quoteitems'
                });
            }

            // Check If User Already Have Quote Data
            const findQuote = await db.quote.findOne({
                include: { model: db.quote_item, as: "quoteitems" },
                where: {
                    [Op.and]: [{
                        id: quote_id,
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findQuote) return { message: "User Has No Quote Yet", status: false }

            // 
            let grandTotal = 0;
            findQuote.quoteitems.forEach(async (item) => {
                grandTotal += item.total_price;
            });

            // Insert Submitted Quote
            const submitquote = await db.submitted_quote.create({
                user_id: user.id,
                status: "new",
                grand_total: grandTotal,
                note,
                createdBy: user.id,
                tenant_id: TENANTID
            });
            if (!submitquote) return { message: "Quote Cannot Be Submitted!!!", status: false }

            //
            let submittedQuoteItems = [];
            findQuote.quoteitems.forEach(async (item) => {
                grandTotal += item.total_price;
                submittedQuoteItems.push({
                    product_id: item.product_id,
                    submittedquote_id: submitquote.id,
                    price: item.price,
                    quantity: item.quantity,
                    total_price: item.total_price,
                    createdBy: user.id,
                    tenant_id: TENANTID
                });
            });
            if (submittedQuoteItems && submittedQuoteItems.length > 0) {
                // Insert Submitted Quote Items
                const insertSubmittedQuoteItems = await db.submittedquote_item.bulkCreate(submittedQuoteItems);
                if (!insertSubmittedQuoteItems) return { message: "Quote Items Cannot Be Submitted!!!", status: false }
            }

            // Delete Quote Items
            await db.quote_item.destroy({
                where: {
                    [Op.and]: [{
                        quote_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Delete Quote
            await db.quote.destroy({
                where: {
                    [Op.and]: [{
                        id: quote_id,
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Setting Up Data for EMAIL SENDER
            const mailSubject = "About Quote Submission From Prime Server Parts"
            const mailData = {
                companyInfo: {
                    logo: 'https://i.ibb.co/Kh8QDFg/image-5.png',
                    banner: 'https://i.ibb.co/p4vh3XK/image-6.jpg',
                    companyName: 'Prime Server Parts',
                    companyUrl: 'https://main.dhgmx4ths2j4g.amplifyapp.com/',
                    shopUrl: 'https://main.dhgmx4ths2j4g.amplifyapp.com/',
                    fb: 'https://i.ibb.co/vZVT4sQ/image-1.png',
                    tw: 'https://i.ibb.co/41j5tdG/image-2.png',
                    li: 'https://i.ibb.co/0JS5Xsq/image-3.png',
                    insta: 'https://i.ibb.co/WFs1krt/image-4.png'
                },
                about: 'Your Quote Has Been Submitted',
                message: `You Will Be Notified By Email After Review The Submitted Quote.`
            }

            // SENDING EMAIL
            // await verifierEmail(mailData);
            // SENDING EMAIL
            await Mail(user.email, mailSubject, mailData, 'quote_submit');

            await quoteTransaction.commit();

            // Return Formation
            return {
                message: "Submitted The Quote Success!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Quote Sync API
    quoteSyncController: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { products } = req;

            // Product ID Array
            const productIds = [];
            products.forEach(async (element) => {
                await productIds.push(element.product_id)
            });

            // GET Products Data
            const findProducts = await db.product.findAll({
                where: {
                    [Op.and]: [{
                        id: productIds,
                        tenant_id: TENANTID
                    }]
                }
            });

            //
            let grandTotal = 0;
            let quoteItems = [];

            // Find Product and Get Details and push to array
            await products.forEach(async (item) => {
                findProducts.forEach(async (element) => {
                    if (item.product_id === parseInt(element.id)) {
                        //
                        const { prod_regular_price, prod_sale_price } = element;
                        let productPrice;
                        if (prod_sale_price > 0) {
                            productPrice = prod_sale_price;
                        } else {
                            productPrice = prod_regular_price;
                        }
                        //
                        grandTotal += productPrice * item.quantity;

                        quoteItems.push({
                            product_id: item.product_id,
                            price: productPrice,
                            quantity: item.quantity ?? 1,
                            total_price: item.quantity ? item.quantity * productPrice : 1 * productPrice,
                            createdBy: user.id,
                            tenant_id: TENANTID
                        })

                    }
                });
            });

            //
            const syncquote = await db.quote.create({
                user_id: user.id,
                status: "new",
                grand_total: grandTotal,
                createdBy: user.id,
                tenant_id: TENANTID
            });
            if (!syncquote) return { message: "Quote Sync Failed!!", status: false }

            //
            if (quoteItems && quoteItems.length > 0) {
                //
                quoteItems.forEach((element) => {
                    element.quote_id = syncquote.id
                });

                const quoteitemsync = await db.quote_item.bulkCreate(quoteItems);
                if (!quoteitemsync) return { message: "Quote Items Sync Failed!!", status: false }
            }

            await quoteTransaction.commit();
            // Return Formation
            return {
                message: "Successfully Synced Your Quote",
                status: true,
                tenant_id: TENANTID,
                id: syncquote.id,
            }


        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Quote List API
    getQuoteList: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Associations
            // Inlcude Quote Items
            if (!db.quote.hasAlias('quote_item') && !db.quote.hasAlias('quoteitems')) {

                await db.quote.hasMany(db.quote_item, {
                    foreignKey: 'quote_id',
                    as: 'quoteitems'
                });
            }
            // Inlcude Quote Items
            if (!db.quote_item.hasAlias('product')) {

                await db.quote_item.hasOne(db.product, {
                    sourceKey: "product_id",
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.quote.hasAlias('user') && !db.quote.hasAlias('quotedby')) {
                await db.quote.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'quotedby'
                });
            }


            // GET QUOTE LIST
            const quotelist = await db.quote.findOne({
                include: [
                    {
                        model: db.quote_item, as: "quoteitems",
                        seperate: true,
                        order: [{ model: db.quote_item }, 'createdAt', 'DESC'],
                        include: {
                            model: db.product,
                            as: "product"
                        }
                    },
                    {
                        model: db.user, as: 'quotedby', // Include User 
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            })

            // Return Formation
            return {
                message: "Successfully GET Quotes",
                status: true,
                tenant_id: TENANTID,
                data: quotelist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Submitted Quote List API
    getSubmittedQuoteList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            const { searchQuery,
                status,
                quoteEntryStartDate,
                quoteEntryEndDate,
                minAmount,
                maxAmount } = req;

            // Associations
            // Inlcude Submitted Quote Items
            if (!db.submitted_quote.hasAlias('submittedquote_item') && !db.submitted_quote.hasAlias('submittedquoteitems')) {

                await db.submitted_quote.hasMany(db.submittedquote_item, {
                    foreignKey: 'submittedquote_id',
                    as: 'submittedquoteitems'
                });
            }
            // Inlcude Quote Items
            if (!db.submittedquote_item.hasAlias('product')) {

                await db.submittedquote_item.hasOne(db.product, {
                    sourceKey: "product_id",
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.submitted_quote.hasAlias('user') && !db.submitted_quote.hasAlias('quotedby')) {
                await db.submitted_quote.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'quotedby'
                });
            }

            const searchQueryWhere = searchQuery ? {
                [Op.or]: [
                    {
                        email: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    },
                    {
                        first_name: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    },
                    {
                        last_name: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    }
                ]
            } : {};

            const twoDateFilterWhere = quoteEntryStartDate && quoteEntryEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(quoteEntryStartDate),
                    [Op.lte]: new Date(quoteEntryEndDate),
                }]
            } : {};

            const startDateFilterWhere = (quoteEntryStartDate && !quoteEntryEndDate) ? {
                [Op.gte]: new Date(quoteEntryStartDate)
            } : {};

            const endDateFilterWhere = (quoteEntryEndDate && !quoteEntryStartDate) ? {
                [Op.lte]: new Date(quoteEntryEndDate)
            } : {};

            // GET SUBMITTED QUOTE LIST
            const submittedquotelist = await db.submitted_quote.findAll({
                include: [
                    {
                        model: db.submittedquote_item, as: "submittedquoteitems",
                        seperate: true,
                        order: [{ model: db.quote_item }, 'createdAt', 'DESC'],
                        include: {
                            model: db.product,
                            as: "product"
                        }
                    },
                    {
                        model: db.user,
                        as: 'quotedby', // Include User
                        ...(searchQuery && { where: searchQueryWhere }),
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID,
                    ...((quoteEntryStartDate || quoteEntryEndDate) && {
                        createdAt: {
                            [Op.or]: [{
                                ...(twoDateFilterWhere && twoDateFilterWhere),
                                ...(startDateFilterWhere && startDateFilterWhere),
                                ...(endDateFilterWhere && endDateFilterWhere),
                            }],
                        }
                    }),
                    ...(status && { // 
                        status: status
                    }),
                    ...((minAmount || maxAmount) && { // 
                        grand_total: {
                            [Op.and]: [{
                                [Op.gte]: minAmount ?? 0,
                                [Op.lte]: maxAmount ?? 99999999999999
                            }]
                        }
                    }),
                }
            })

            // Return Formation
            return {
                message: "Successfully GET Submitted Quotes",
                status: true,
                tenant_id: TENANTID,
                data: submittedquotelist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Submitted Quote List API
    getSingleSubmittedQuote: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;

            // Associations
            // Inlcude Submitted Quote Items
            if (!db.submitted_quote.hasAlias('submittedquote_item') && !db.submitted_quote.hasAlias('submittedquoteitems')) {

                await db.submitted_quote.hasMany(db.submittedquote_item, {
                    foreignKey: 'submittedquote_id',
                    as: 'submittedquoteitems'
                });
            }
            // Inlcude Quote Items
            if (!db.submittedquote_item.hasAlias('product')) {

                await db.submittedquote_item.hasOne(db.product, {
                    sourceKey: "product_id",
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.submitted_quote.hasAlias('user') && !db.submitted_quote.hasAlias('quotedby')) {
                await db.submitted_quote.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'quotedby'
                });
            }


            // GET SINGLE SUBMITTED QUOTE
            const singlesubmittedquote = await db.submitted_quote.findOne({
                include: [
                    {
                        model: db.submittedquote_item, as: "submittedquoteitems",
                        seperate: true,
                        order: [{ model: db.quote_item }, 'createdAt', 'DESC'],
                        include: {
                            model: db.product,
                            as: "product"
                        }
                    },
                    {
                        model: db.user, as: 'quotedby', // Include User 
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            })

            // Return Formation
            return {
                message: "Successfully GET Single Submitted Quote",
                status: true,
                tenant_id: TENANTID,
                data: singlesubmittedquote
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Submitted Quote API
    updateSubmittedQuote: async (req, db, user, isAuth, TENANTID) => {
        const quoteTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { id, status, products, note } = req;

            // GET SUBMITTED QUOTE DATA
            const { user_id } = await db.submitted_quote.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            // Find CUSTOMER DATA 
            const { email, first_name } = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        id: user_id,
                        tenant_id: TENANTID
                    }]
                }
            });


            if (products && products.length > 0) {

                // Product ID Array
                const productIds = [];
                let grandTotal = 0;
                products.forEach(async (element) => {
                    grandTotal += element.price * element.quantity;
                    await productIds.push(element.product_id);
                });

                await db.submittedquote_item.destroy({
                    where: {
                        [Op.and]: [{
                            product_id: {
                                [Op.notIn]: productIds
                            },
                            submittedquote_id: id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Update Submitted Quote Grand Total
                await db.submitted_quote.update({
                    grand_total: grandTotal,
                    note,
                    status,
                    updatedBy: user.id
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });


                // Update Submitted Quote Item
                await products.forEach(async (item) => {

                    await db.submittedquote_item.update({
                        product_id: item.product_id,
                        submittedquote_id: id,
                        price: item.price,
                        quantity: item.quantity,
                        total_price: item.quantity * item.price,
                        updatedBy: user.id
                    }, {
                        where: {
                            [Op.and]: [{
                                product_id: item.product_id,
                                submittedquote_id: id,
                                tenant_id: TENANTID
                            }]
                        }
                    })

                });


            } else {
                // Update Submitted Quote Grand Total
                await db.submitted_quote.update({
                    note,
                    status,
                    updatedBy: user.id
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });
            }


            // Update Submitted QUote Status
            if (status === "new") {

                // Update Submitted Quote Grand Total
                await db.submitted_quote.update({
                    status: "in-progress"
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });
            }



            // If Submitted
            if (status === "submitted") {
                let hashedID = crypt(`${id + '#' + email}`);

                // Setting Up Data for EMAIL SENDER
                const mailSubject = "Your Quote Has Been Reviewed From Prime Server Parts"
                let quoteApproveURL = config.get("ECOM_URL").concat(config.get("QUOTE_APPROVE")).concat(hashedID);
                const mailData = {
                    companyInfo: {
                        logo: 'https://i.ibb.co/Kh8QDFg/image-5.png',
                        banner: 'https://i.ibb.co/p4vh3XK/image-6.jpg',
                        companyName: 'Prime Server Parts',
                        companyUrl: 'https://main.dhgmx4ths2j4g.amplifyapp.com/',
                        shopUrl: 'https://main.dhgmx4ths2j4g.amplifyapp.com/',
                        fb: 'https://i.ibb.co/vZVT4sQ/image-1.png',
                        tw: 'https://i.ibb.co/41j5tdG/image-2.png',
                        li: 'https://i.ibb.co/0JS5Xsq/image-3.png',
                        insta: 'https://i.ibb.co/WFs1krt/image-4.png'
                    },
                    first_name,
                    about: 'Your Quote Has Been Reviewed',
                    message: `Please Check The Link To See Your Reviewed Quote From Prime Server Parts System.`,
                    link: quoteApproveURL
                }

                // SENDING EMAIL
                await Mail(email, mailSubject, mailData, 'approve_quote');

            }




            await quoteTransaction.commit();
            // Return Formation
            return {
                message: "Update Quote Success!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            await quoteTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET REVIEWED Submitted Quote  API
    getReviewedQuote: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;
            const decryptID = decrypt(id).split("#");
            const submittedQuoteID = parseInt(decryptID[0]);
            const email = decryptID[1];

            // Check User Is OK
            if (email === user.email) {

                // Associations
                // Inlcude Submitted Quote Items
                if (!db.submitted_quote.hasAlias('submittedquote_item') && !db.submitted_quote.hasAlias('submittedquoteitems')) {

                    await db.submitted_quote.hasMany(db.submittedquote_item, {
                        foreignKey: 'submittedquote_id',
                        as: 'submittedquoteitems'
                    });
                }
                // Inlcude Quote Items
                if (!db.submittedquote_item.hasAlias('product')) {

                    await db.submittedquote_item.hasOne(db.product, {
                        sourceKey: "product_id",
                        foreignKey: 'id',
                        as: 'product'
                    });
                }

                // Created By Associations
                db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
                db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

                // Check If Has Alias with Users and Roles
                if (!db.submitted_quote.hasAlias('user') && !db.submitted_quote.hasAlias('quotedby')) {
                    await db.submitted_quote.hasOne(db.user, {
                        sourceKey: 'user_id',
                        foreignKey: 'id',
                        as: 'quotedby'
                    });
                }


                // GET SINGLE SUBMITTED QUOTE
                const singlesubmittedquote = await db.submitted_quote.findOne({
                    include: [
                        {
                            model: db.submittedquote_item, as: "submittedquoteitems",
                            seperate: true,
                            order: [{ model: db.quote_item }, 'createdAt', 'DESC'],
                            include: {
                                model: db.product,
                                as: "product"
                            }
                        },
                        {
                            model: db.user, as: 'quotedby', // Include User 
                            include: {
                                model: db.role,
                                as: 'roles'
                            }
                        }
                    ],
                    where: {
                        [Op.and]: [{
                            id: submittedQuoteID,
                            status: "submitted",
                            tenant_id: TENANTID
                        }]
                    }
                })

                //Return Formation
                return {
                    message: "Successfully GET Single Submitted Quote",
                    status: true,
                    tenant_id: TENANTID,
                    data: singlesubmittedquote
                }


            } else {
                return {
                    message: "Please Authenticate With Correct User!!!",
                    status: false,
                    tenant_id: TENANTID,
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Quote Status API
    createQuoteStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { name, description, status } = req;

            // Order Status Slug
            const slug = slugify(`${name}`, {
                replacement: "-",
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true,
            });

            // Check Existence
            const findQuoteStatus = await db.quote_status.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID,
                    }],
                },
            });
            if (findQuoteStatus)
                return { message: "Already Have This Quote Status!!!!", status: false };

            // Add Quote Status
            const insertQuoteStatus = await db.quote_status.create({
                name,
                slug,
                description,
                status,
                tenant_id: TENANTID,
                created_by: user.id,
            });

            // Return Formation
            if (insertQuoteStatus) {
                return {
                    message: "Quote Status Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                };
            }
        } catch (error) {
            if (error)
                return {
                    message: `Something Went Wrong!!! Error: ${error}`,
                    status: false,
                };
        }
    },
    // GET Quote Status List Admin
    getQuoteStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {
            // Created By Associations
            db.user.belongsToMany(db.role, {
                through: db.admin_role,
                foreignKey: "admin_id",
            });
            db.role.belongsToMany(db.user, {
                through: db.admin_role,
                foreignKey: "role_id",
            });

            // Check If Has Alias with Users and Roles
            if (
                !db.quote_status.hasAlias("user") &&
                !db.quote_status.hasAlias("added_by")
            ) {
                await db.quote_status.hasOne(db.user, {
                    sourceKey: "created_by",
                    foreignKey: "id",
                    as: "added_by",
                });
            }

            // GET ORDER STATUS List
            const getquotestatuslist = await db.quote_status.findAll({
                include: [
                    {
                        model: db.user,
                        as: "added_by", // Include User who created this Order Status
                        include: {
                            model: db.role,
                            as: "roles",
                        },
                    },
                ],
                where: {
                    tenant_id: TENANTID,
                },
                order: [
                    ['slug', 'ASC']
                ]
            });

            return {
                message: "GET Quote Status List For Admin Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getquotestatuslist,
            };
        } catch (error) {
            if (error)
                return {
                    message: `Something Went Wrong!!! Error: ${error}`,
                    status: false,
                };
        }
    },

}