// Attribute Model
module.exports = (sequelize, DataTypes) => {

    const Attributes = sequelize.define("attribute", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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
        attr_group_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Attributes
}