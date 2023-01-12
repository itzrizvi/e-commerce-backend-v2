// Purchase View Record model
module.exports = (sequelize, DataTypes) => {

    const POViewRecords = sequelize.define("poview_record", {
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
        po_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "not-viewed"
        },
        client_info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        client_ip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_viewed_at: {
            type: DataTypes.DATE,
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
        timestamps: true
    })

    return POViewRecords
}