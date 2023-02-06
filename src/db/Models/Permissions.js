// Permission Model
module.exports = (sequelize, DataTypes) => {

    const Permissions = sequelize.define("permissions_data", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        edit_access: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        read_access: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Permissions
}