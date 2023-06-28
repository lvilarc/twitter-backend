const DataTypes = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define('User', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Esse email já foi cadastrado'
        }
    },

    photo: {
        type: DataTypes.STRING,
    },

    hash: {
        type: DataTypes.STRING
    },

    salt: {
        type: DataTypes.STRING
    },

    token: {
        type: DataTypes.STRING(1234)
    },

    

},
    {
        timestamps: true,
        paranoid: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'User'
    });

User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' });
}

module.exports = User;
