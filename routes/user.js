require("dotenv").config();
const userRouter = require("express").Router();
const users = require("../db/usersData.json");
const basicAuth = require("../middleware/basicAuth");
const bcrypt = require("bcrypt");

let ids = users.length;

//POST register a new user
// As a user, I want to make an account with my email and password, so that I can have an identity on Snippr.io
userRouter.post("/", basicAuth, async (req, res, next) => {
  try {
    // get the user data, thanks to basicAuth middleware!
    const { email, password } = req.user;

    //send error if no entries
    if (!email || !password) {
      res
        .status(401)
        .json({ error: "Please enter a valid email and password" });
    }

    // hash the password
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: ++ids,
      email: email,
      password: hashedPassword,
    };

    users.push(newUser);
    console.log(users);
    res.status(201).send(`New account was created!
    email: ${newUser.email}, id: ${newUser.id}`);
  } catch (error) {
    next(error);
  }
});

//FOR TESTING: GET all users
userRouter.get("/", (req, res, next) => {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//need a db that persist to implement this user login
userRouter.get("/login", basicAuth, async (req, res, next) => {
  try {
    //get user info from db
    const foundUser = await users.find((user) => user.email === req.user.email);
    // console.log(foundUser)

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // compare the provided password with the hashed password from the db
    const comparePassword = await bcrypt.compare(
      req.user.password,
      foundUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    // don't send back the hashed password
    // res.json({ id: foundUser.id, email: foundUser.email });

    res.status(202).send(`welcome back, ${foundUser.email}!`);
  } catch (error) {
    next(error);
  }

  //verifying user exits without auth by using username *NEED TO REGISTER/POST USERNAME
  // try {
  //   const { username, password } = req.body;
  //   if (!username || !password) {
  //     res
  //       .status(401)
  //       .json({ error: "Please enter a valid username and password" });
  //   }

  //   if (username && password) {
  //     const foundUser = users.find((element) => element.username === username);

  //     // console.log(foundUser.username)
  //     if (foundUser.password !== password) {
  //       res.status(401).json({ error: "password is incorrect" });
  //     }
  //   }

  //   res.status(202).send(`welcome back, ${username}`);
  // } catch (error) {
  //   next(error)
  // }
});

module.exports = userRouter;
