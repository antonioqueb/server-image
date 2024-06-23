const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Middleware para procesar el cuerpo antes de multer
router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const nss = req.body.nss;
    const extension = path.extname(file.originalname);
    if (nss) {
      cb(null, `${nss}${extension}`);
    } else {
      cb(new Error('NSS is required'));
    }
  }
});

const upload = multer({ storage: storage });

router.post('/', (req, res, next) => {
  // Verificar que el NSS está presente antes de procesar la imagen
  if (!req.body.nss) {
    return res.status(400).send({ message: 'Please provide an NSS' });
  }
  next();
}, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload an image' });
  }

  const nss = req.body.nss;
  const extension = path.extname(req.file.originalname);
  const filename = `${nss}${extension}`;
  const filePath = path.join(__dirname, '../../uploads', filename);

  // Verificar si el archivo ya existe y reemplazarlo si es necesario
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Mover el archivo subido al destino final
  fs.renameSync(req.file.path, filePath);

  const imageUrl = `http://${req.hostname}:3008/uploads/${filename}`;
  res.send({
    imageUrl: imageUrl,
    filename: filename
  });
});

module.exports = router;
