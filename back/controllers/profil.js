const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const passwordValidator = require('password-validator');
const crypto = require('crypto');
const db = require('../models/db');
const webp = require('webp-converter');

require('dotenv').config({path:'../.env'})

exports.InfosProfil = (req, res, next) => {

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

exports.SupprimerCompte = (req, res, next) => {
  // Vérification sécurité
  const id_compte = Number(req.body.id_compte);

  // Seul l'admin ou le client peut supprimer son compte, l'admin ne pas supprimer son propre compte
  if (((req.auth.admin != 1) && (id_compte != req.auth.userId)) || (id_compte == 1)){
    res.status(401).json({ message: 'Non authorisé' });
  }
    else {
      // On récupère l'identifiant d'article de chaque commentaire du compte
      db.sequelize.query("SELECT id_article FROM commentaire WHERE id_compte = "+id_compte+";")
      .then(([resultat,metadata]) => {
        for (element of resultat){
          // On met à jour le compteur commentaire des articles commentés
          db.sequelize.query("UPDATE article SET commentaire=commentaire-1 WHERE id_article = "+element.id_article+";")
          .then(([resultat,metadata]) => { })
          .catch(error => res.status(500).json({ error }));
        }
          // On récupère l'identifiant d'article de chaque upvote
          db.sequelize.query("SELECT id_article FROM vote_article WHERE id_compte = "+id_compte+" AND vote = 1;")
          .then(([resultat,metadata]) => {
            for (element of resultat){
              // On met à jour le compteur upvote des articles concernés
              db.sequelize.query("UPDATE article SET upvote=upvote-1 WHERE id_article = "+element.id_article+";")
              .then(([resultat,metadata]) => { })
              .catch(error => res.status(500).json({ error }));
            }
              // On récupère l'identifiant d'article de chaque downvote
              db.sequelize.query("SELECT id_article FROM vote_article WHERE id_compte = "+id_compte+" AND vote = 0;")
              .then(([resultat,metadata]) => {
                for (element of resultat){
                  // On met à jour le compteur downvote des articles concernés
                  db.sequelize.query("UPDATE article SET downvote=downvote-1 WHERE id_article = "+element.id_article+";")
                  .then(([resultat,metadata]) => { })
                  .catch(error => res.status(500).json({ error }));
                }
                  // On récupère l'identifiant du commentaire de chaque upvote
                  db.sequelize.query("SELECT id_commentaire FROM vote_commentaire WHERE id_compte = "+id_compte+" AND vote = 1;")
                  .then(([resultat,metadata]) => {
                    for (element of resultat){
                      // On met à jour le compteur upvote des commentaires concernés
                      db.sequelize.query("UPDATE commentaire SET upvote=upvote-1 WHERE id_commentaire = "+element.id_commentaire+";")
                      .then(([resultat,metadata]) => { })
                      .catch(error => res.status(500).json({ error }));
                    }
                      // On récupère l'identifiant du commentaire de chaque downvote
                      db.sequelize.query("SELECT id_commentaire FROM vote_commentaire WHERE id_compte = "+id_compte+" AND vote = 0;")
                      .then(([resultat,metadata]) => {
                        for (element of resultat){
                          // On met à jour le compteur downvote des commentaires concernés
                          db.sequelize.query("UPDATE commentaire SET downvote=downvote-1 WHERE id_commentaire = "+element.id_commentaire+";")
                          .then(([resultat,metadata]) => { })
                          .catch(error => res.status(500).json({ error }));
                        }

                          // Suppression de l'avatar
                          if (fs.existsSync('./images/'+id_compte+'.webp')) {
                            fs.unlink('./images/'+id_compte+'.webp', (error) => {if (error) throw error;});
                          }

                          // Suppression des images des articles
                          db.sequelize.query("SELECT image FROM article WHERE id_compte = "+id_compte+";")
                          .then(([resultat,metadata]) => {
                            for (element of resultat) {
                              if (element.image != '') {
                                fs.unlink('./images/'+element.image+'.webp', (error) => {if (error) throw error;});
                              }
                            }
                          })

                          // Suppression du compte et des documents avec DELETE ON CASCADE
                          db.sequelize.query("DELETE FROM compte WHERE id_compte = "+id_compte+";")
                          .then(([resultat,metadata]) => {
                            res.status(200).json({ message: 'Compte supprimé' });
                          })
                          .catch(error => res.status(500).json({ error }));
                      })
                      .catch(error => res.status(500).json({ error }));
                  })
                  .catch(error => res.status(500).json({ error }));
              })
              .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
};

exports.ModifierProfil = (req, res, next) => {

  console.table(req.body);

  // On récupère les informations du compte
  db.sequelize.query("SELECT email, password, nom, avatar FROM compte WHERE id_compte = "+req.auth.userId+";")
  .then(([resultat,metadata]) => {

    // Configuration des variables pour la requête finale
    let email = resultat[0].email;
    let password = resultat[0].password;
    let nom = resultat[0].nom;
    let avatar = resultat[0].avatar;

    // Si modification de l'email
    if (req.body.email != '') {
      // vérification format de l'adresse mail
      if((!/\S+@\S+\.\S+/i.test(req.body.email)) || (req.body.email.lenght > 50) || (req.body.email.lenght <2)) {
        res.status(400).json({ error: "erreur email"});
        return;
      }

      //clés de chiffrement, longueurs 32 octets et 16 octets, pour aes256
      const key = crypto.scryptSync(process.env.TOKEN, '@salt', 32);
      const iv = Buffer.alloc(16,42);

      // création de l'objet de chiffrement
      const cipher = crypto.createCipheriv('aes256', key, iv);

      // chiffrement de l'email
      let crypted = cipher.update(req.body.email,'utf8','hex');
      crypted += cipher.final('hex');

      // prépartion de la requête
      email = crypted;
    }

    // Si modification du password
    if (req.body.password != '') {
      const schema = new passwordValidator();
      schema
      .is().min(10)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits();

      // vérification format du mot de passe
      if(!schema.validate(req.body.password)) {
        res.status(400).json({ error: "erreur password"});
        return;
      }

      // hashage du mot de passe
      password = bcrypt.hashSync(req.body.password, 10)
    }

    // Si modification du nom
    if (req.body.nom != ''){
      // vérification du nom
      if ((req.body.nom.lenght > 30) || (req.body.nom.lenght < 2)) {
        res.status(400).json({ error: "erreur nom"});
        return;
      }
        // prépartion de la requête
        nom = req.body.nom;
    }
    
    // Si suppression de l'avatar
    if ((req.body.modifier_avatar == 1) && (!req.file)) {
        // On supprime l'image de l'avatar
        fs.unlink('./images/'+req.auth.userId+'.webp', (error) => {if (error) throw error;});
        // prépartion de la requête
        avatar = 0;
    }

    // Si modification de l'avatar
    if ((req.body.modifier_avatar == 1) && (req.file)) {
        // On supprime l'ancienne image de l'avatar si elle existe
        if (fs.existsSync('./images/'+req.auth.userId+'.webp')) {
          fs.unlink('./images/'+req.auth.userId+'.webp', (error) => {if (error) throw error;});
        }

        // Pour convertir l'image avec webp, on donne les droits en écriture
        webp.grant_permission();

        // on récupère l'extention de l'image
        const extention = req.file.mimetype.split('/')[1];

        // on converti en webp selon l'extention, et modification du nom de l'avatar
        if (extention == "gif") {
          webp.gwebp('./images/'+req.file.filename,'./images/'+req.auth.userId+'.webp',"-q 80",logging="-v")
          .then(()=>{
            fs.unlink('./images/'+req.file.filename, (error) => {if (error) throw error;});
          })
          .catch(error => res.status(500).json({ error }));
        }

        if ((extention == "jpg") || (extention == "jpeg") || (extention == "png")) {
          webp.cwebp('./images/'+req.file.filename,'./images/'+req.auth.userId+'.webp',"-q 80",logging="-v")
          .then(()=>{
            fs.unlink('./images/'+req.file.filename, (error) => {if (error) throw error;});
          })
          .catch(error => res.status(500).json({ error }));
        }

        // si webp, on ajoute simplement l'extention, et on modifie le nom de l'avatar
        if (extention == "webp") {
          fs.rename('./images/'+req.file.filename,'./images/'+req.auth.userId+'.webp',(error) => {if (error) throw error;})
        }

        // prépartion de la requête
        avatar = 1;
    }

    // requête de mise à jour
    db.sequelize.query("UPDATE compte SET email = \'"+email+"\', password = \'"+password+"\', nom = \'"+nom+"\', avatar = "+avatar+" WHERE id_compte = "+req.auth.userId+";")
    .then(([resultat,metadata]) => {
        // On récupère les infos du compte mis à jour
        db.sequelize.query("SELECT id_compte, admin, email, nom, avatar FROM compte WHERE id_compte = "+req.auth.userId+";")
        .then(([resultat,metadata]) => {

          //clés de chiffrement, longueurs 32 octets et 16 octets, pour aes256
          const key = crypto.scryptSync(process.env.TOKEN, '@salt', 32);
          const iv = Buffer.alloc(16,42);
          
          // création de l'objet de déchiffrement
          const decipher = crypto.createDecipheriv('aes256', key, iv);
          
          // déchiffrement
          let decrypted = decipher.update(resultat[0].email,'hex','utf8');
          decrypted += decipher.final('utf8');

          // retarder pour laisser le temps de convertir l'image si besoin
          const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
          sleep(1000).then(()=>{
            res.status(200).json({
              id: resultat[0].id_compte,
              admin:resultat[0].admin,
              nom: resultat[0].nom,
              email: decrypted,
              avatar:resultat[0].avatar,
              message:'Modifications validées'
            });
          })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  })
}
