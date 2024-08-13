const { getDbStats } = require("../controller/PublicController");

const router = require("express").Router();

// db stats
router.get("/dbstats", getDbStats);

// server status
router.get("/serverStatus", getServerStatus);

module.exports = router;
