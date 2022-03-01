const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const date = Date.now();
    const name = date + '_' + req.auth.userId;
    callback(null, name);
  }
});

module.exports = multer({storage: storage,limits: {fileSize: 1050000}}).single('image');