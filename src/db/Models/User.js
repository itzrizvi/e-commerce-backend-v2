// User model
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            isEmail: true, //checks for email format
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        verification_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        forgot_password_code: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        has_role: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        user_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }

    }, {
        timestamps: true
    })


    return User
}