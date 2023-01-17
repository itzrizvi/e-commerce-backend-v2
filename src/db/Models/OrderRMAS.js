// Order RMA S model
module.exports = (sequelize, DataTypes) => {

    const OrderRMAS = sequelize.define("order_rma_s", {
        line_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        rma_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shipping_in_out: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        shipping_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        return_tracking_out: {
            type: DataTypes.STRING,
            allowNull: true
        },
        return_tracking_in: {
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
        freezeTableName: true,
        tableName: 'order_rma_s'
    });

    return OrderRMAS
}