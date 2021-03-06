const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'})

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const admin = decodedToken.admin;
    // identifiant et admin ajouté à la requête pour utilisation dans les contrôleurs
    req.auth = { userId, admin };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};