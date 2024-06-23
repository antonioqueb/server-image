// src\index.js
const express = require('express');
const uploadRouter = require('./routes/upload');

const app = express();
const port = 3009;

app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos urlencoded
app.use(express.json()); // Middleware para manejar JSON

app.use('/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server is running at http://192.168.1.69:${port}`);
});
