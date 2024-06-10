const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Importing route modules
const watchlistRoutes = require('./routes/watchlistRoutes');

// Using route modules
app.use('/watchlist', watchlistRoutes);

// Swagger documentation setup
const swaggerSetup = require('./swagger');
swaggerSetup(app);

module.exports = app;
