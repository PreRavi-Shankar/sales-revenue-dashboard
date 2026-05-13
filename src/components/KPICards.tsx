const fmtMoney = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fmtNum = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

type Props = {
  totalRevenue: number;
  totalUnits: number;
  transactionCount: number;
  avgOrderValue: number;
};

export function KPICards({ totalRevenue, totalUnits, transactionCount, avgOrderValue }: Props) {
  const cards: { label: string; value: string; hint: string }[] = [
    { label: "Total revenue", value: fmtMoney.format(totalRevenue), hint: "Sum of line revenue in current slice" },
    { label: "Total units sold", value: fmtNum.format(totalUnits), hint: "Quantity across all matching rows" },
    { label: "Transactions", value: fmtNum.format(transactionCount), hint: "Number of line items after filters" },
    { label: "Avg line value", value: fmtMoney.format(avgOrderValue), hint: "Revenue ÷ transaction count" },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <article key={c.label} className="kpi-card" title={c.hint}>
          <p className="kpi-label">{c.label}</p>
          <p className="kpi-value">{c.value}</p>
        </article>
      ))}
    </div>
  );
}
