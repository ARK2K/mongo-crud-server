const express = require('express');
const cors = require('cors');
const mongoRoutes = require('./routes/mongoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://ark2k.github.io'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin.toLowerCase())) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
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