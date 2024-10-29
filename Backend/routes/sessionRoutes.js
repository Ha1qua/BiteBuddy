// routes/sessionRoutes.js
const express = require("express");
const { storeTableNumber } = require("../controllers/sessionController");
const router = express.Router();

router.post("/store-table", storeTableNumber);

module.exports = router;
