"""
predict.py — the bridge between Express and your trained model.

Contract:
    stdin   one JSON object: {"ticker","model","horizon","lookback","exchange"}
    stdout  one JSON object, nothing else
    stderr  all logging, warnings and tracebacks

Test it on its own before touching Node:
    echo '{"ticker":"AAPL","horizon":5,"lookback":60}' | python3 predict.py
"""

import json
import sys
from datetime import date, timedelta


def load_history(ticker: str, lookback: int):
    """Fetch OHLCV data.

    Replace with your own loader, e.g.:
        import yfinance as yf
        df = yf.download(ticker, period=f"{lookback + 30}d", interval="1d")
        return df
    """
    raise NotImplementedError("Wire up your data source here.")


def run_model(df, horizon: int):
    """Scale, window, predict, inverse-transform.

    Typical shape of this function:
        scaler  = joblib.load("ml/artifacts/scaler.pkl")
        model   = keras.models.load_model("ml/artifacts/lstm.keras")
        window  = scaler.transform(df[FEATURES].values)[-LOOKBACK:]
        preds   = model.predict(window[None, ...], verbose=0)
        return scaler.inverse_transform(preds)
    """
    raise NotImplementedError("Load your weights and predict here.")


def main() -> None:
    params = json.loads(sys.stdin.read())
    ticker = params["ticker"]
    horizon = int(params.get("horizon", 5))
    lookback = int(params.get("lookback", 60))

    print(f"predicting {ticker} h={horizon}", file=sys.stderr)  # logs -> stderr

    # --- swap these two lines for the real calls -------------------------
    # df = load_history(ticker, lookback)
    # forecast = run_model(df, horizon)
    history = [(date.today() - timedelta(days=i), 100.0) for i in range(lookback, 0, -1)]
    forecast = [(date.today() + timedelta(days=i), 102.0) for i in range(1, horizon + 1)]
    # ---------------------------------------------------------------------

    last_close = history[-1][1]
    predicted = forecast[-1][1]
    change = (predicted - last_close) / last_close * 100

    series = [{"date": d.isoformat(), "actual": round(v, 2), "forecast": None} for d, v in history]
    series[-1]["forecast"] = round(last_close, 2)  # join the two lines
    series += [{"date": d.isoformat(), "actual": None, "forecast": round(v, 2)} for d, v in forecast]

    result = {
        "ticker": ticker,
        "horizon": horizon,
        "currency": "$",
        "lastClose": round(last_close, 2),
        "predictedPrice": round(predicted, 2),
        "changePercent": round(change, 2),
        "direction": "up" if change >= 0 else "down",
        "confidence": 0.87,           # e.g. 1 - normalised validation error
        "splitDate": history[-1][0].isoformat(),
        "series": series,
        "drivers": [
            {"name": "Momentum (RSI 14)", "weight": 0.31},
            {"name": "MACD histogram", "weight": 0.27},
            {"name": "Volume trend", "weight": 0.22},
            {"name": "Sector correlation", "weight": 0.20},
        ],
    }

    # The one and only stdout write.
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # never let a traceback land on stdout
        print(f"predict.py failed: {exc}", file=sys.stderr)
        sys.exit(1)
