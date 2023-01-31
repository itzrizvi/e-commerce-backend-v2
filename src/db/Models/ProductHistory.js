// Product History model
module.exports = (sequelize, DataTypes) => {

    const ProductHistory = sequelize.define("product_history", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        source: {
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
        freezeTableName: true,
        tableName: 'product_history'
    });
    ProductHistory.removeAttribute('id');

    return ProductHistory
}