const userRouter = require("express").Router();
const users = require("../db/usersData.json");

let ids = users.length;

userRouter.get("/", (req, res) => {
  res.json(users);
});

//need a db that persist
userRouter.get("/exists", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(401)
      .json({ error: "Please enter a valid username and password" });
  }

  if (username && password) {
    const foundUser = users.find((element) => element.username === username);

    // console.log(foundUser.username)
    if (foundUser.password !== password) {
      res.status(401).json({ error: "password is incorrect" });
    }
  }

  res.status(202).send(`welcome back, ${username}`);
});

userRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(401)
      .json({ error: "Please enter a valid username and password" });
  }
  const newUser = {
    id: ++ids,
    username: username,
    password: password,
  };
  users.push(newUser);
  res.status(201).send(`Thank you for registering, ${newUser.username}`);
});

module.exports = userRouter;
