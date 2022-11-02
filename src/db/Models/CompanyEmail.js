module.exports = (sequelize, DataTypes) => {
    const CompanyEmail = sequelize.define("company_email", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        company_info_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
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
        }
    }, {
        timestamps: true
    })

    return CompanyEmail
}