// Attribute Model
module.exports = (sequelize, DataTypes) => {

    const Attributes = sequelize.define("attribute", {
        id: {
            type: DataTypes.INTEGER,
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

    return Attributes
}