// Admin Roles Model
module.exports = (sequelize, DataTypes) => {

    const AdminRoles = sequelize.define("admin_role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    }, {
        timestamps: true
    })

    return AdminRoles
}