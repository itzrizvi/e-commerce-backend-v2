// PO Activities model
module.exports = (sequelize, DataTypes) => {

    const POVendorViewLinks = sequelize.define("po_vendor_view_links", {
        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            primaryKey: true
        },
        expire_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        viewer_info: {
            type: DataTypes.JSON,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
    });
    POVendorViewLinks.removeAttribute('id');

    return POVendorViewLinks
}