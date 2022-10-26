module.exports = (sequelize, DataTypes) => {

    const Banners = sequelize.define("banners", {
        banner_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        banner_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        banner_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        banner_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
            tableName: 'banners',
        })

    return Banners
}