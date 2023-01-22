// PO Activities model
module.exports = (sequelize, DataTypes) => {

    const POActivities = sequelize.define("po_activities", {
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING,
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
    POActivities.removeAttribute('id');

    return POActivities
}