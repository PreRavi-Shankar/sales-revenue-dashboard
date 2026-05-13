import type { SaleRow } from "../types";

const products = [
  { name: "AeroDesk Pro", cat: "Furniture" },
  { name: "PulseMonitor X", cat: "Electronics" },
  { name: "HydroBottle 1L", cat: "Lifestyle" },
  { name: "Vertex Keyboard", cat: "Electronics" },
  { name: "Lumen Lamp", cat: "Furniture" },
  { name: "Stride Runners", cat: "Apparel" },
  { name: "Nimbus Speaker", cat: "Electronics" },
  { name: "Atlas Backpack", cat: "Apparel" },
];

const regions = ["North", "South", "East", "West", "Central"];

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Deterministic demo dataset (acts like rows from a DB). */
export function buildSampleSales(): SaleRow[] {
  const rows: SaleRow[] = [];
  const start = new Date("2025-10-01");
  let id = 0;
  for (let day = 0; day < 120; day++) {
    const d = new Date(start);
    d.setDate(d.getDate() + day);
    const entries = 4 + (day % 5);
    for (let e = 0; e < entries; e++) {
      const p = products[(day + e) % products.length];
      const region = regions[(day * e) % regions.length];
      const quantity = 1 + ((day + e * 3) % 8);
      const unitPrice = 15 + ((day * 7 + e * 11) % 220);
      const revenue = Math.round(quantity * unitPrice * 100) / 100;
      rows.push({
        id: `sample-${id++}`,
        date: iso(d),
        product: p.name,
        category: p.cat,
        region,
        quantity,
        unitPrice,
        revenue,
      });
    }
  }
  return rows;
}
