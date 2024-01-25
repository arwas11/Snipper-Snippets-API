require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { auth } = require("express-openid-connect");

const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_BASE_URL } =
  process.env;

const config = {
  authRequired: false,
  auth0Logout: true,
  // A long, randomly-generated string stored in env - use:
  //openssl rand -base64 32 OR openssl rand -hex 32
  secret: AUTH0_SECRET,
  //The URL where the application is served
  baseURL: AUTH0_AUDIENCE,
  //The Client ID found in your Application settings
  clientID: AUTH0_CLIENT_ID,
  //The Domain as a secure URL found in your Application settings
  issuerBaseURL: AUTH0_BASE_URL,
};

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() 
  ?
  `<h1>Snipper Snippets API</h1>
        </br>
        <h2> Welocme back, <i>${req.oidc.user.nickname}!</i> </h2><span> <a href="http://localhost:3000/logout">logout</a></span>
        </br>
        </br>
        <a href="http://localhost:3000/snippets"><button>See All Snippets</button></a>`
        :
  // App page
          `
          <h1>Snipper Snippets API</h1>
          </br>
          </br>
          <a href="http://localhost:3000/users"><button>log in</button></a>`)
});

app.use("/snippets", routes.snippet);

app.use("/users", routes.user);

app.use((req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

module.exports = app;
