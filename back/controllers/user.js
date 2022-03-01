const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mysql = require('mysql')
const mysql2 = require('mysql2');
const sequelize = require('sequelize');
const passwordValidator = require('password-validator');
const crypto = require('crypto');
const db = require('../models/db');
const { DATE } = require('sequelize');

require('dotenv').config({path:'../.env'})

exports.signup = (req, res, next) => {
    const schema = new passwordValidator();
    schema
    .is().min(10)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits();
    // vérification format du mot de passe
    if(!schema.validate(req.body.password)){res.status(400).json({ error: "erreur password"});return;}
    // vérification format de l'adresse mail
    if((!/\S+@\S+\.\S+/i.test(req.body.email)) || (req.body.email.lenght > 50) || (req.body.email.lenght <2)){res.status(400).json({ error: "erreur email"});return;}
    // vérification du nom
    if ((req.body.nom.lenght > 30) || (req.body.nom.lenght < 2)){res.status(400).json({ error: "erreur nom"});return;}
    // hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //clés de chiffrement, longueurs 32 octets et 16 octets, pour aes256
      const key = crypto.scryptSync(process.env.TOKEN, '@salt', 32);
      const iv = Buffer.alloc(16,42);

      // création de l'objet de chiffrement
      const cipher = crypto.createCipheriv('aes256', key, iv);

      // chiffrement de l'email
      let crypted = cipher.update(req.body.email,'utf8','hex');
      crypted += cipher.final('hex');

      // enregistrement du compte
      const date = Date.now();
      db.sequelize.query("INSERT INTO compte VALUES (default,'0',\'"+crypted+"\',\'"+hash+"\',\'"+req.body.nom+"\','0',\'"+date+"\',\'"+req.ip+"\');")
      .then(([resultat,metadata]) => {
        console.log(resultat);
        // on récupère l'identifiant du compte créé
        db.sequelize.query("SELECT id_compte FROM compte WHERE email=\'"+crypted+"\';")
        .then(([resultat,metadata]) => {
          res.status(200).json({
            // création du token
            id: resultat[0].id_compte,
            admin:0,
            nom: req.body.nom,
            email: req.body.email,
            avatar:0,
            token: 'Bearer '+jwt.sign(
              { userId: resultat[0].id_compte, admin:0 },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    // vérification sécurité
    if((req.body.email.length > 50) || (req.body.password.lenght > 100)) {
      res.status(400).json({ erreur:'Données non conformes' })
    }

    //clés de chiffrement, longueurs 32 octets et 16 octets, pour aes256
    let key = crypto.scryptSync(process.env.TOKEN, '@salt', 32);
    let iv = Buffer.alloc(16,42);

    // création de l'objet de chiffrement
    const cipher = crypto.createCipheriv('aes256', key, iv);

    // chiffrement de l'email
    let crypted = cipher.update(req.body.email,'utf8','hex');
    crypted += cipher.final('hex');

    db.sequelize.query("SELECT id_compte,admin,email,password,nom,avatar FROM compte WHERE email=\'"+crypted+"\' LIMIT 1;")
      .then(([resultat,metadata]) => {
        if ((!resultat)||(resultat == null)) {
          return res.status(401).json({ message: 'Utilisateur non trouvé !' }) 
        }
        // comparaison du mot de passe avec la BDD
        bcrypt.compare(req.body.password, resultat[0].password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          const date = Date.now();
          // enregistrement de la connexion
          db.sequelize.query("INSERT INTO connexions (id_compte, ip, date) VALUES (\'"+resultat[0].id_compte+"\', \'"+req.ip+"\', \'"+date+"\');")
          // renvoi de l'email non chiffré
          resultat[0].email = req.body.email;

          res.status(200).json({
            // création du token
            id: resultat[0].id_compte,
            admin: resultat[0].admin,
            nom: resultat[0].nom,
            email: resultat[0].email,
            avatar: resultat[0].avatar,
            token: 'Bearer '+jwt.sign(
              { userId: resultat[0].id_compte, admin: resultat[0].admin },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };