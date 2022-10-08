// Feature Permission List Model
module.exports = (sequelize, DataTypes) => {

    const Permissions = sequelize.define("permissions_data", {
        permission_data_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        permission_uuid: {
            type: DataTypes.UUID,
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
        role_uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        role_no: {
            type: DataTypes.BIGINT,
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