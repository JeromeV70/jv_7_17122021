const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DBname,process.env.DBlogin,process.env.DBpassword, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,// true pour voir les requêtes de l'ORM
});

const exports = module.exports = {};
exports.sequelize = sequelize;

//const mongoose = require('mongoose');
const path = require('path');
//const helmet = require('helmet');
require('dotenv').config()

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
//const { Sequelize } = require('sequelize');

//mongoose.connect(process.env.DBconnect,
//  { useNewUrlParser: true,
//    useUnifiedTopology: true })
//  .then(() => console.log('Connexion à MongoDB réussie !'))
//  .catch(() => console.log('Connexion à MongoDB échouée !'));

//app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;