const jwt = require("jsonwebtoken");

// Code to check the token is correct
const verifyToken = (req, res, next) => {
  let authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    jwt.verify(token, process.env.Jwt_Key, (err, user) => {
      if (err) {
        console.log("Token Verification Error", err);
        return res.status(403).json("This token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "Token not found" });
  }
};

//code to check if id matches
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, (data) => {
    if (req.user.id === req.params.id) {
      console.log("successful");
      next();
    } else {
      console.log("Id's doesn't match");
      return res.status(403).json("You are not allowed");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
