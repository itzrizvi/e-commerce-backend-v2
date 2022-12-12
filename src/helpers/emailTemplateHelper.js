// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Email Template HELPER
module.exports = {
    // Add Email Template On List API
    addEmailTemplateOnList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, email_template_id } = req;

            // Create Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findEmailTemplateOnList = await db.email_template_list.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findEmailTemplateOnList) return { message: "Already Have This Email Template on The List!!!!", status: false }

            // Add TO DB
            const insertEmailTemplateOnList = await db.email_template_list.create({
                name,
                slug,
                email_template_id,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertEmailTemplateOnList) {
                return {
                    message: "Email Template Added On List Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Email Template On List API
    updateEmailTemplateOnList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id,
                email_template_id,
                name } = req;

            let slug;
            if (name) {
                // Create Slug
                slug = slugify(`${name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist
                const checkExistence = await db.email_template_list.findOne({
                    where: {
                        [Op.and]: [{
                            slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                // If Found Brand
                if (checkExistence) return { message: "Already Have This Email Template On List!!!", status: false };
            }


            // Update Doc
            const updateDoc = {
                name,
                slug,
                email_template_id,
                updated_by: user.id
            };
            const updateList = await db.email_template_list.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            if (updateList) {
                return {
                    message: "Email Template Updated On List Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET EMAIL TEMPLATE LIST API
    getAllEmailTemplateList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_template_list.hasAlias('user') && !db.email_template_list.hasAlias('added_by')) {

                await db.email_template_list.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }
            // GET LIST
            const getlist = await db.email_template_list.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ["slug", "ASC"]
                ]
            });


            return {
                message: "GET List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getlist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    //
    getSingleEmailTemplateList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_template_list.hasAlias('user') && !db.email_template_list.hasAlias('added_by')) {

                await db.email_template_list.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }
            // GET LIST
            const getsinglelist = await db.email_template_list.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created
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
                },
                order: [
                    ["slug", "ASC"]
                ]
            });


            return {
                message: "GET Single Email List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getsinglelist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Email Template Header Footer API
    addEmailTempHeaderFooter: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, content, type } = req;

            // Create Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findEmailHeaderFoooter = await db.email_header_footer.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findEmailHeaderFoooter) return { message: "Already Have This Email Header or Footer!!!!", status: false }

            // Add TO DB
            const insertEmailTemplateHF = await db.email_header_footer.create({
                name,
                slug,
                content,
                type,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertEmailTemplateHF) {
                return {
                    message: "Email Template Header or Footer Component Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Email Template Header Footer API
    updateEmailTempHeaderFooter: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, name, content, type } = req;

            let slug;
            if (name) {
                // Create Slug
                slug = slugify(`${name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist
                const checkExistence = await db.email_header_footer.findOne({
                    where: {
                        [Op.and]: [{
                            slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                // If Found Brand
                if (checkExistence) return { message: "Already Have This Email Template Header or Footer!!!", status: false };
            }


            // Add TO DB
            const updateEmailTemplateHF = await db.email_header_footer.update({
                name,
                slug,
                content,
                type,
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            if (updateEmailTemplateHF) {
                return {
                    message: "Email Template Header or Footer Component Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE Email Template Header Footer API
    getSingleEmailTempHeaderFooter: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_header_footer.hasAlias('user') && !db.email_header_footer.hasAlias('added_by')) {

                await db.email_header_footer.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }
            // GET LIST
            const getsingleTempHF = await db.email_header_footer.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created
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
                },
                order: [
                    ["slug", "ASC"]
                ]
            });


            return {
                message: "GET Single Email Template Component Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getsingleTempHF
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Email Template Header Footer List API
    getEmailTempHeaderFooterList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_header_footer.hasAlias('user') && !db.email_header_footer.hasAlias('added_by')) {

                await db.email_header_footer.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }
            // GET LIST
            const getlist = await db.email_header_footer.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ["slug", "ASC"]
                ]
            });


            return {
                message: "GET List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getlist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Email Template API
    createEmailTemplate: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, content, header_id, footer_id } = req;

            // Create Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findEmailTemplate = await db.email_template.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findEmailTemplate) return { message: "Already Have This Email Template!!!!", status: false }

            // Add TO DB
            const insertEmailTemplate = await db.email_template.create({
                name,
                slug,
                content,
                header_id,
                footer_id,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertEmailTemplate) {
                return {
                    message: "Email Template Created Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Email Template API
    updateEmailTemplate: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, name, content, header_id, footer_id } = req;

            let slug;
            if (name) {
                // Create Slug
                slug = slugify(`${name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist
                const checkExistence = await db.email_template.findOne({
                    where: {
                        [Op.and]: [{
                            slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                // If Found Brand
                if (checkExistence) return { message: "Already Have This Email Template!!!", status: false };
            }

            //
            const updateDoc = {
                name,
                slug,
                content,
                header_id,
                footer_id,
                updated_by: user.id
            }

            // Update
            const updateEmailTemplate = await db.email_template.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateEmailTemplate) return { message: "Update Failed!!!", status: false };

            // Return Formation
            if (updateEmailTemplate) {
                return {
                    message: "Email Template Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE Email Template API
    getSingleEmailTemplate: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_template.hasAlias('user') && !db.email_template.hasAlias('added_by')) {

                await db.email_template.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }


            // 
            if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('emailHeader')) {
                await db.email_template.hasOne(db.email_header_footer, {
                    sourceKey: 'header_id',
                    foreignKey: 'id',
                    as: 'emailHeader'
                });
            }

            // 
            if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('emailFooter')) {
                await db.email_template.hasOne(db.email_header_footer, {
                    sourceKey: 'footer_id',
                    foreignKey: 'id',
                    as: 'emailFooter'
                });
            }


            // GET LIST
            const getsingleTemplate = await db.email_template.findOne({
                include: [
                    { model: db.email_header_footer, as: 'emailHeader' },
                    { model: db.email_header_footer, as: 'emailFooter' },
                    {
                        model: db.user, as: 'added_by', // Include User who created
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
            });


            return {
                message: "GET Single Email Template Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getsingleTemplate
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Email Template List API
    getEmailTemplateList: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.email_template.hasAlias('user') && !db.email_template.hasAlias('added_by')) {

                await db.email_template.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }


            // 
            if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('emailHeader')) {
                await db.email_template.hasOne(db.email_header_footer, {
                    sourceKey: 'header_id',
                    foreignKey: 'id',
                    as: 'emailHeader'
                });
            }

            // 
            if (!db.email_template.hasAlias('email_header_footer') && !db.email_template.hasAlias('emailFooter')) {
                await db.email_template.hasOne(db.email_header_footer, {
                    sourceKey: 'footer_id',
                    foreignKey: 'id',
                    as: 'emailFooter'
                });
            }


            // GET LIST
            const getEmailTemplateList = await db.email_template.findAll({
                include: [
                    { model: db.email_header_footer, as: 'emailHeader' },
                    { model: db.email_header_footer, as: 'emailFooter' },
                    {
                        model: db.user, as: 'added_by', // Include User who created
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                }
            });


            return {
                message: "GET Email Template List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getEmailTemplateList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}