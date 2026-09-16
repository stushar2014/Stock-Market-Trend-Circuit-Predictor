/**
 * Stock Trend Predictor — API server
 *
 * Run:  npm install  &&  npm run dev
 * Listens on http://localhost:5000
 */

import express from "express";
import cors from "cors";
import predictRouter from "./routes/predict.js";

const app = express();
const PORT = process.env.PORT || 5000;

// The Vite dev server runs on 5173. In dev its proxy hides the origin
// difference, but CORS is kept here so you can also call the API directly
// (Postman, a deployed frontend, a phone on your LAN).
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));

// Parse JSON bodies. The cap is deliberately small — this endpoint only
// receives a handful of parameters. Raise it if you ever accept file uploads.
app.use(express.json({ limit: "1mb" }));

// Tiny request log; drop it once you add a real logger.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// Health check — handy for confirming the server is actually up.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// All prediction routes live under /api
app.use("/api", predictRouter);

// 404 for unknown API routes, as JSON so the frontend can parse it.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "No such endpoint." });
});

// Central error handler — every thrown error ends up here as JSON.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something broke on the server." });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Mock mode: ${process.env.USE_MOCK === "0" ? "off" : "on"}`);
});
