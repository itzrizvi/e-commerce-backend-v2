// PO Invoices model
module.exports = (sequelize, DataTypes) => {

    const POInvoices = sequelize.define("po_invoices", {
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
        invoice_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        invoice_file: {
            type: DataTypes.STRING,
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
        timestamps: true,
    });

    return POInvoices
}