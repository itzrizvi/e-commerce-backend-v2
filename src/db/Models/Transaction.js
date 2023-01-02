// Transaction Detail model
module.exports = (sequelize, DataTypes) => {

    const Transaction = sequelize.define("transaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gateway: {
            type: DataTypes.STRING,
            allowNull: false
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        authorization_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        capture_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        capturedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        refund_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refundedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        metadata: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        provider_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
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
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Transaction
}