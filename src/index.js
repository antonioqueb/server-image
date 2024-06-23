const express = require('express');
const uploadRouter = require('./routes/upload');

const app = express();
const port = 3009;
const ip = '192.168.1.69';

app.use('/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server is running at http://${ip}:${port}`);
});
