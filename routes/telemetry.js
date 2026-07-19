/**
 * routes/telemetry.js
 * 
 * Routing mapping for the Stadium Telemetry API.
 */

const express = require("express");
const router = express.Router();
const telemetryController = require("../controllers/telemetry");

router.get("/", telemetryController.getTelemetry);

module.exports = router;
