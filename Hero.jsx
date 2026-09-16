// The hero leads with the thing the model actually produces — a curve that
// leaves the observed window and keeps going — rather than a generic headline block.
export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-14 pb-10 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
      <div>
        <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl">
          Where the next five sessions are heading.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-mute">
          A stacked LSTM reads sixty days of price, volume and momentum signals for
          any listed ticker, then projects the closing price forward and tells you
          how much of that projection it is willing to stand behind.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-mute">
          <span>
            <span className="font-mono text-ink">60</span> day lookback window
          </span>
          <span>
            <span className="font-mono text-ink">4</span> engineered features
          </span>
          <span>
            <span className="font-mono text-ink">0.91</span> directional F1 on test data
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-hull/70 p-5">
        <svg viewBox="0 0 320 130" className="w-full" role="img" aria-label="Illustrative forecast curve">
          <defs>
            <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 96 L28 88 L56 99 L84 74 L112 80 L140 58 L168 66 L196 44 L196 130 L0 130 Z"
            fill="url(#heroFill)"
          />
          <path
            d="M0 96 L28 88 L56 99 L84 74 L112 80 L140 58 L168 66 L196 44"
            fill="none"
            stroke="#7c5cff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M196 44 L232 38 L268 26 L308 18"
            fill="none"
            stroke="#35d6a4"
            strokeWidth="2.4"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
          <line x1="196" y1="8" x2="196" y2="122" stroke="#262c5c" strokeWidth="1" />
          <circle cx="308" cy="18" r="4" fill="#35d6a4" />
        </svg>
        <div className="mt-3 flex justify-between text-xs text-mute">
          <span>Observed history</span>
          <span className="text-rise">Forecast horizon</span>
        </div>
      </div>
    </section>
  );
}
