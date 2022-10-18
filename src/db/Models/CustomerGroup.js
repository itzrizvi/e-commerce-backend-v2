// Customer Group Model
module.exports = (sequelize, DataTypes) => {

    const CustomerGroup = sequelize.define("customer_groups", {
        customer_group_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        customer_group_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_group_slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customergroup_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customergroup_sortorder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customergroup_status: {
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
        tableName: 'customer_groups',
    })

    return CustomerGroup
}