// Email Header and Footer model
module.exports = (sequelize, DataTypes) => {

    const EmailTemplate = sequelize.define("email_template", {
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
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        layout_type: {
            type: DataTypes.ENUM("custom", "dynamic"),
            allowNull: false
        },
        header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        footer_id: {
            type: DataTypes.INTEGER,
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

    return EmailTemplate
}