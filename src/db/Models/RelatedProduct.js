// Related Product Model
module.exports = (sequelize, DataTypes) => {

    const RelatedProduct = sequelize.define("related_product", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        base_prod_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        prod_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true
        })

    return RelatedProduct
}