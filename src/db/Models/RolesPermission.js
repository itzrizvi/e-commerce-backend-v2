// Roles Permission Model
module.exports = (sequelize, DataTypes) => {

    const RolesPermission = sequelize.define("roles_permission", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        roles_permission_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roles_permission_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roles_permission_status: {
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

    return RolesPermission
}