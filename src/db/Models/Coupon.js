// Coupon Model
module.exports = (sequelize, DataTypes) => {

    const Coupon = sequelize.define("coupon", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        coupon_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coupon_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coupon_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coupon_type: {
            type: DataTypes.ENUM("flat", "percentage"),
            allowNull: false
        },
        coupon_amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        coupon_maxamount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        coupon_minamount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        coupon_startdate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        coupon_enddate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        coupon_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        coupon_sortorder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return Coupon
}