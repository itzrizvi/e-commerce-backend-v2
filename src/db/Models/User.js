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
            unique: true,
            isEmail: true, //checks for email format
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        verification_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'users',
    })

    return User
}