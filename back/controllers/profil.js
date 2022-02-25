const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mysql = require('mysql')
const mysql2 = require('mysql2');
const sequelize = require('sequelize');
const cryptoJS = require('crypto-js');
const passwordValidator = require('password-validator');
const crypto = require('crypto');
const db = require('../models/db');

require('dotenv').config({path:'../.env'})

exports.acces = (req, res, next) => {

  // on va chercher les informations du compte
  db.sequelize.query("SELECT id_compte, admin, nom, email, avatar FROM compte WHERE id_compte="+req.auth.userId+";")
  .then(([resultat,metadata]) => {
    if(!resultat) {
      return res.status(401).json({ message: 'erreur bdd'})
    }

    //clés de chiffrement, longueurs 32 octets et 16 octets, pour aes256
    const key = crypto.scryptSync(process.env.TOKEN, '@salt', 32);
    const iv = Buffer.alloc(16,42);

    // création de l'objet de déchiffrement
    const decipher = crypto.createDecipheriv('aes256', key, iv);

    // déchiffrement de l'email
    resultat[0].email = decipher.update(resultat[0].email,'hex','utf8');
    resultat[0].email += decipher.final('utf8');

    // renvoyer les infos du compte
    res.status(200).json({ 
      id: resultat[0].id_compte,
      admin: resultat[0].admin,
      nom: resultat[0].nom,
      email: resultat[0].email,
      avatar: resultat[0].avatar,
    })
  })
  .catch(error => res.status(500).json({ error }));
};
