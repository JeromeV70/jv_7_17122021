const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const profilCtrl = require('../controllers/profil');

router.get('/acces', auth, profilCtrl.acces);
//router.post('/login', userCtrl.login);

module.exports = router;