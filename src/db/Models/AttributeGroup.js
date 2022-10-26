// Attribute Group Model
module.exports = (sequelize, DataTypes) => {

    const AttrGroup = sequelize.define("attr_groups", {
        attr_group_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        attr_group_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attr_group_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attrgroup_sortorder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attrgroup_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        tableName: 'attr_groups',
    })

    return AttrGroup
}