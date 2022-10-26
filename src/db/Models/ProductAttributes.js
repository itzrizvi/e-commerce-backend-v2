// Product Attributes Model
module.exports = (sequelize, DataTypes) => {

    const ProductAttributes = sequelize.define("product_attributes", {
        prod_attr_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        prod_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        attr_group_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        attribute_uuid: {
            type: DataTypes.UUID,
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
        timestamps: true,
        tableName: 'product_attributes',
    })

    return ProductAttributes
}