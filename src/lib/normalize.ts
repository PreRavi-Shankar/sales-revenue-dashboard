import type { SaleRow } from "../types";

const COL_ALIASES: Record<string, string> = {
  sale_date: "date",
  order_date: "date",
  transaction_date: "date",
  product_name: "product",
  item: "product",
  sku: "product",
  prod: "product",
  cat: "category",
  territory: "region",
  state: "region",
  qty: "quantity",
  units: "quantity",
  amount: "revenue",
  total: "revenue",
  sales: "revenue",
  line_total: "revenue",
  price: "unitprice",
  unit_price: "unitprice",
};

function canonKey(k: string): string {
  const s = k.trim().toLowerCase().replace(/\s+/g, "_");
  return COL_ALIASES[s] ?? s;
}

function parseNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const s = String(v).replace(/[$,]/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseDate(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && v > 20000) {
    const d = new Date((v - 25569) * 86400 * 1000);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const s = String(v).trim();
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function rowId(i: number): string {
  return `r-${i}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Map a loose key/value record into SaleRow; skips invalid rows. */
export function normalizeRecords(
  rows: Record<string, unknown>[],
  startIndex = 0
): SaleRow[] {
  const out: SaleRow[] = [];
  rows.forEach((raw, i) => {
    const m: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      m[canonKey(k)] = v;
    }
    const date = parseDate(m.date ?? m.Date);
    const product = String(m.product ?? m.Product ?? "").trim();
    if (!date || !product) return;

    const category = String(m.category ?? m.Category ?? "Uncategorized").trim() || "Uncategorized";
    const region = String(m.region ?? m.Region ?? "All").trim() || "All";

    let quantity = parseNum(m.quantity ?? m.Quantity);
    let unitPrice = parseNum(m.unitprice ?? m.unitPrice ?? m.UnitPrice);
    let revenue = parseNum(m.revenue ?? m.Revenue);

    if (revenue === null && quantity !== null && unitPrice !== null) {
      revenue = quantity * unitPrice;
    }
    if (quantity === null && revenue !== null && unitPrice !== null && unitPrice !== 0) {
      quantity = revenue / unitPrice;
    }
    if (unitPrice === null && revenue !== null && quantity !== null && quantity !== 0) {
      unitPrice = revenue / quantity;
    }
    if (quantity === null || unitPrice === null || revenue === null) return;
    if (quantity < 0 || revenue < 0) return;

    out.push({
      id: rowId(startIndex + i),
      date,
      product,
      category,
      region,
      quantity,
      unitPrice,
      revenue,
    });
  });
  return out;
}
