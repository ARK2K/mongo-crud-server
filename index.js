const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
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

// In-memory session store (you could use Redis or MongoDB for production)
const sessions = {};

app.post('/api/connect', async (req, res) => {
  const { uri } = req.body;
  if (!uri) return res.status(400).json({ success: false, message: 'URI is required' });

  const token = uuidv4();
  sessions[token] = { uri }; // Store URI in-memory, keyed by token

  res.json({ success: true, token });
});

// Attach the session to every request that has a valid token
app.use('/api', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !sessions[token]) {
    return res.status(401).json({ success: false, message: 'Unauthorized or missing token' });
  }
  req.mongoSession = sessions[token]; // Inject the session (i.e., URI) into req
  next();
});

// Use secured routes
app.use('/api', mongoRoutes);

// Basic routes
app.get('/health', (req, res) => res.status(200).send('Backend is live!'));
app.get('/', (req, res) => res.send('Backend is running'));
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});