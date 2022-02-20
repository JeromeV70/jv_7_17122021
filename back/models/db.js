const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DBname,process.env.DBlogin,process.env.DBpassword, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,// true pour voir les requêtes de l'ORM
});

var exports = module.exports = {};
exports.sequelize = sequelize;