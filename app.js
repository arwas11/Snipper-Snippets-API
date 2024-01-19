require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const routes = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Snipper Snippets API");
});

app.use("/snippets", routes.snippet);

app.use("/users", routes.user);

app.use((req, res) => {
  res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
});


module.exports = app;