// Feature Permission List Model
module.exports = (sequelize, DataTypes) => {

    const Brands = sequelize.define("brands", {
        brand_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
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
        image_key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_ext: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'brands',
    })

    return Brands
}