const express = require("express");
const router = express.Router();

const postController = require('../controllers/posts');

const validator = require('../middlewares/validator');
const { bodyData } = require('../validations/posts')
const { paramID } = require('../validations/params');

const multer = require('multer');
const uploader = multer({dest: "./public/imgs"});

router.get('/', postController.show);

router.post('/create', uploader.single('image'), validator(bodyData), postController.create);

router.get('/:id', postController.showSingle);

router.delete('/:id', validator(paramID), postController.destroy);

module.exports = router;