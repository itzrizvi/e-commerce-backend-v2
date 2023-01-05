// Tax Class model
module.exports = (sequelize, DataTypes) => {

    const TaxClass = sequelize.define("tax_class", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        zip_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tax_amount: {
            type: DataTypes.FLOAT,
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

    return TaxClass
}