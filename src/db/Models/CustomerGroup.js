// Customer Group Model
module.exports = (sequelize, DataTypes) => {

    const CustomerGroup = sequelize.define("customer_group", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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
            allowNull: true
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
        timestamps: true
    })

    return CustomerGroup
}