// Order RMA LOOKUP model
module.exports = (sequelize, DataTypes) => {

    const OrderRMALookup = sequelize.define("order_rma_lookup", {
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        tableName: 'order_rma_lookup'
    });
    // OrderRMALookup.removeAttribute('id');

    return OrderRMALookup
}