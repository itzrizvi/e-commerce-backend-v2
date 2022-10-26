// Product Discount Type Model

module.exports = (sequelize, DataTypes) => {

    const DiscountType = sequelize.define("discount_type", {
        discount_type_uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        customer_group_uuid: {
            type: DataTypes.UUID,
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
            timestamps: true,
            tableName: 'discount_type',
        })

    return DiscountType
}