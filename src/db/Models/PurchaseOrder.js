// Purchase Order model
module.exports = (sequelize, DataTypes) => {

    const PurchaseOrder = sequelize.define("purchase_order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        po_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rec_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payment_method_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grandTotal_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tax_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        vendor_billing_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vendor_shipping_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shipping_method_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM("default", "drop_shipping"),
            allowNull: false
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true
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

    return PurchaseOrder
}