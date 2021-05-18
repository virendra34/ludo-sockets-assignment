const express = require('express');
const app = express();
const path = require('path');
// put server express routes at the beginning //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('../routes/api'));
// Serve the static files
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/static/register', express.static(path.join(__dirname + '/../public/register.html')));
app.use('/static/dashboard', express.static(path.join(__dirname + '/../public/dashboard.html')));
app.use('/static/lobby', express.static(path.join(__dirname + '/../public/lobby.html')));
module.exports = app;