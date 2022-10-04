// Feature Permission List Model
module.exports = (sequelize, DataTypes) => {

    const Permissions = sequelize.define("permissions_data", {
        permission_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        permission_list_uuid: {
            type: DataTypes.JSON,
            allowNull: false
        },
        role_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        role_no: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        role_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'permissions_data',
    })

    return Permissions
}