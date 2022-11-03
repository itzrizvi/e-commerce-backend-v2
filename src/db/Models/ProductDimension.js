// Product Dimension Model

module.exports = (sequelize, DataTypes) => {

    const ProductDimension = sequelize.define("product_dimension", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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