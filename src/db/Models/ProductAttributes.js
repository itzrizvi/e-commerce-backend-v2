// Product Attributes Model
module.exports = (sequelize, DataTypes) => {

    const ProductAttributes = sequelize.define("product_attribute", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        prod_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        attr_group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attribute_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attribute_type: {
            type: DataTypes.ENUM("text", "file", "link", "none"),
            allowNull: false
        },
        attribute_value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return ProductAttributes
}