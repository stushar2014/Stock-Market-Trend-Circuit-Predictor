const PIPELINE = [
  {
    step: "Collect",
    body: "Daily OHLCV pulled with yfinance for the selected ticker, cached locally as CSV so repeat runs stay fast.",
  },
  {
    step: "Engineer",
    body: "Close, 14-day RSI, 12/26 MACD and log volume are stacked, then min-max scaled into 60-day rolling windows.",
  },
  {
    step: "Train",
    body: "Two LSTM layers (64 and 32 units) with dropout 0.2, Adam at 1e-3, early stopping on validation MAE.",
  },
  {
    step: "Serve",
    body: "Weights load once into a Keras model; Express passes the request payload to the Python process and returns its JSON.",
  },
];

const METRICS = [
  { label: "RMSE (test)", value: "2.81" },
  { label: "MAE (test)", value: "2.14" },
  { label: "Directional F1", value: "0.91" },
  { label: "Training rows", value: "4,820" },
];

export default function AboutModel() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        About the model
      </h1>
      <p className="mt-5 max-w-[68ch] leading-relaxed text-mute">
        The predictor is a sequence model, not a rule engine. It learns the shape of
        recent price behaviour and extrapolates it — which means it is strongest in
        steady regimes and weakest exactly when markets break pattern. Treat every
        output as one opinion with a stated confidence attached.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-hull/70 p-4">
            <p className="font-mono text-2xl font-semibold">{m.value}</p>
            <p className="mt-1 text-xs text-mute">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Numbered here because the pipeline genuinely is a sequence. */}
      <ol className="mt-12 space-y-6 border-l border-line pl-6">
        {PIPELINE.map((p, i) => (
          <li key={p.step} className="relative">
            <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border border-line bg-hull font-mono text-xs text-mute">
              {i + 1}
            </span>
            <h2 className="font-display text-lg font-semibold">{p.step}</h2>
            <p className="mt-1.5 max-w-[66ch] text-sm leading-relaxed text-mute">{p.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-2xl border border-fall/30 bg-fall/5 p-6">
        <h2 className="font-display text-lg font-semibold">Known limits</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
          <li>No earnings, news or macro signals — price action only.</li>
          <li>Accuracy degrades sharply past a 15-session horizon.</li>
          <li>Gaps, splits and halts are not modelled explicitly.</li>
          <li>Built as an academic mini-project. Do not trade on it.</li>
        </ul>
      </div>
    </div>
  );
}
