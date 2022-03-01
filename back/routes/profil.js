const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const profil = require('../controllers/profil');
const multer = require('../middleware/multer-config');

router.get('/InfosProfil', auth, profil.InfosProfil);
router.post('/SupprimerCompte',auth, profil.SupprimerCompte)
router.post('/ModifierProfil', auth, multer, profil.ModifierProfil);

module.exports = router;