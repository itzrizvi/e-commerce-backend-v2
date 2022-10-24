// ShippingAddress model
module.exports = (sequelize, DataTypes) => {

    const ShippingAddress = sequelize.define("shippping_address", {
        shippping_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        ref_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ref_model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shippping_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shippping_city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shippping_PO_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shippping_country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'shippping_address',
    })

    return ShippingAddress
}