// Product Model
module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("products", {
        prod_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        prod_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        prod_slug: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        prod_long_desc: {
            type: DataTypes.JSON,
            allowNull: false
        },
        prod_short_desc: {
            type: DataTypes.JSON,
            allowNull: false
        },
        prod_meta_title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prod_meta_desc: {
            type: DataTypes.JSON,
            allowNull: true
        },
        prod_meta_keywords: {
            type: DataTypes.JSON,
            allowNull: true
        },
        prod_tags: {
            type: DataTypes.JSON,
            allowNull: true
        },
        prod_category: {
            type: DataTypes.UUID,
            allowNull: false
        },
        prod_regular_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        prod_sale_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        discount_type_uuid: {
            type: DataTypes.UUID,
            allowNull: true
        },
        brand_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        prod_model: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prod_sku: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dimension_uuid: {
            type: DataTypes.UUID,
            allowNull: true
        },
        prod_weight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prod_weight_class: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prod_outofstock_status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Out Of Stock"
        },
        prod_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        prod_thumbnail: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'products',
    })

    return Product
}