/**
 * app.js
 * 
 * Main bootstrap entry point for the FIFA World Cup 2026 Smart Stadium Assistant.
 * Configures static assets caching, security headers, limits body sizes, mounts
 * modular routing controllers, and boots the Express.js server.
 */

const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security Header Adjustments & Size Limits
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" })); // Buffer limits to prevent overflows/DoS
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Middleware to set security headers on all responses
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// 2. Static Asset Delivery with Cache Control (86400 secs = 24 hours caching)
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1d"
}));

// 3. Mount Modular Express Routers
const apiRouter = require("./routes/api");
const chatRoutes = require("./routes/chatRoutes");
const crowdRoutes = require("./routes/crowdRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const telemetryRouter = require("./routes/telemetry");
const legacyChatRouter = require("./routes/chat");
const translateRouter = require("./routes/translate");

app.use("/api", apiRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/stadiums", stadiumRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/stadium-data", telemetryRouter);
app.use("/api/legacy-chat", legacyChatRouter);
app.use("/api/translate", translateRouter);

// 4. 404 Fallback Middleware (Secure JSON response)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    error: "Not Found: The requested resource does not exist on this server."
  });
});

// 5. Centered Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("💥 Uncaught Express Exception:", err.stack);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error: A secure system error occurred."
  });
});

// 6. Server listener startup (only listen if not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏟️ Smart Stadium Assistant running on port ${PORT}`);
    console.log(`🌎 Mode: Development`);
    console.log(`🔗 Local Address: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
