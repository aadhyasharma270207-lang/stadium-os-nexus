/**
 * app.js
 * 
 * Main bootstrap entry point for the FIFA World Cup 2026 Smart Stadium Assistant.
 * Configures static assets caching, security headers, explicit root route serving,
 * limits body sizes, mounts modular routing controllers, and boots the Express.js server
 * with multi-address dual-stack binding across ports 3000, 5000, and 8080.
 */

const express = require("express");
const path = require("path");
const http = require("http");
require("dotenv").config();

const app = express();
const PRIMARY_PORT = parseInt(process.env.PORT, 10) || 3000;
const ALT_PORTS = [PRIMARY_PORT, 5000, 8080];

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

// 2. Explicit Root Route Handler (Guarantees index.html delivery)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 3. Static Asset Delivery with Cache Control (86400 secs = 24 hours caching)
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1d"
}));

// 4. Mount Modular Express Routers
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

// 5. 404 Fallback Middleware (Secure JSON response)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    error: "Not Found: The requested resource does not exist on this server."
  });
});

// 6. Centered Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("💥 Uncaught Express Exception:", err.stack);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error: A secure system error occurred."
  });
});

/**
 * Start Single Port Listener Helper
 */
function bindPort(port) {
  const server = http.createServer(app);
  server.listen(port, "0.0.0.0", () => {
    console.log(`🏟️ Smart Stadium Assistant active at: http://localhost:${port} and http://127.0.0.1:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${port} is currently busy.`);
    } else {
      console.error(`💥 Error binding port ${port}:`, err);
    }
  });
}

/**
 * Start Multi-Address Express Server Listener
 */
function startServers() {
  console.log(`====================================================`);
  console.log(`🏟️ Smart Stadium Assistant Multi-Address Server Boot`);
  console.log(`🌎 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);

  // Bind to unique ports
  const uniquePorts = [...new Set(ALT_PORTS)];
  uniquePorts.forEach(port => bindPort(port));
}

// 7. Server listener startup (only listen if not imported by tests)
if (require.main === module) {
  startServers();
}

module.exports = app;
