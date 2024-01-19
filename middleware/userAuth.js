const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; //use the command to generate a secret "openssl rand base64 32"

/**
 * Parse and verify the token. If authentic, attach the payload to req.user
 * and pass to the next middleware.
 */

async function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized user" });
  }
  //shows as "Bearer lksdfsdafklhdsf" we need the second item (idx=1) after split
  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = userAuth;
