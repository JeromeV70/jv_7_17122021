const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const forum = require('../controllers/forum');
//const multer = require('../middleware/multer-config');

//router.get('/images', auth, );
router.get('/getArticles', auth, forum.getArticles);
router.get('/getCommentaires', auth, forum.getCommentaires);
router.get('/getSignalements', auth, forum.getSignalements);
router.post('/Vote', auth, forum.Vote);
router.post('/postSignalement', auth, forum.postSignalement);
//router.get('/getArticles', auth, forum.getArticles);
/*
router.post('/', auth, multer, saucesCtrl.createThing);
router.get('/:id', auth, saucesCtrl.getOneThing);
router.put('/:id', auth, multer, saucesCtrl.modifyThing);
router.post('/:id/like', auth, saucesCtrl.likeSauce);
router.delete('/:id', auth, saucesCtrl.deleteThing);
*/
module.exports = router;