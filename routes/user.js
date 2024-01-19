require("dotenv").config();
const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const users = require("../db/usersData.json");
// const {User} = require("../models")
const basicAuth = require("../middleware/basicAuth");
const bcrypt = require("bcrypt");
const userAuth = require("../middleware/userAuth");
const JWT_SECRET = process.env.JWT_SECRET;

let ids = users.length;

//POST register a new user
// As a user, I want to make an account with my email and password, so that I can have an identity on Snippr.io
userRouter.post("/register", basicAuth, async (req, res, next) => {
  try {
    // get the user data, thanks to basicAuth middleware!
    const { email, password } = req.user;
    // console.log("checking valid credentials");
    //send error if no entries
    if (!email || !password) {
      res
        .status(401)
        .json({ error: "Please enter a valid email and password" });
    }

    // console.log("valid credentials");
    // console.log("log all users before creating a new one", users);

    // hash the password
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log("hashing password");

    const newUser = {
      id: ++ids,
      email: email,
      password: hashedPassword,
    };

    // console.log("----------",newUser);

    // NO NEED FOR TOKEN WHEN REGISTERING
    // console.log("creating token");
    // const token = jwt.sign(
    //   { id: newUser.id, email: newUser.email },
    //   JWT_SECRET
    // );

    // console.log("this created token",token);
    users.push(newUser);
    res.status(201).send(`New account was created!
    id: ${newUser.id}, email: ${newUser.email}
    `);
    // TOKEN= ${token}
  } catch (error) {
    next(error);
  }
});

//FOR TESTING: GET all users
userRouter.get("/", async (req, res, next) => {
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
    } else {
      // USER STORY: The user provides their email and password to authenticate and receives a token in exchange
      //make a payload
      const payload = { id: foundUser.id, email: foundUser.email };

      // sign and encode the payload to create the token
      const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});

      // don't send back the hashed password
      // res.json({ id: foundUser.id, email: foundUser.email });

      // res.json({accessToken})
      res.status(202).send(`welcome back, ${foundUser.email}!
      TOKEN: ${accessToken}`);
    }
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
