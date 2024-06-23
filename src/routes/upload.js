const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Middleware para manejar datos urlencoded y JSON
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

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

// Middleware para verificar que el NSS está presente
const verifyNSS = (req, res, next) => {
  console.log('Verificando NSS:', req.body.nss); // Agregado para depuración
  console.log('Request body:', req.body); // Agregado para depuración
  if (!req.body.nss) {
    return res.status(400).send({ message: 'Please provide an NSS' });
  }
  next();
};

// Ruta para la subida de archivos con verificación de NSS
router.post('/', upload.single('image'), verifyNSS, (req, res) => {
  console.log('Archivo recibido:', req.file); // Agregado para depuración
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
