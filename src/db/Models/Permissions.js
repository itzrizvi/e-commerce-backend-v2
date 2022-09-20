// Feature Permission List Model
module.exports = (sequelize, DataTypes) => {

    const Permissions = sequelize.define("permissions_data", {
        permission_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        permissions_list: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_no: {
            type: DataTypes.BIGINT,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'permissions_data',
    })

    return Permissions
}