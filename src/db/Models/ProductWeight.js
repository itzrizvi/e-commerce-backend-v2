// Product Weigth Model

module.exports = (sequelize, DataTypes) => {

    const ProductWeight = sequelize.define("product_weight", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        weight_class_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    },
        {
            timestamps: true,
            tableName: 'product_weight',
        })

    return ProductWeight
}