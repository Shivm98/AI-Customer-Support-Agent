require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const { sequelize } = require('./models');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.post('/api/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const dataBuffer = req.files.file.data;
    const pdf = await pdfParse(dataBuffer);
    res.json({ text: pdf.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3001;
sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });
