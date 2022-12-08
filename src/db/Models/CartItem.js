// Address model
module.exports = (sequelize, DataTypes) => {

    const CartItem = sequelize.define("cart_item", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        cart_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        prod_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        promo_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        promo_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
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

    return CartItem
}