# Stock Trend Predictor

A dashboard for an AI/ML mini-project: React + Vite + Tailwind v4 on the front, Express on the back, with a documented hand-off to a Python model.

```
stock-trend-predictor/
├── client/                  React frontend (port 5173)
│   └── src/
│       ├── App.jsx                  view state + API call
│       ├── lib/api.js               the only fetch in the app
│       └── components/
│           ├── Header.jsx           nav + logo placeholder
│           ├── Hero.jsx             headline + forecast sparkline
│           ├── PredictionForm.jsx   ticker / model / horizon inputs
│           ├── ResultsPanel.jsx     empty, loading, error, result states
│           ├── TrendChart.jsx       Recharts line chart
│           ├── AboutModel.jsx       "About the model" page
│           └── Footer.jsx           your name, PRN, GitHub links
└── server/                  Express API (port 5000)
    ├── server.js            app setup, middleware, error handling
    ├── routes/predict.js    POST /api/predict + child_process bridge
    └── ml/predict.py        Python stub with the JSON contract
```

## Running it locally

Two terminals. Backend first.

**Terminal 1 — API**

```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5000
```

Check it with `curl http://localhost:5000/api/health`.

**Terminal 2 — frontend**

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173. The app starts in **mock mode**, so you get a full working demo — chart, confidence bar, trend badge — with no Python installed. Vite proxies `/api/*` to port 5000, so there is no CORS setup to do.

## Plugging in your model

1. Put your training code, weights and scaler under `server/ml/`.
2. Fill in `load_history()` and `run_model()` in `server/ml/predict.py`.
3. Test the script by itself — this catches most integration bugs:
   ```bash
   cd server
   echo '{"ticker":"AAPL","horizon":5,"lookback":60}' | python3 ml/predict.py
   ```
   It must print one JSON object and nothing else. Send every log line to `stderr`.
4. Set `USE_MOCK=0` in `server/.env` and restart the API.

`routes/predict.js` spawns the script, writes the request body to its stdin, reads JSON from stdout, and kills it after 30 seconds. The comment block above `runPythonModel()` lists the exact fields the frontend expects back.

If loading your weights is slow, run the model behind a small FastAPI service instead and have the Express route `fetch()` it — the response shape stays identical, so no frontend changes.

## Before you submit

- `client/src/components/Footer.jsx` — replace `AUTHOR`, `PRN` and the two GitHub URLs at the top of the file.
- `client/src/components/AboutModel.jsx` — swap in your real metrics.
- `client/src/components/PredictionForm.jsx` — edit the `TICKERS` list.
- `client/index.html` — page title and description.
- `client/src/index.css` — every colour lives in the `@theme` block; change a hex there and the whole site follows.

## Swapping in a vision-style input

For a computer-vision project (attendance, detection), replace `PredictionForm` with an upload panel and keep everything else. The shape is the same — a component that calls `onPredict(payload)`:

```jsx
const [file, setFile] = useState(null);

<div
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
  className="rounded-2xl border-2 border-dashed border-line p-10 text-center hover:border-volt/60"
>
  {file ? file.name : "Drop an image here, or click to browse"}
  <input type="file" accept="image/*" className="sr-only"
         onChange={(e) => setFile(e.target.files[0])} />
</div>
```

Send it as `FormData` instead of JSON, add `multer` to the Express route to receive the file, and pass the saved path to `predict.py` as an argument. On the results side, swap `TrendChart` for an `<img>` with absolutely-positioned `<div>`s drawn from the bounding boxes the model returns.

## Deploying

```bash
cd client && npm run build      # outputs client/dist
```

Host `client/dist` on any static host (Vercel, Netlify, GitHub Pages) and set `VITE_API_BASE` to your deployed API origin. The Express server needs a Node host that also has Python available — Render and Railway both work.
