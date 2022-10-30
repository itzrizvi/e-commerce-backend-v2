// Brand Categories Model
module.exports = (sequelize, DataTypes) => {

    const BrandCategories = sequelize.define("brand_category", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        brand_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        cat_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return BrandCategories
}