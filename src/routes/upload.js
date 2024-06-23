const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const nss = req.body.nss;
    const extension = path.extname(file.originalname);
    cb(null, `${nss}${extension}`);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload an image' });
  }
  if (!req.body.nss) {
    return res.status(400).send({ message: 'Please provide an NSS' });
  }
  const imageUrl = `http://${req.hostname}:3008/uploads/${req.file.filename}`;
  res.send({
    imageUrl: imageUrl,
    filename: req.file.filename
  });
});

module.exports = router;
