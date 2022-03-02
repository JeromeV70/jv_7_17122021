const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet')
const path = require('path');
require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DBname,process.env.DBlogin,process.env.DBpassword, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,// true pour voir les requêtes de l'ORM
});

var exports = module.exports = {};
exports.sequelize = sequelize;

try {
  sequelize.authenticate();
  console.log('Connecté à la base de données MySQL!');
} catch (error) {
  console.error('Impossible de se connecter, erreur suivante :', error);
}

const forumRoutes = require('./routes/forum');
const userRoutes = require('./routes/user');
const profilRoutes = require('./routes/profil');

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/api/forum', forumRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/profil', profilRoutes);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

module.exports = app;