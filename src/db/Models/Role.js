//user model
module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define("user_roles", {
        uid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'user_roles',
    })

    return Role
}