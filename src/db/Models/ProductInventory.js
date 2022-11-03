// Product Inventory Model

module.exports = (sequelize, DataTypes) => {

    const ProductInventory = sequelize.define("product_inventory", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        prod_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        prod_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        purchase_order_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        input_type: {
            type: DataTypes.ENUM("purchase", "split"),
            allowNull: false
        },
        parent_prod_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true
        })

    return ProductInventory
}