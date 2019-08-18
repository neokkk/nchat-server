module.exports = (sequelize, DataTypes) => (
    sequelize.define('room', {
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        subname: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        host: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        limit: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            defaultValue: 2,
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: true,
        }
    }, {
        timestamps: true,
    })
)