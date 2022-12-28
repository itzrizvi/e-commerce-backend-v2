module.exports = (sequelize, DataTypes) => {

    const State = sequelize.define("state", {
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        abbreviation: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    })

    return State
}