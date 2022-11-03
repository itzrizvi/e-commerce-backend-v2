// Part of Product Model

module.exports = (sequelize, DataTypes) => {

    const PartOfProduct = sequelize.define("partof_product", {
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
            allowNull: true
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

    return PartOfProduct
}