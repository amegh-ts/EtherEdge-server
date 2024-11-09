const jwt = require("jsonwebtoken");

// Middleware to check if the token is valid
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    jwt.verify(token, process.env.Jwt_Key, (err, user) => {
      if (err) {
        console.log("Token Verification Error", err);
        return res.status(403).json({ error: "This token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "Token not found" });
  }
};

// Middleware to check if the token is valid and if the user ID matches
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {

    console.log(req.user);
    
    if (req.user && req.user.id === req.params.id) {
      console.log("Authorization successful");
      next();
    } else {
      console.log("User ID does not match");
      return res.status(403).json({ error: "You are not allowed" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
