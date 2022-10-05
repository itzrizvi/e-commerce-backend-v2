// Feature Permission List Model
module.exports = (sequelize, DataTypes) => {

    const FeaturePermissionList = sequelize.define("feature_permission_list", {
        feature_permission_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        feature_permission_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        feature_permission_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        feature_permission_status: {
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
        tableName: 'feature_permission_list',
    })

    return FeaturePermissionList
}