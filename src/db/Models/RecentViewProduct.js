// Permission Model
module.exports = (sequelize, DataTypes) => {

    const RecentViewProduct = sequelize.define("recent_view_product", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        user_ip:{
            type: DataTypes.STRING,
            allowNull: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return RecentViewProduct
}