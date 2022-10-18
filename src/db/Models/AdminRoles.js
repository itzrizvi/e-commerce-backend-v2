// Admin Roles Model
module.exports = (sequelize, DataTypes) => {

    const AdminRoles = sequelize.define("admin_roles", {
        admin_roles_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        role_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        admin_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'admin_roles',
    })

    return AdminRoles
}