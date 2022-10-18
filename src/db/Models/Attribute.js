// Attribute Model
module.exports = (sequelize, DataTypes) => {

    const Attributes = sequelize.define("attributes", {
        attribute_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        attribute_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attribute_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attribute_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        attr_group_uuid: {
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
        tableName: 'attributes',
    })

    return Attributes
}