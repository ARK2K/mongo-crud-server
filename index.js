const express = require('express');
const cors = require('cors');
const mongoRoutes = require('./routes/mongoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://ARK2K.github.io',
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('Backend is live!');
});

app.use('/api', mongoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());