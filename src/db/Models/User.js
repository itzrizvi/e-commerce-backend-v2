const Role = require("./Role")

//user model
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("users", {
        uid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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
            allowNull: false
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        verification_code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        forgot_password_code: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        role_no: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'users',
    })


    return User
}