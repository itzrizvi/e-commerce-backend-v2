// Product Inventory Model

module.exports = (sequelize, DataTypes) => {

    const ProductInventory = sequelize.define("product_inventory", {
        prod_inventory_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        prod_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        prod_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        purchase_order_uuid: {
            type: DataTypes.UUID,
            allowNull: true
        },
        input_type: {
            type: DataTypes.ENUM("purchase", "split"),
            allowNull: false
        },
        parent_prod_uuid: {
            type: DataTypes.UUID,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
            tableName: 'product_inventory',
        })

    return ProductInventory
}