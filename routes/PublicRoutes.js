const { getDbStats } = require("../controller/PublicController");

const router = require("express").Router();

// db stats
router.get("/dbstats", getDbStats);

module.exports = router;
