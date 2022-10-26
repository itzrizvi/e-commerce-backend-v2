// Product Dimension Model

module.exports = (sequelize, DataTypes) => {

    const ProductDimension = sequelize.define("product_dimension", {
        prod_dimension_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        length: {
            type: DataTypes.STRING,
            allowNull: true
        },
        width: {
            type: DataTypes.STRING,
            allowNull: true
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dimension_class: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
            tableName: 'product_dimension',
        })

    return ProductDimension
}