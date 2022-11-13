// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Tax Class HELPER
module.exports = {
    // Add Tax Class API
    addTaxClass: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { zip_code, tax_amount } = req;

            // Check Existence
            const findZipCode = await db.tax_class.findOne({
                where: {
                    [Op.and]: [{
                        zip_code,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findZipCode) return { message: "Already Have This Zip Code!!!!", status: false }

            // Add Tax Class TO DB
            const insertTaxClass = await db.tax_class.create({
                zip_code,
                tax_amount,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertTaxClass) {
                return {
                    message: "Tax Class Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE TAX CLASS ADMIN
    getSingleTaxClassAdmin: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { taxClass_id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.tax_class.hasAlias('user') && !db.tax_class.hasAlias('added_by')) {

                await db.tax_class.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET TAX CLASS FOR ADMIN
            const gettaxclass = await db.tax_class.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Tax Class
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id: taxClass_id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Tax Class Admin Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: gettaxclass
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE TAX CLASS PUBLIC
    getSingleTaxClassPublic: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { taxClass_id } = req;

            // GET TAX CLASS FOR PUBLIC
            const gettaxclasspublic = await db.tax_class.findOne({
                where: {
                    [Op.and]: [{
                        id: taxClass_id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Tax Class Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: gettaxclasspublic
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET TAX CLASS LIST
    getTaxClassList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.tax_class.hasAlias('user') && !db.tax_class.hasAlias('added_by')) {

                await db.tax_class.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }
            // GET TAX CLASS LIST
            const gettaxclasslist = await db.tax_class.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created Tax Classes
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
                message: "GET Tax Class List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: gettaxclasslist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Tax Class 
    updateTaxClass: async (req, db, user, isAuth, TENANTID) => {
        try {

            // DATA FROM REQUEST
            const { id, zip_code, tax_amount } = req;

            // If Zip Code updated
            if (zip_code) {

                // Check Existence
                const checkExist = await db.tax_class.findOne({
                    where: {
                        [Op.and]: [{
                            zip_code,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                if (checkExist) return { message: "Already Have This Tax Class!!!", status: false };
            }


            // Update Doc 
            const updateDoc = {
                zip_code,
                tax_amount,
                updated_by: user.id
            }

            // Update Tax Class
            const updatetaxclass = await db.tax_class.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Formation
            if (updatetaxclass) {
                return {
                    message: "Tax Class Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }
}