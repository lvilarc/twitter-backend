const DataTypes = require("sequelize");
const sequelize = require("../config/sequelize");

const Tweet = sequelize.define('Tweet', {

    text: {
        type: DataTypes.STRING,
        // allowNull: false
    },

    tweetPhoto: {
        type: DataTypes.STRING,
    },

    timeElapsed: { 
        type: DataTypes.STRING 
    },

},
    {
        timestamps: true,
        paranoid: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'Tweet'
    });

Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' });
}

module.exports = Tweet;
