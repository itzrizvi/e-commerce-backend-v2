// PO MFG DOC model
module.exports = (sequelize, DataTypes) => {

    const POMFGDOC = sequelize.define("po_mfg_doc", {
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
        freezeTableName: true,
        tableName: 'po_mfg_doc'
    });
    POMFGDOC.removeAttribute('id');

    return POMFGDOC
}