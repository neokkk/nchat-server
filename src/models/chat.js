module.exports = (sequelize, DataTypes) => (
    sequelize.define('chat', {
        message: {
            type: DataTypes.STRING(),
            allowNull: true,
        }
    }, {
        timestamps: true,
    })
)