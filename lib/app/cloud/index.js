const express = require('express');
const router = express.Router();
const controllers = require('./controllers');
const config = require('../../config');
const multer = require('multer');
const upload = multer({ dest: config.projectPath('uploads'), limits: {fileSize: 2147483648}});

router.use(controllers.fileExists);
router.get('/*', controllers.isDir);
router.post('/*', upload.single("file"), controllers.uploadFile);
module.exports = {router};
