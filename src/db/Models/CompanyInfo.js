// Permission Model
module.exports = (sequelize, DataTypes) => {

    const CompanyInfo = sequelize.define("company_info", {
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
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dark_logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fav_icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contact_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fax: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }

    }, {
        timestamps: true
    })

    return CompanyInfo
}