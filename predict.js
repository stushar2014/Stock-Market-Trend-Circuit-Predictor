import { Router } from "express";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to your Python entry script. Keep the model code inside server/ml/.
const PYTHON_SCRIPT = path.join(__dirname, "..", "ml", "predict.py");
// On Windows this is usually "python"; on macOS/Linux usually "python3".
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
// Mock mode is ON by default so the UI works before your model is ready.
// Set USE_MOCK=0 in .env once predict.py runs.
const USE_MOCK = process.env.USE_MOCK !== "0";

/**
 * POST /api/predict
 * Body: { ticker, model, horizon, lookback, exchange }
 */
router.post("/predict", async (req, res, next) => {
  try {
    const { ticker, model = "lstm", horizon = 5, lookback = 60, exchange = "" } = req.body ?? {};

    // ---- 1. Validate before spending time on inference ---------------------
    if (!ticker || typeof ticker !== "string") {
      return res.status(400).json({ error: "Pick a ticker symbol." });
    }
    if (!Number.isFinite(Number(horizon)) || horizon < 1 || horizon > 60) {
      return res.status(400).json({ error: "Horizon must be between 1 and 60 sessions." });
    }
    if (!Number.isFinite(Number(lookback)) || lookback < 20 || lookback > 250) {
      return res.status(400).json({ error: "Lookback must be between 20 and 250 days." });
    }

    const params = {
      ticker: ticker.trim().toUpperCase(),
      model,
      horizon: Number(horizon),
      lookback: Number(lookback),
      exchange,
    };

    // ---- 2. Run the model --------------------------------------------------
    const result = USE_MOCK ? buildMockPrediction(params) : await runPythonModel(params);

    return res.json(result);
  } catch (err) {
    // Model failures get a clear 502 rather than the generic 500,
    // so the frontend can tell "model broke" from "server broke".
    if (err.code === "MODEL_ERROR") {
      return res.status(502).json({ error: err.message });
    }
    return next(err);
  }
});

/* =========================================================================
   INTEGRATING YOUR PYTHON MODEL
   =========================================================================
   How the two languages talk to each other:

     Node  --(JSON on stdin)-->  predict.py  --(JSON on stdout)-->  Node

   Rules that keep this from breaking:
     1. predict.py must print EXACTLY ONE JSON object to stdout and nothing
        else. A stray print() or a TensorFlow banner will corrupt the parse —
        send all logging to stderr instead (print(..., file=sys.stderr)).
     2. Return the same field names the React ResultsPanel expects:
        ticker, horizon, lastClose, predictedPrice, changePercent, direction
        ("up" | "down"), confidence (0–1), currency, splitDate,
        series [{ date, actual, forecast }], drivers [{ name, weight }].
     3. Loading a Keras model takes several seconds. Spawning a fresh process
        per request is fine for a demo; for anything heavier, run a small
        FastAPI/Flask service in Python and have Node call it over HTTP.
   ========================================================================= */
function runPythonModel(params) {
  return new Promise((resolve, reject) => {
    // Extra flags your script may need go in this array after the path.
    const child = spawn(PYTHON_BIN, [PYTHON_SCRIPT], {
      cwd: path.join(__dirname, ".."),
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));

    // Don't let a hung model block the request forever.
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(modelError("The model took too long to respond (30s timeout)."));
    }, 30_000);

    child.on("error", () => {
      clearTimeout(timeout);
      reject(modelError(`Could not start "${PYTHON_BIN}". Is Python on your PATH?`));
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (stderr.trim()) console.error("[python stderr]", stderr.trim());

      if (code !== 0) {
        return reject(modelError(`The Python script exited with code ${code}.`));
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(modelError("The Python script did not return valid JSON."));
      }
    });

    // Send the request parameters in, then close stdin so Python's
    // sys.stdin.read() returns instead of waiting for more input.
    child.stdin.write(JSON.stringify(params));
    child.stdin.end();
  });
}

function modelError(message) {
  const err = new Error(message);
  err.code = "MODEL_ERROR";
  return err;
}

/* =========================================================================
   MOCK PREDICTION
   Generates a plausible random-walk series so the whole UI — chart, badge,
   confidence bar — is demoable before the model exists. Delete this function
   and the USE_MOCK branch once predict.py is wired up.
   ========================================================================= */
function buildMockPrediction({ ticker, horizon, lookback }) {
  const historyDays = Math.min(lookback, 90);
  const series = [];
  let price = 90 + (hash(ticker) % 180);
  const today = new Date();

  for (let i = historyDays; i > 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    price = Math.max(5, price + (Math.random() - 0.48) * price * 0.018);
    series.push({ date: iso(d), actual: round(price), forecast: null });
  }

  const lastClose = price;
  const splitDate = series[series.length - 1].date;
  // Join the two lines at the split point so the chart has no visual gap.
  series[series.length - 1].forecast = round(lastClose);

  const drift = (Math.random() - 0.45) * 0.01;
  for (let i = 1; i <= horizon; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    price = price * (1 + drift + (Math.random() - 0.5) * 0.006);
    series.push({ date: iso(d), actual: null, forecast: round(price) });
  }

  const predictedPrice = price;
  const changePercent = ((predictedPrice - lastClose) / lastClose) * 100;

  return {
    ticker,
    horizon,
    currency: "$",
    lastClose: round(lastClose),
    predictedPrice: round(predictedPrice),
    changePercent: round(changePercent),
    direction: changePercent >= 0 ? "up" : "down",
    confidence: round(0.62 + Math.random() * 0.3, 3),
    splitDate,
    series,
    drivers: [
      { name: "Momentum (RSI 14)", weight: round(0.2 + Math.random() * 0.2, 2) },
      { name: "MACD histogram", weight: round(0.15 + Math.random() * 0.2, 2) },
      { name: "Volume trend", weight: round(0.1 + Math.random() * 0.15, 2) },
      { name: "Sector correlation", weight: round(0.05 + Math.random() * 0.15, 2) },
    ],
    mock: true,
  };
}

const round = (n, dp = 2) => Number(n.toFixed(dp));
const iso = (d) => d.toISOString().slice(0, 10);
const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

export default router;
