// Order RMA DETAILS model
module.exports = (sequelize, DataTypes) => {

    const OrderRMADetail = sequelize.define("order_rma_detail", {
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
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rma_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rma_receive_qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        restock_percent: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        restock_fee: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        rma_reason_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rma_receive_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rma_comment: {
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
        tableName: 'order_rma_detail'
    });

    return OrderRMADetail
}