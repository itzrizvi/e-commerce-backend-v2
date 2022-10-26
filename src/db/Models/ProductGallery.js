// Product Gallery Model

module.exports = (sequelize, DataTypes) => {

    const ProductGallery = sequelize.define("product_gallery", {
        prod_gallery_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        prod_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        prod_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
            tableName: 'product_gallery',
        })

    return ProductGallery
}