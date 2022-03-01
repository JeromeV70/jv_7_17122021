const fs = require('fs');
const db = require('../models/db');
const { query } = require('express');
const webp = require('webp-converter');

exports.Vote = (req, res, next) => {
  if (!Number.isInteger(req.body.id_document + req.body.type + req.body.direction)) {
    return res.status(401).json({ message: 'erreur type de données'})
  }
  // Vérification du type de document
  let type = '';
  let nouveau_vote = '';
  if (req.body.type == 0) {
    type = 'article';
  }
    else {
      type = 'commentaire';
    }

  // Récupération du vote s'il existe. COUNT() pour éviter erreur si résultat vide.
  db.sequelize.query("SELECT COUNT(id_"+type+"), vote FROM vote_"+type+" WHERE id_compte="+req.auth.userId+" AND id_"+type+"="+req.body.id_document+";")
  .then(([vote,metadata]) => {
    if(!vote) {
      return res.status(401).json({ message: 'erreur bdd'})
    }
    // annuler downvote
    if ((vote[0].vote == 0) && (req.body.direction == 0)) {
      db.sequelize.query("DELETE FROM vote_"+type+" WHERE id_compte="+req.auth.userId+" AND id_"+type+"="+req.body.id_document+";")
      .then(([resultat,metadata]) => {
        console.log('annuler downvote 1');
        // mettre à jour le compteur de downvote sur le document
        db.sequelize.query("UPDATE "+type+" SET downvote=downvote-1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          console.log('annuler downvote 2');
          res.status(200).json({})
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
    
    // annuler upvote
    if ((vote[0].vote == 1) && (req.body.direction == 1)) {
      db.sequelize.query("DELETE FROM vote_"+type+" WHERE id_compte="+req.auth.userId+" AND id_"+type+"="+req.body.id_document+";")
      .then(([resultat,metadata]) => {
        console.log('annuler upvote 1');
        // mettre à jour le compteur de upvote sur le document
        db.sequelize.query("UPDATE "+type+" SET upvote=upvote-1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          res.status(200).json({})
          console.log('annuler upvote 2');
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    // transformer downvote en upvote
    if ((vote[0].vote == 0) && (req.body.direction == 1)) {
      db.sequelize.query("UPDATE vote_"+type+" SET vote=1 WHERE id_compte="+req.auth.userId+" AND id_"+type+"="+req.body.id_document+";")
      .then(([resultat,metadata]) => {
        console.log('transformer downvote en upvote 1');
        // mettre à jour les compteurs upvote et downvote sur le document
        db.sequelize.query("UPDATE "+type+" SET downvote=downvote-1, upvote=upvote+1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          console.log('transformer downvote en upvote 2');
          res.status(200).json({})
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    // transformer upvote en downvote
    if ((vote[0].vote == 1) && (req.body.direction == 0)) {
      db.sequelize.query("UPDATE vote_"+type+" SET vote=0 WHERE id_compte="+req.auth.userId+" AND id_"+type+"="+req.body.id_document+";")
      .then(([resultat,metadata]) => {
        console.log('transformer upvote en downvote 1');
        // mettre à jour les compteurs upvote et downvote sur le document
        db.sequelize.query("UPDATE "+type+" SET downvote=downvote+1, upvote=upvote-1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          console.log('transformer upvote en downvote 2');
          res.status(200).json({})
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    // ajouter un updown sans antécédent
    if ((vote[0].vote == null) && (req.body.direction == 1)) {
      db.sequelize.query("INSERT INTO vote_"+type+" VALUES ("+req.auth.userId+","+req.body.id_document+",1)")
      .then(([resultat,metadata]) => {
        console.log('ajouter un updown sans antécédent 1');
        // mettre à jour le compteur upvote sur le document
        db.sequelize.query("UPDATE "+type+" SET upvote=upvote+1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          console.log('ajouter un updown sans antécédent 2');
          res.status(200).json({})
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    // ajouter un downvote sans antécédent
    if ((vote[0].vote == null) && (req.body.direction == 0)) {
      console.log('ajouter un downdown sans antécédent 1');
      db.sequelize.query("INSERT INTO vote_"+type+" VALUES ("+req.auth.userId+","+req.body.id_document+",0)")
      .then(([resultat,metadata]) => {
        // mettre à jour le compteur upvote sur le document
        db.sequelize.query("UPDATE "+type+" SET downvote=downvote+1 WHERE id_"+type+"="+req.body.id_document+"")
        .then(([resultat,metadata]) => {
          console.log('ajouter un downdown sans antécédent 2');
          res.status(200).json({})
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
  })
  .catch(error => res.status(500).json({ error }));
}

exports.getArticles = (req, res, next) => {
  // Récupération des articles
  db.sequelize.query("SELECT article.id_article, article.id_compte, article.titre, article.image, article.texte, article.date, article.upvote, article.downvote, article.commentaire, article.signalement, compte.nom, compte.avatar FROM article JOIN compte ON article.id_compte = compte.id_compte;")
    .then(([articles,metadata]) => {
      if (!articles) {
        return res.status(401).json({ message: 'Articles non trouvés' }) 
      }
      // récupération des votes articles
      db.sequelize.query("SELECT id_article, vote FROM vote_article WHERE id_compte = \'"+req.auth.userId+"\';")
      .then(([votes,metadata]) => {
        if (!votes) {
          return res.status(401).json({ message: 'Votes non trouvés' });
        }
        res.status(200).json({
          // on renvoie un tableau d'articles et les votes du client
          articles,votes
        });
      })
      .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getCommentaires = (req, res, next) => {
  // vérification sécurité
  let id = Number(req.query.id);
  if (!Number.isInteger(id) || (id.length > 15)) {
    return res.status(401).json({ message: 'erreur type de données'})
  }
  // Récupération des commentaires
  db.sequelize.query("SELECT commentaire.id_commentaire, commentaire.id_compte, commentaire.id_article, commentaire.texte, commentaire.date, commentaire.upvote, commentaire.downvote, commentaire.signalement, compte.nom, compte.avatar FROM commentaire JOIN compte ON commentaire.id_compte = compte.id_compte WHERE commentaire.id_article = "+id+";")
    .then(([commentaires,metadata]) => {
      if (!commentaires) {
        return res.status(401).json({ message: 'Commentaires non trouvés' }) 
      }
      // récupération des votes commentaires du client
      db.sequelize.query("SELECT id_commentaire, vote FROM vote_commentaire WHERE id_compte = \'"+req.auth.userId+"\';")
      .then(([votes,metadata]) => {
        if (!votes) {
          return res.status(401).json({ message: 'Votes non trouvés' });
        }
        res.status(200).json({
          // on renvoie un tableau de commentaires et les votes du client
          commentaires,votes
        });
      })
      .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.getSignalements = (req, res, next) => {
  // Vérification droits admin
  if (req.auth.admin != 1){
    res.status(401).json({
      message: 'Droits admin requis'
    });
  }

  // Vérification sécurité
  const articles = Number(req.query.id_article);
  const commentaires = Number(req.query.id_commentaire);
  db.sequelize.query("SELECT id_article, id_commentaire, motif, date, id_compte FROM signalement WHERE id_article = "+articles+" AND id_commentaire = "+commentaires+";")
  .then(([signalements,metadata]) => {
    if (!signalements) {
      return res.status(401).json({ message: 'Signalements non trouvés' });
    }
    res.status(200).json({
      signalements
    });
  })
  .catch(error => res.status(500).json({ error }));
}

exports.postSignalement = (req, res, next) => {
  // Vérification sécurité
  const id_article = Number(req.body.id_article);
  const id_commentaire = Number(req.body.id_commentaire);
  const motif = Number(req.body.motif);
  const date = Date.now();
  // On vérifie s'il n'y a pas déjà un signalement de la part du client sur ce document
  db.sequelize.query("SELECT COUNT(id) FROM signalement WHERE id_article = "+id_article+" AND id_commentaire = "+id_commentaire+" AND id_compte = "+req.auth.userId+";")
  .then(([resultat,metadata]) => {
    if (resultat[0]['COUNT(id)'] != 0) {
      return res.status(401).json({ message: 'Déjà signalé' });
    }
    // On enregistre le signalement
    db.sequelize.query("INSERT INTO signalement (id_article, id_commentaire, motif, date, id_compte) VALUES ("+id_article+","+id_commentaire+","+motif+","+date+","+req.auth.userId+");")
    // On met à jour le compteur sur le document
      if (id_commentaire == 0) {
          db.sequelize.query("UPDATE article SET signalement = signalement+1 WHERE id_article = "+id_article+";")
          .then(([signalements,metadata]) => {
            res.status(200).json({ message: 'Signalement enregistré' });
          })
          .catch(error => res.status(500).json({ error }));
        }
        else {
          db.sequelize.query("UPDATE commentaire SET signalement = signalement+1 WHERE id_commentaire = "+id_commentaire+";")
          .then(([signalements,metadata]) => {
            res.status(200).json({ message: 'Signalement enregistré' });
          })
          .catch(error => res.status(500).json({ error }));
        }
  })
  .catch(error => res.status(500).json({ error }));
}

exports.postSupprimerDocument = (req, res, next) => {
  // Vérification sécurité
  const id_document = Number(req.body.id_document);
  const type = Number(req.body.type);
  let document = null;

  // si le document à supprimer est un article
  if (type == 0) {
    db.sequelize.query("SELECT id_compte, image FROM article WHERE id_article = "+id_document+";")
    .then(([resultat,metadata]) => {
    // on vérifie que le client est propriétaire du document ou admin
      if ((req.auth.userId == resultat[0].id_compte) || (req.auth.admin == 1)) {
        // on supprime l'image de l'article s'il y en a une
        if (resultat[0].image != '') {
          fs.unlink('./images/'+resultat[0].image+'.webp', (error) => {if (error) throw error;});
        }
        //suppression, le paramètre DELETE ON CASCADE supprime les documents liés
        db.sequelize.query("DELETE FROM article WHERE id_article = "+id_document+";")
        .then(([resultat,metadata]) => {
          res.status(200).json({ message: 'Article supprimé' });
        })
      }
        else {
          res.status(401).json({ message: 'Non authorisé' });
        }
    })
  }
    // si le document à supprimer est un commentaire (on récupère aussi l'id_article pour mettre à jour le compteur)
    else {
      db.sequelize.query("SELECT id_commentaire, id_article FROM commentaire WHERE id_commentaire = "+id_document+";")
      .then(([resultat,metadata]) => {
    // si le client est propriétaire du document ou admin, suppression, le paramètre DELETE ON CASCADE supprime les documents liés
        if ((req.auth.userId == resultat[0].id_compte) || (req.auth.admin == 1)) {
          db.sequelize.query("DELETE FROM commentaire WHERE id_commentaire = "+id_document+";")
          // mise à jour du compteur sur l'article
          db.sequelize.query("UPDATE article SET commentaire = commentaire-1 WHERE id_article = "+resultat[0].id_article+";")
          .then(([resultat,metadata]) => {
            res.status(200).json({ message: 'Commentaire supprimé' });
          })
        }
          else {
            res.status(401).json({ message: 'Non authorisé' });
          }
      })
    }
}

exports.postConforme = (req, res, next) => {
  // Vérification sécurité
  const id_document = Number(req.body.id_document);
  const type = Number(req.body.type);
  let document = null;

  // Seul l'admin peut supprimer les signalements
  if (req.auth.admin != 1) {
    res.status(401).json({ message: 'Non authorisé' });
  }
    else {
      // si le document conforme est un article
      if (type == 0) {
        db.sequelize.query("DELETE FROM signalement WHERE id_article = "+id_document+";")
        .then(([resultat,metadata]) => {
          // mise à jour du compteur sur l'article
          db.sequelize.query("UPDATE article SET signalement=0 WHERE id_article = "+id_document+";")
          .then(([resultat,metadata]) => {
            res.status(200).json({ message: 'Signalements supprimés' });
          })
          .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
      }
        // si le document conforme est un commentaire
        else {
          db.sequelize.query("DELETE FROM signalement WHERE id_commentaire = "+id_document+";")
          .then(([resultat,metadata]) => {
            // mise à jour du compteur sur le commentaire
            db.sequelize.query("UPDATE commentaire SET signalement=0 WHERE id_commentaire = "+id_document+";")
            .then(([resultat,metadata]) => {
              res.status(200).json({ message: 'Signalements supprimés' });
            })
            .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
        }
  }
}

exports.postCommentaire = (req, res, next) => {
  // Vérification sécurité
  const id_article = Number(req.body.id_article);
  if (req.body.texte.length > 1000) {
    res.status(401).json({ message: 'Non authorisé' });
  }

  // On vérifie que l'article existe toujours
  db.sequelize.query("SELECT id_article FROM article WHERE id_article = "+id_article+";")
  .then(([resultat,metadata]) => {
    if (resultat[0].id_article == null) {
      res.status(404).json({ message: 'Article inexistant' });
    }
    else {

      const date = Date.now();
      // On enregistre le commentaire
      db.sequelize.query("INSERT INTO commentaire (id_compte, id_article, texte, date, upvote, downvote, signalement, ip) VALUES ("+req.auth.userId+", "+id_article+", \'"+req.body.texte+"\', "+date+", '0', '0', '0', \'"+req.ip+"\');")
      .then(([resultat,metadata]) => {
        // Mise à jour du compteur de commentaires sur l'article
        db.sequelize.query("UPDATE article SET commentaire=commentaire+1 WHERE id_article = "+id_article+";")
        .then(([resultat,metadata]) => {
          // Récupération des commentaires de l'article
          db.sequelize.query("SELECT commentaire.id_commentaire, commentaire.id_compte, commentaire.id_article, commentaire.texte, commentaire.date, commentaire.upvote, commentaire.downvote, commentaire.signalement, compte.nom, compte.avatar FROM commentaire JOIN compte ON commentaire.id_compte = compte.id_compte WHERE commentaire.id_article = "+id_article+";")
            .then(([commentaires,metadata]) => {
              if (!commentaires) {
                return res.status(401).json({ message: 'Commentaires non trouvés' }) 
              }
              // récupération des votes commentaires du client
              db.sequelize.query("SELECT id_commentaire, vote FROM vote_commentaire WHERE id_compte = \'"+req.auth.userId+"\';")
              .then(([votes,metadata]) => {
                if (!votes) {
                  return res.status(401).json({ message: 'Votes non trouvés' });
                }
                res.status(200).json({
                  // on renvoie un tableau de commentaires et les votes du client
                  commentaires,votes,message: 'Commentaire enregistré'
                });
              })
              .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
  })
  .catch(error => res.status(500).json({ error }));
}

exports.postArticle = (req, res, next) => {
  // Vérification sécurité
  if ((req.body.titre.length > 100) || (req.body.texte.length > 2000)) {
    res.status(401).json({ message: 'Erreur de taille' });
  }

  let image = '';

  if (req.file != null) {

    // on converti l'image avec webp, on donne les droits en écriture
    webp.grant_permission();

    // on récupère l'extention de l'image
    const extention = req.file.mimetype.split('/')[1];

    // on converti en webp selon l'extention
    if (extention == "gif") {
      webp.gwebp('./images/'+req.file.filename,'./images/'+req.file.filename+'.webp',"-q 80",logging="-v")
      .then(()=>{
        fs.unlink('./images/'+req.file.filename, (error) => {if (error) throw error;});
      })
      .catch(error => res.status(500).json({ error }));
    }
    if ((extention == "jpg") || (extention == "jpeg") || (extention == "png")) {
      webp.cwebp('./images/'+req.file.filename,'./images/'+req.file.filename+'.webp',"-q 80",logging="-v")
      .then(()=>{
        fs.unlink('./images/'+req.file.filename, (error) => {if (error) throw error;});
      })
      .catch(error => res.status(500).json({ error }));
    }
    // si webp, on ajoute simplement l'extention
    if (extention == "webp") {
      fs.rename('./images/'+req.file.filename,'./images/'+req.file.filename+'.webp',(error) => {if (error) throw error;})
    }
    image = req.file.filename;
  }
  else {
    image = '';
  }

  const date = Date.now();

  // On enregistre l'article'
  db.sequelize.query("INSERT INTO article (id_compte, titre, image, texte, date, upvote, downvote, commentaire, signalement, ip) VALUES ("+req.auth.userId+", \'"+req.body.titre+"\', \'"+image+"\', \'"+req.body.texte+"\', "+date+", '0', '0', '0', '0', \'"+req.ip+"\');")
  .then(([resultat,metadata]) => {
    // Récupération des articles 
    db.sequelize.query("SELECT article.id_article, article.id_compte, article.titre, article.image, article.texte, article.date, article.upvote, article.downvote, article.commentaire, article.signalement, compte.nom, compte.avatar FROM article JOIN compte ON article.id_compte = compte.id_compte;")
    .then(([articles,metadata]) => {
      if (!articles) {
        return res.status(401).json({ message: 'Articles non trouvés' }) 
      }
      // Récupération des votes du client
      db.sequelize.query("SELECT id_article, vote FROM vote_article WHERE id_compte = \'"+req.auth.userId+"\';")
      .then(([votes,metadata]) => {
        if (!votes) {
          return res.status(401).json({ message: 'Votes non trouvés' });
        }
        res.status(200).json({
          // on renvoie un tableau de commentaires et les votes du client
          articles,votes,message: 'Article publié'
        });
      })
      .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}