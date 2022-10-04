//user model
module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define("roles", {
        role_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
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
        role_status: {
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
        tableName: 'roles',
    })

    return Role
}