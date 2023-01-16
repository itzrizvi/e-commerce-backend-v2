// Purchase Order model
module.exports = (sequelize, DataTypes) => {

    const PurchaseOrder = sequelize.define("purchase_order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        po_number: {
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
        shipping_cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        is_insurance: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        receiving_instruction: {
            type: DataTypes.TEXT,
            allowNull: true
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
        shipping_account_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        contact_person_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM("default", "drop_shipping"),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("created", "approved", "declined"),
            allowNull: false,
            defaultValue: "created"
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true
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