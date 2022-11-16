// Purchase Order Setting model
module.exports = (sequelize, DataTypes) => {

    const POSetting = sequelize.define("po_setting", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        po_prefix: {
            type: DataTypes.STRING,
            allowNull: false
        },
        po_startfrom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000
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

    return POSetting
}