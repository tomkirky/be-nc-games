const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRoute.js');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleRouteNotFound,
} = require('./errors');

app.use(express.json());
app.use(express.static('public'));

app.use('/api', apiRouter);

app.all('/*', handleRouteNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
