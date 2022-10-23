// Vendor model
module.exports = (sequelize, DataTypes) => {

    const Vendor = sequelize.define("vendor", {
        vendor_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        vendor_name: {
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
        vendor_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vendor_city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vendor_country: {
            type: DataTypes.STRING,
            allowNull: false
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
        freezeTableName: true,
        tableName: 'vendor',
    })

    return Vendor
}