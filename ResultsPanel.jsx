import TrendChart from "./TrendChart.jsx";

function Panel({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-line bg-hull/70 p-6 ${className}`}>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <Panel className="grid min-h-[26rem] place-items-center text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-rail">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <polyline
              points="3,16 9,10 13,13 21,5"
              fill="none"
              stroke="#8f96c2"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold">No forecast yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Choose an instrument on the left and run the model. The projected path,
          confidence band and feature attributions will appear here.
        </p>
      </div>
    </Panel>
  );
}

function LoadingState() {
  return (
    <Panel className="min-h-[26rem]">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-40 rounded bg-rail" />
        <div className="h-12 w-56 rounded bg-rail" />
        <div className="h-64 rounded-xl bg-rail/70" />
      </div>
      <p className="mt-4 text-sm text-mute">
        Loading market history and running inference…
      </p>
    </Panel>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Panel className="min-h-[26rem]">
      <h2 className="font-display text-lg font-semibold text-fall">The run did not complete</h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-mute">{message}</p>
      <p className="mt-2 text-sm text-mute">
        Check that the Express server is running on port 5000, then try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-xl border border-line px-4 py-2.5 text-sm hover:border-volt/60"
      >
        Run it again
      </button>
    </Panel>
  );
}

export default function ResultsPanel({ status, result, error, onRetry }) {
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error} onRetry={onRetry} />;
  if (status !== "success" || !result) return <EmptyState />;

  const up = result.direction === "up";
  const tone = up ? "text-rise" : "text-fall";
  const change = result.changePercent;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-mute">
              {result.ticker} · {result.horizon}-session forecast
            </p>
            <p className={`mt-2 font-mono text-4xl font-semibold ${tone}`}>
              {result.currency ?? "$"}
              {result.predictedPrice.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-mute">
              from {result.currency ?? "$"}
              <span className="font-mono">{result.lastClose.toFixed(2)}</span> at last close
            </p>
          </div>

          <div
            className={`rounded-xl border px-4 py-3 text-right ${
              up ? "border-rise/35 bg-rise/10" : "border-fall/35 bg-fall/10"
            }`}
          >
            <p className={`font-mono text-xl font-semibold ${tone}`}>
              {change > 0 ? "+" : ""}
              {change.toFixed(2)}%
            </p>
            <p className="mt-0.5 text-xs text-mute">{up ? "Uptrend" : "Downtrend"}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-mute">Model confidence</span>
            <span className="font-mono">{(result.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-rail">
            <div
              className={`h-full rounded-full ${up ? "bg-rise" : "bg-fall"}`}
              style={{ width: `${Math.min(100, result.confidence * 100)}%` }}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Projected path</h2>
          <div className="flex gap-4 text-xs text-mute">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 rounded bg-volt" /> Observed close
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 rounded bg-rise" /> Forecast
            </span>
          </div>
        </div>
        <TrendChart series={result.series} splitDate={result.splitDate} />
      </Panel>

      {result.drivers?.length > 0 && (
        <Panel>
          <h2 className="font-display text-lg font-semibold">What moved the call</h2>
          <ul className="mt-4 space-y-3">
            {result.drivers.map((d) => (
              <li key={d.name} className="flex items-center gap-4">
                <span className="w-40 shrink-0 text-sm text-mute">{d.name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-rail">
                  <span
                    className="block h-full rounded-full bg-volt"
                    style={{ width: `${Math.round(d.weight * 100)}%` }}
                  />
                </span>
                <span className="w-12 text-right font-mono text-sm">
                  {(d.weight * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
