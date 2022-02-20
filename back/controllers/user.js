const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mysql = require('mysql')
const mysql2 = require('mysql2');
const sequelize = require('sequelize');
const cryptoJS = require('crypto-js');
const passwordValidator = require('password-validator');
const db = require('../models/db');

require('dotenv').config({path:'../.env'})

exports.signup = (req, res, next) => {
    const schema = new passwordValidator();
    schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123', 'Motdepasse123']);
    // vérification format du mot de passe
    if(!schema.validate(req.body.password)){res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule, 2 chiffres, pas d'espaces et maximum 100 caractères"});return;}
    // vérification format de l'adresse mail
    if(!/\S+@\S+\.\S+/i.test(req.body.email)){res.status(400).json({ message: "L'adresse mail doit contenir un arobase et un point"});return;}
    // hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // chiffrement de l'adresse mail
        const emailCrypted = cryptoJS.SHA512(req.body.email,process.env.SECRET_EMAIL).toString();
        const user = new User({
          email: emailCrypted,
          password: hash
        });
        // enregistrement dans la BDD
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error, message:'Erreur :\n'+error+'' }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
/*
    const Sequelize = require('sequelize');
    const sequelize = new Sequelize(process.env.DBname,process.env.DBlogin,process.env.DBpassword, {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,// true pour voir les requêtes de l'ORM
    });*/
    // chiffrement adresse mail pour comparaison avec la BDD
    // const emailCrypted = cryptoJS.SHA512(req.body.email,process.env.SECRET_EMAIL).toString();
    const emailCrypted = req.body.email;
    //User.findOne({ email: emailCrypted })
    db.sequelize.query("SELECT id_compte,admin,email,password,nom,avatar FROM compte WHERE email=\'"+emailCrypted+"\' LIMIT 1;")
      .then(([resultat,metadata]) => {
        console.log(resultat);
        if (!resultat) {
          return res.status(401).json({ message: 'Utilisateur non trouvé !' }) 
        }
        // comparaison du mot de passe avec la BDD
        bcrypt.compare(req.body.password, resultat[0].password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            // création du token
            userId: resultat[0].id_compte,
            token: jwt.sign(
              { userId: resultat[0].id_compte },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };