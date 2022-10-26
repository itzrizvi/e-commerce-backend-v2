// Brand Categories Model
module.exports = (sequelize, DataTypes) => {

    const BrandCategories = sequelize.define("brand_categories", {
        brand_categories_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        brand_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        cat_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        tableName: 'brand_categories',
    })

    return BrandCategories
}