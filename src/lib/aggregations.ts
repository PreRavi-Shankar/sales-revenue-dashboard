import type { SaleRow } from "../types";

export type DateRange = { start: string; end: string };

export function filterRows(
  rows: SaleRow[],
  opts: {
    categories: string[];
    regions: string[];
    products: string[];
    dateRange: DateRange | null;
  }
): SaleRow[] {
  return rows.filter((r) => {
    if (opts.categories.length && !opts.categories.includes(r.category)) return false;
    if (opts.regions.length && !opts.regions.includes(r.region)) return false;
    if (opts.products.length && !opts.products.includes(r.product)) return false;
    if (opts.dateRange) {
      if (r.date < opts.dateRange.start || r.date > opts.dateRange.end) return false;
    }
    return true;
  });
}

export function totalSales(filtered: SaleRow[]): number {
  return filtered.reduce((s, r) => s + r.quantity, 0);
}

export function totalRevenue(filtered: SaleRow[]): number {
  return filtered.reduce((s, r) => s + r.revenue, 0);
}

export function revenueByDate(filtered: SaleRow[]): { date: string; revenue: number }[] {
  const map = new Map<string, number>();
  for (const r of filtered) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.revenue);
  }
  return [...map.entries()]
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export type TopProduct = { product: string; revenue: number; quantity: number };

export function topProducts(filtered: SaleRow[], limit = 8): TopProduct[] {
  const map = new Map<string, { revenue: number; quantity: number }>();
  for (const r of filtered) {
    const cur = map.get(r.product) ?? { revenue: 0, quantity: 0 };
    cur.revenue += r.revenue;
    cur.quantity += r.quantity;
    map.set(r.product, cur);
  }
  return [...map.entries()]
    .map(([product, v]) => ({ product, revenue: v.revenue, quantity: v.quantity }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function minMaxDates(rows: SaleRow[]): DateRange | null {
  if (!rows.length) return null;
  let min = rows[0].date;
  let max = rows[0].date;
  for (const r of rows) {
    if (r.date < min) min = r.date;
    if (r.date > max) max = r.date;
  }
  return { start: min, end: max };
}
