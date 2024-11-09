const {
  getDbStats,
  getServerStatus,
} = require("../controller/PublicController");
const { signUp, signIn } = require("../controller/UserController");

const router = require("express").Router();

// signup
router.post("/signup", signUp);
//signin
router.post("/signin", signIn);

// db stats
router.get("/dbStats", getDbStats);

// server status
router.get("/serverStatus", getServerStatus);

module.exports = router;
