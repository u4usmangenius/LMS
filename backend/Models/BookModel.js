const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../db/Sqlite").db;
router.get("/test", (req, res) => {
  res.status(200).send({ success: true });
});

// you will export router and you will use router
module.exports = router;
