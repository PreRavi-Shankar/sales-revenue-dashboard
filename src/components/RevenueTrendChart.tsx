import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { date: string; revenue: number };

type Props = { data: Point[] };

const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function RevenueTrendChart({ data }: Props) {
  if (!data.length) {
    return <div className="chart-empty">No data for the selected filters.</div>;
  }

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b95a8", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#2a3347" }}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: "#8b95a8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmt.format(Number(v))}
            width={72}
          />
          <Tooltip
            contentStyle={{
              background: "#1c2230",
              border: "1px solid #2a3347",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e8ecf4" }}
            formatter={(value: number) => [fmt.format(value), "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#60a5fa" fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
