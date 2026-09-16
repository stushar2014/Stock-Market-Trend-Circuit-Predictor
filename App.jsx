import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import AboutModel from "./components/AboutModel.jsx";
import Footer from "./components/Footer.jsx";
import { requestPrediction } from "./lib/api.js";

export default function App() {
  const [view, setView] = useState("home");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [lastParams, setLastParams] = useState(null);

  async function handlePredict(params) {
    setLastParams(params);
    setStatus("loading");
    setError("");
    try {
      const data = await requestPrediction(params);
      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Could not reach the prediction service.");
      setStatus("error");
    }
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header view={view} onNavigate={setView} />

      <main className="flex-1">
        {view === "about" ? (
          <AboutModel />
        ) : (
          <>
            <Hero />
            <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-6 lg:grid-cols-[22rem_1fr] lg:items-start">
              {/* Control rail — sticks alongside the results on wide screens. */}
              <div className="lg:sticky lg:top-24">
                <PredictionForm onPredict={handlePredict} loading={status === "loading"} />
              </div>
              <ResultsPanel
                status={status}
                result={result}
                error={error}
                onRetry={() => lastParams && handlePredict(lastParams)}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
