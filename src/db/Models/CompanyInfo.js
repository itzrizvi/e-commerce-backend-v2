// Permission Model
module.exports = (sequelize, DataTypes) => {

    const CompanyInfo = sequelize.define("company_info", {
        id: {
            type: DataTypes.BIGINT,
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
            allowNull: false
        },
        contact_address:{
            type: DataTypes.STRING,
            allowNull: false
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: false
        },
        fax:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
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