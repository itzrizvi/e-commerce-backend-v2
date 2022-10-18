// Roles Permission Model
module.exports = (sequelize, DataTypes) => {

    const RolesPermission = sequelize.define("roles_permission", {
        roles_permission_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
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
        timestamps: true,
        freezeTableName: true,
        tableName: 'roles_permission',
    })

    return RolesPermission
}