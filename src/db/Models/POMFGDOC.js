// PO MFG DOC model
module.exports = (sequelize, DataTypes) => {

    const POMFGDOC = sequelize.define("po_mfg_doc", {
        po_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        doc_path: {
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
    POMFGDOC.removeAttribute('id');

    return POMFGDOC
}