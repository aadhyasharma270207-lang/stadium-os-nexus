/**
 * routes/translate.js
 * 
 * Routing mapping for the announcement translator service.
 */

const express = require("express");
const router = express.Router();
const translateController = require("../controllers/translate");

router.post("/", translateController.processTranslation);

module.exports = router;
