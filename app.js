require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const routes = require("./routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Snipper Snippets API");
});

app.use("/snippets", routes.snippet);

app.use("/users", routes.user);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
