const userRouter = require("express").Router();
const { requiresAuth } = require("express-openid-connect");

const users = require("../db/usersData.json");
// const {User} = require("../models")

// let ids = users.length;

//Oauth login/logout route
userRouter.get("/", requiresAuth(), async (req, res, next) => {
  try {
    res.json(req.oidc.user);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
