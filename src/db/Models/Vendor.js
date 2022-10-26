// Vendor model
module.exports = (sequelize, DataTypes) => {

    const Vendor = sequelize.define("vendor", {
        vendor_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        vendor_contact_person: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vendor_company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false
        },
        vendor_phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_EIN_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_TAX_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_FAX_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'vendor',
    })

    return Vendor
}