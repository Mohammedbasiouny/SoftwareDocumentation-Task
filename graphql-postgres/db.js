// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('books_db', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;