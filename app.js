const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoute.js");

app.use("/api", apiRouter);

app.use((err, req, res, next) => {});

module.exports = app;
