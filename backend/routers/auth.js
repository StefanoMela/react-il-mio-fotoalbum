const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');

const validator = require('../middlewares/validator');
const { registerData, loginData } = require('../validations/users.js');

const multer = require('multer');
const uploader = multer({dest: "./public/profile_pics"});

router.post('/register', uploader.single('image'), validator(registerData), authController.register)
router.post('/login', uploader.single('image'), validator(loginData), authController.login)

module.exports = router;