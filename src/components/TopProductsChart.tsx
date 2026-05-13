import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TopProduct } from "../lib/aggregations";

type Props = { data: TopProduct[] };

const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6", "#eab308", "#64748b"];

export function TopProductsChart({ data }: Props) {
  if (!data.length) {
    return <div className="chart-empty">No product data for the current slice.</div>;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: d.product.length > 18 ? `${d.product.slice(0, 16)}…` : d.product,
  }));

  return (
    <div className="chart-wrap chart-wrap--tall">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#8b95a8", fontSize: 11 }} tickFormatter={(v) => fmt.format(Number(v))} />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#8b95a8", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#2a3347" }}
          />
          <Tooltip
            contentStyle={{
              background: "#1c2230",
              border: "1px solid #2a3347",
              borderRadius: 8,
            }}
            formatter={(value: number, name: string) =>
              name === "revenue" ? [fmt.format(value), "Revenue"] : [value, "Units"]
            }
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as TopProduct | undefined;
              return p?.product ?? "";
            }}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
