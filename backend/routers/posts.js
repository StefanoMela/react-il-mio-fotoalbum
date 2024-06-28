const express = require("express");
const router = express.Router();

const postController = require('../controllers/posts');

const validator = require('../middlewares/validator');
const { bodyData } = require('../validations/posts')
const { paramID } = require('../validations/params');

const authMdw = require('../middlewares/authentication');

const multer = require('multer');
const uploader = multer({dest: "./public/imgs"});

router.get('/', postController.show);

router.post('/create', uploader.single('image'), authMdw.authProcedure, validator(bodyData), postController.create);

router.get('/:id', postController.showSingle);

router.put('/:id', uploader.single('image'), authMdw.isUserPost, validator(bodyData), postController.update);

router.delete('/:id', validator(paramID), postController.destroy);

module.exports = router;