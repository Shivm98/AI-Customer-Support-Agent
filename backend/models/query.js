const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Query = sequelize.define('Query', {
  question: DataTypes.TEXT,
  sentiment: DataTypes.STRING,
});

module.exports = Query;
