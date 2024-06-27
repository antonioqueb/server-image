const express = require('express');
const uploadRouter = require('./routes/upload');

const app = express();
const port = 3009;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server is running at http://149.50.128.198:${port}`);
});
