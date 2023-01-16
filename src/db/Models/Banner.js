module.exports = (sequelize, DataTypes) => {

    const Banners = sequelize.define("banner", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        layout_type: {
            type: DataTypes.ENUM("custom", "dynamic"),
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true,
        })

    return Banners
}