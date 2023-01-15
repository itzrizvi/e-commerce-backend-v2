// PO TRK DETAILS model
module.exports = (sequelize, DataTypes) => {

    const POTRKDetails = sequelize.define("po_trk_details", {
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tracking_no: {
            type: DataTypes.STRING,
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
        timestamps: true,
    });
    POTRKDetails.removeAttribute('id');

    return POTRKDetails
}