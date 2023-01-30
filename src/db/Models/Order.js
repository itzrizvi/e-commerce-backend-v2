// Address model
module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define("order", {
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
        payment_id: { // Payment Method ID
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shipping_method_id: { // Shipping Method ID
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sub_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        shipping_cost: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        discount_amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        tax_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        order_status_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        shipping_address_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shipping_account_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tax_exempt: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        po_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order_created_by: {
            type: DataTypes.INTEGER,
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

    return Order
}