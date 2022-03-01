const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const forum = require('../controllers/forum');
const multer = require('../middleware/multer-config');

router.get('/getArticles', auth, forum.getArticles);
router.get('/getCommentaires', auth, forum.getCommentaires);
router.get('/getSignalements', auth, forum.getSignalements);
router.post('/Vote', auth, forum.Vote);
router.post('/postSignalement', auth, forum.postSignalement);
router.post('/postSupprimerDocument', auth, forum.postSupprimerDocument);
router.post('/postConforme', auth, forum.postConforme);
router.post('/postCommentaire', auth, forum.postCommentaire);
router.post('/postArticle', auth, multer, forum.postArticle);

module.exports = router;