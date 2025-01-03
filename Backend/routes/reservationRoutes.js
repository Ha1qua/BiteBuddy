const express = require("express");
const router = express.Router();
const { createReservation } = require("../controllers/reservationController");

// POST route to handle new reservation
router.post("/reservations", createReservation);

module.exports = router;
