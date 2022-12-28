// Product Model
module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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
            type: DataTypes.INTEGER,
            allowNull: true
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
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        prod_partnum: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prod_sku: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dimension_id: {
            type: DataTypes.BIGINT,
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
        is_featured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_sale: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        is_serial: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        taxable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        prod_condition: {
            type: DataTypes.STRING,
            allowNull: true
        },
        extended_warranty: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        extended_warranty_value: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hs_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_rank: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mfg_build_part_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_rep: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        prod_thumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        added_by: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Product
}