import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

/*
  Expects series like:
  [{ date: "2026-09-01", actual: 212.4, forecast: null }, ...]
  Points after the split carry `forecast` only, so the solid line stops
  where observed data stops and the dashed line takes over.
*/
export default function TrendChart({ series, splitDate }) {
  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#262c5c" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8f96c2", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#262c5c" }}
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: "#8f96c2", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "#0f1330",
              border: "1px solid #262c5c",
              borderRadius: 12,
              color: "#e8eaf8",
              fontSize: 12,
            }}
            labelStyle={{ color: "#8f96c2" }}
            formatter={(value, name) => [
              typeof value === "number" ? value.toFixed(2) : value,
              name === "actual" ? "Close" : "Forecast",
            ]}
          />
          {splitDate && <ReferenceLine x={splitDate} stroke="#3b4280" strokeDasharray="4 4" />}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#7c5cff"
            strokeWidth={2.2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#35d6a4"
            strokeWidth={2.2}
            strokeDasharray="5 5"
            dot={{ r: 2.5, fill: "#35d6a4", strokeWidth: 0 }}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
