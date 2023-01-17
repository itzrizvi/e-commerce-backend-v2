// Order RMA model
module.exports = (sequelize, DataTypes) => {

    const OrderRMA = sequelize.define("order_rma", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        rma_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        handling_fee: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        return_tax: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        refund_shipping: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        rma_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
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
        freezeTableName: true,
        tableName: 'order_rma'
    });

    return OrderRMA
}