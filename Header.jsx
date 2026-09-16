import { useState } from "react";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About the model" },
];

export default function Header({ view, onNavigate }) {
  const [open, setOpen] = useState(false);

  function go(id) {
    onNavigate(id);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-abyss/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 text-left"
          aria-label="Stock Trend Predictor, home"
        >
          {/* LOGO PLACEHOLDER — swap this <svg> for <img src="/logo.svg" .../> */}
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-volt/15 ring-1 ring-volt/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <polyline
                points="3,17 9,11 13,14 21,5"
                fill="none"
                stroke="#7c5cff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="21" cy="5" r="2.4" fill="#35d6a4" />
            </svg>
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            Stock Trend Predictor
          </span>
        </button>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={view === item.id ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                view === item.id
                  ? "bg-rail text-ink"
                  : "text-mute hover:bg-rail/60 hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-line p-2 text-mute sm:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line/70 px-5 pb-4 sm:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="block w-full rounded-lg px-3 py-3 text-left text-sm text-mute hover:bg-rail hover:text-ink"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
