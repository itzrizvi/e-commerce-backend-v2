// Receiving Product model
module.exports = (sequelize, DataTypes) => {

    const ReceivingProduct = sequelize.define("receiving_product", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("new", "submitted", "partially_received", "partially_closed", "canceled", "received"),
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

    return ReceivingProduct
}