// PO Invoices model
module.exports = (sequelize, DataTypes) => {

    const POInvoices = sequelize.define("po_invoices", {
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        invoice_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        invoice_path: {
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
    POInvoices.removeAttribute('id');

    return POInvoices
}