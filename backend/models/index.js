const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/aicsa', {
  dialect: 'postgres',
  logging: false,
});

module.exports = { sequelize, Sequelize };
