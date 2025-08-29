const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { sequelize } = require('./models');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.post('/api/upload', (req, res) => {
  res.json({ status: 'uploaded' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
