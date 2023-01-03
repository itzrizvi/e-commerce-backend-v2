// Product Dimension Class Model

module.exports = (sequelize, DataTypes) => {

    const DimensionClass = sequelize.define("dimension_class", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tenant_id: {
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

    },
        {
            timestamps: true,
            tableName: 'dimension_class',
        })

    return DimensionClass
}