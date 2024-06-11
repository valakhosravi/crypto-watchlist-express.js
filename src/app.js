const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Importing route modules
const routes = require('./routes');

// Using route modules
app.use('/', routes);

// Swagger documentation setup
const swaggerSetup = require('./swagger');
swaggerSetup(app);

module.exports = app;
