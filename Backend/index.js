const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User= require('./models/user')
const  GameHistory  = require('./models/GameHistory'); 
require('dotenv').config();

const app = express();
const PORT =  3000; 
const MONGODB_URI = process.env.URI;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  User.findOne({ name })
    .then(user => {
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = new User({
        name,
        score: 0
      });

      return newUser.save()
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: 'Failed to add user' }));
    })
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

app.post('/history', (req, res) => {
  const { player, playerChoice, computerChoice, result } = req.body;
  if (!player || !playerChoice || !computerChoice || result === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newHistory = new GameHistory({
    player,
    playerChoice,
    computerChoice,
    result
  });

  newHistory.save()
    .then(history => res.json(history))
    .catch(err => res.status(500).json({ error: 'Failed to save game history' }));
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
