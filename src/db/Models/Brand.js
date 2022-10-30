// Brand Model
module.exports = (sequelize, DataTypes) => {

    const Brands = sequelize.define("brand", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        brand_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        brand_sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Brands
}