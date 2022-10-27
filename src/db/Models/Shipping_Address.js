// ShippingAddress model
module.exports = (sequelize, DataTypes) => {

    const ShippingAddress = sequelize.define("shipping_address", {
        shipping_uuid: {
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
        shipping_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_PO_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        tableName: 'shipping_address',
    })

    return ShippingAddress
}