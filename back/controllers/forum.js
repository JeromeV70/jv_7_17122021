const Thing = require('../models/Sauces');
const fs = require('fs');
const db = require('../models/db');
const { query } = require('express');

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  // l'id est généré automatiquement par la BDD
  delete thingObject._id;
  // initialisation des likes à 0
  thingObject.likes=0;
  thingObject.dislikes=0;
  // création de l'objet à insérer dans la BDD
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id})
      .then(thing => {
        // recherche de userId dans les likes ou dislike de la sauce ( -1 == pas d'occurence )
        const userLiked = thing.usersLiked.indexOf(req.auth.userId);
        const userDisliked = thing.usersDisliked.indexOf(req.auth.userId);
        // n'afficher que l'identifiant de l'utilisateur dans la liste des likes et dislikes, pour confidentialité.
        if (userLiked > -1){thing.usersLiked = [req.auth.userId]}
        else {thing.usersLiked = [];}
        if (userDisliked > -1){thing.usersDisliked = [req.auth.userId]}
        else {thing.usersDisliked = [];}
        res.status(200).json(thing);
      })
      .catch(error => res.status(400).json({ error }));
  }

exports.modifyThing = (req, res, next) => {

  let thingObject = {};
  // Si nouvelle image
  if(req.file){
    thingObject = {...JSON.parse(req.body.sauce),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
    // recherche du lien de l'ancienne image pour suppression
    Thing.findOne({ _id: req.params.id})
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        // suppression de l'ancienne image
        fs.unlink(`images/${filename}`,(err)=>{if (err) throw err;})
      })
      .catch(error => res.status(400).json({ error }));
  }
  else{
    thingObject = { ...req.body };
  }
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      // si pas le bon ID, erreur
      if(thing.userId !== req.auth.userId){res.status(401).json({ message: 'Non autorisé !'});return;}
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

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
