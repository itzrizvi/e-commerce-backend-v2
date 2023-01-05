// Vendor model
module.exports = (sequelize, DataTypes) => {

    const Vendor = sequelize.define("vendor", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contact_person: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        FAX_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        EIN_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        TAX_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    return Vendor
}