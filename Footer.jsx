/* ---------------------------------------------------------------
   EDIT THESE THREE LINES with your own details before submitting.
   --------------------------------------------------------------- */
const AUTHOR = "Your Name";
const PRN = "PRN: 0000000000";
const GITHUB_REPO = "https://github.com/your-username/stock-trend-predictor";
const GITHUB_PROFILE = "https://github.com/your-username";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold">{AUTHOR}</p>
          <p className="mt-1 font-mono text-xs text-mute">{PRN}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-mute transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.14.46.55.38A8 8 0 0 0 8 0Z" />
            </svg>
            Repository
          </a>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="text-mute transition-colors hover:text-ink"
          >
            GitHub profile
          </a>
          <span className="text-mute/70">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
