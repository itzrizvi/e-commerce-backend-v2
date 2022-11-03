// Product Discount Type Model

module.exports = (sequelize, DataTypes) => {

    const DiscountType = sequelize.define("discount_type", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        prod_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        customer_group_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        discount_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        discount_priority: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        discount_price: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        discount_startdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        discount_enddate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
        {
            timestamps: true
        })

    return DiscountType
}