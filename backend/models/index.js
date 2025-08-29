const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  logging: false,
});

module.exports = { sequelize, Sequelize };
