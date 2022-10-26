// Related Product Model
module.exports = (sequelize, DataTypes) => {

    const RelatedProduct = sequelize.define("related_product", {
        related_prod_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        base_prod_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        prod_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
            tableName: 'related_product',
        })

    return RelatedProduct
}