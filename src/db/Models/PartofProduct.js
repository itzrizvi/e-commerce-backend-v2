// Part of Product Model

module.exports = (sequelize, DataTypes) => {

    const PartOfProduct = sequelize.define("partof_product", {
        partof_product_uuid: {
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
            allowNull: true
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
            freezeTableName: true,
            tableName: 'partof_product',
        })

    return PartOfProduct
}