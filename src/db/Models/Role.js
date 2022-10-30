// Role model
module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define("role", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        role_no: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Role
}