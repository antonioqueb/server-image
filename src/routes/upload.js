const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload an image' });
  }
  const imageUrl = `http://${req.hostname}:${req.socket.localPort}/uploads/${req.file.filename}`;
  res.send({
    imageUrl: imageUrl,
    filename: req.file.filename
  });
});

module.exports = router;
