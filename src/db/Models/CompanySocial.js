module.exports = (sequelize, DataTypes) => {
    const CompanySocial = sequelize.define("company_social", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        company_info_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        social: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
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
        }
    }, {
        timestamps: true
    })

    return CompanySocial
}