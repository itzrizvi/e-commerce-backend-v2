// Address model
module.exports = (sequelize, DataTypes) => {

    const DefaultAddress = sequelize.define("default_address", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address_type: {
            type: DataTypes.ENUM("shipping", "billing"),
            allowNull: false
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    }, {
        timestamps: true
    })

    return DefaultAddress
}