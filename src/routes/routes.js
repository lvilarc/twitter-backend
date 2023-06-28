
const { Router } = require('express');

const passport = require('passport');
const multer = require('multer');

const UserController = require('../controllers/UserController');
const TweetController = require('../controllers/TweetController');
const AuthController = require('../controllers/AuthController');




const router = Router();


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('O arquivo enviado não é uma imagem.'));
      }
    }
  });

// Auth
router.use('/auth', passport.authenticate('jwt', { session: false }));
router.get('/auth/getDetails', AuthController.getDetails);
router.post('/login', AuthController.login);

router.get('/users',UserController.index);
router.get('/users/:id',UserController.show);
router.post('/users',UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.destroy);
router.get('/users/checkUsername/:username', UserController.checkUsername);
router.post('/user/checkEmail', UserController.checkEmail);
router.post('/upload', upload.single('file'), UserController.uploadImage);
router.put('/user/updateWithImage/:id', upload.single('file'), UserController.updateWithImage);


router.get('/tweets', TweetController.index);
router.get('/tweets/:id', TweetController.show);
router.post('/tweets/user/:userId', TweetController.create);
router.post('/tweets/image/user/:userId', upload.single('file'), TweetController.createWithImage);
router.get('/tweet/user/:userId', TweetController.indexUser);

router.put('/tweets/:id', TweetController.update);
router.delete('/tweets/:id', TweetController.destroy);






module.exports = router;
