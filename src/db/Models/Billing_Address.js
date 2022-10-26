// BillingAddress model
module.exports = (sequelize, DataTypes) => {

    const BillingAddress = sequelize.define("billing_address", {
        billing_uuid: {
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
        billing_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        billing_city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        billing_PO_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        billing_country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        tableName: 'billing_address',
    })

    return BillingAddress
}