// Product Serial model
module.exports = (sequelize, DataTypes) => {

    const ProductSerial = sequelize.define("product_serial", {
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
        serial: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rec_prod_id: {
            type: DataTypes.INTEGER,
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

    return ProductSerial
}