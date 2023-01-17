// Order RMA R DETAILS model
module.exports = (sequelize, DataTypes) => {

    const OrderRMARDetail = sequelize.define("order_rma_r_detail", {
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
        rma_replace_qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rma_replace_cost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        rma_replace_discount: {
            type: DataTypes.FLOAT,
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
        tableName: 'order_rma_r_detail'
    });

    return OrderRMARDetail
}