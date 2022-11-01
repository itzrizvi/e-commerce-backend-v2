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
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sub_total:{
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
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updatedBy: {
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