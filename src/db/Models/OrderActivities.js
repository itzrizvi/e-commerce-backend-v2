// Order Activities model
module.exports = (sequelize, DataTypes) => {

    const OrderActivities = sequelize.define("order_activities", {
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
    });
    OrderActivities.removeAttribute('id');

    return OrderActivities
}