const express = require("express");
const router = express.Router();

const postController = require('../controllers/posts');

const multer = require('multer');
const uploader = multer({dest: "./public/imgs"});

router.get('/', postController.show);

router.post('/create', uploader.single('image'), postController.create);

router.get('/:id', postController.showSingle);

router.delete('/:id', postController.destroy);

module.exports = router;