import { useState } from "react";

const TICKERS = [
  { value: "AAPL", label: "AAPL · Apple Inc." },
  { value: "MSFT", label: "MSFT · Microsoft Corp." },
  { value: "TSLA", label: "TSLA · Tesla Inc." },
  { value: "INFY", label: "INFY · Infosys Ltd." },
  { value: "RELIANCE", label: "RELIANCE · Reliance Industries" },
];

const MODELS = [
  { value: "lstm", label: "Stacked LSTM" },
  { value: "gru", label: "GRU" },
  { value: "arima", label: "ARIMA (baseline)" },
];

const HORIZONS = [
  { value: 1, label: "Next session" },
  { value: 5, label: "5 sessions" },
  { value: 15, label: "15 sessions" },
  { value: 30, label: "30 sessions" },
];

const field =
  "w-full rounded-xl border border-line bg-abyss/60 px-3.5 py-3 text-sm text-ink " +
  "placeholder:text-mute/60 transition-colors hover:border-volt/50 focus:border-volt focus:outline-none";

export default function PredictionForm({ onPredict, loading }) {
  const [form, setForm] = useState({
    ticker: "AAPL",
    model: "lstm",
    horizon: 5,
    lookback: 60,
    exchange: "NASDAQ",
  });

  const set = (key) => (e) => {
    const raw = e.target.value;
    const value = key === "horizon" || key === "lookback" ? Number(raw) : raw;
    setForm((f) => ({ ...f, [key]: value }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    onPredict(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-hull/70 p-6"
      aria-busy={loading}
    >
      <h2 className="font-display text-lg font-semibold">Set up a run</h2>
      <p className="mt-1.5 text-sm text-mute">
        Pick an instrument and a horizon. The model refits on the most recent close.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="ticker" className="mb-2 block text-sm text-mute">
            Instrument
          </label>
          <select id="ticker" value={form.ticker} onChange={set("ticker")} className={field}>
            {TICKERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="model" className="mb-2 block text-sm text-mute">
              Architecture
            </label>
            <select id="model" value={form.model} onChange={set("model")} className={field}>
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="horizon" className="mb-2 block text-sm text-mute">
              Forecast horizon
            </label>
            <select id="horizon" value={form.horizon} onChange={set("horizon")} className={field}>
              {HORIZONS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lookback" className="mb-2 block text-sm text-mute">
              Lookback (days)
            </label>
            <input
              id="lookback"
              type="number"
              min="20"
              max="250"
              value={form.lookback}
              onChange={set("lookback")}
              className={`${field} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="exchange" className="mb-2 block text-sm text-mute">
              Exchange
            </label>
            <input
              id="exchange"
              type="text"
              value={form.exchange}
              onChange={set("exchange")}
              placeholder="NASDAQ, NSE…"
              className={field}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-7 w-full rounded-xl bg-volt px-4 py-3.5 text-sm font-semibold text-white transition
                   hover:bg-volt/85 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {loading ? "Running the model…" : "Predict trend"}
      </button>
      <p className="mt-3 text-center text-xs text-mute">
        Educational project output. Not investment advice.
      </p>
    </form>
  );
}
