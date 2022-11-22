// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Contact Us HELPER
module.exports = {
    // Create Contact Us MSG API
    createContactUs: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, email, phone, subject, message, images } = req;

            // Add Contact Message TO DB
            const insertMessage = await db.contact_us.create({
                name,
                email,
                phone,
                subject,
                message
            });

            // Return Formation
            if (insertMessage) {
                return {
                    message: "Message Sent Successfully, We Will Contact You Shortly.",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // // GET SINGLE TAX CLASS ADMIN
    // getSingleTaxClassAdmin: async (req, db, user, isAuth, TENANTID) => {
    //     // Try Catch Block
    //     try {

    //         // DATA FROM REQUEST
    //         const { taxClass_id } = req;

    //         // Created By Associations
    //         db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
    //         db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

    //         // Check If Has Alias with Users and Roles
    //         if (!db.tax_class.hasAlias('user') && !db.tax_class.hasAlias('added_by')) {

    //             await db.tax_class.hasOne(db.user, {
    //                 sourceKey: 'created_by',
    //                 foreignKey: 'id',
    //                 as: 'added_by'
    //             });
    //         }

    //         // GET TAX CLASS FOR ADMIN
    //         const gettaxclass = await db.tax_class.findOne({
    //             include: [
    //                 {
    //                     model: db.user, as: 'added_by', // Include User who created this Tax Class
    //                     include: {
    //                         model: db.role,
    //                         as: 'roles'
    //                     }
    //                 }
    //             ],
    //             where: {
    //                 [Op.and]: [{
    //                     id: taxClass_id,
    //                     tenant_id: TENANTID
    //                 }]
    //             }
    //         });


    //         return {
    //             message: "GET Single Tax Class Admin Success!!!",
    //             tenant_id: TENANTID,
    //             status: true,
    //             data: gettaxclass
    //         }


    //     } catch (error) {
    //         if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    //     }
    // },
    // // GET TAX CLASS LIST
    // getTaxClassList: async (db, TENANTID) => {
    //     // Try Catch Block
    //     try {

    //         // Created By Associations
    //         db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
    //         db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

    //         // Check If Has Alias with Users and Roles
    //         if (!db.tax_class.hasAlias('user') && !db.tax_class.hasAlias('added_by')) {

    //             await db.tax_class.hasOne(db.user, {
    //                 sourceKey: 'created_by',
    //                 foreignKey: 'id',
    //                 as: 'added_by'
    //             });
    //         }
    //         // GET TAX CLASS LIST
    //         const gettaxclasslist = await db.tax_class.findAll({
    //             include: [
    //                 {
    //                     model: db.user, as: 'added_by', // Include User who created Tax Classes
    //                     include: {
    //                         model: db.role,
    //                         as: 'roles'
    //                     }
    //                 }
    //             ],
    //             where: {
    //                 tenant_id: TENANTID
    //             }
    //         });


    //         return {
    //             message: "GET Tax Class List Success!!!",
    //             tenant_id: TENANTID,
    //             status: true,
    //             data: gettaxclasslist
    //         }


    //     } catch (error) {
    //         if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    //     }
    // }
}