// Product Model
module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("products", {
        product_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        product_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_slug: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_description: {
            type: DataTypes.JSON,
            allowNull: false
        },
        product_meta_tag_title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_meta_tag_description: {
            type: DataTypes.JSON,
            allowNull: true
        },
        product_meta_tag_keywords: {
            type: DataTypes.JSON,
            allowNull: true
        },
        product_tags: {
            type: DataTypes.JSON,
            allowNull: true
        },
        product_image: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        product_image_gallery: {
            type: DataTypes.JSON,
            allowNull: true
        },
        product_sku: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_regular_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        product_sale_price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        product_tax_included: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true
        },
        product_stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        product_minimum_stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        product_maximum_orders: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        product_stock_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_available_from: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_category: {
            type: DataTypes.UUID,
            allowNull: false
        },
        product_barcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        added_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'products',
    })

    return Product
}