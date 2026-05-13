import { useMemo, useState } from "react";
import { buildSampleSales } from "./data/sampleSales";
import {
  filterRows,
  minMaxDates,
  revenueByDate,
  topProducts,
  totalRevenue,
  totalSales,
  uniqueSorted,
} from "./lib/aggregations";
import type { ParseResult } from "./lib/parsers";
import type { ImportSource, SaleRow } from "./types";
import { DataImporter } from "./components/DataImporter";
import { FiltersPanel } from "./components/FiltersPanel";
import { KPICards } from "./components/KPICards";
import { RevenueTrendChart } from "./components/RevenueTrendChart";
import { TopProductsChart } from "./components/TopProductsChart";

const initialRows = buildSampleSales();

export function App() {
  const [rows, setRows] = useState<SaleRow[]>(initialRows);
  const [lastFileName, setLastFileName] = useState<string | null>("demo-database.json");
  const [lastSource, setLastSource] = useState<ImportSource | null>("database");
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const fullRange = useMemo(() => minMaxDates(rows), [rows]);

  const categories = useMemo(() => uniqueSorted(rows.map((r) => r.category)), [rows]);
  const regions = useMemo(() => uniqueSorted(rows.map((r) => r.region)), [rows]);
  const products = useMemo(() => uniqueSorted(rows.map((r) => r.product)), [rows]);

  const filtered = useMemo(
    () =>
      filterRows(rows, {
        categories: selectedCategories,
        regions: selectedRegions,
        products: selectedProducts,
        dateRange: dateRange ?? (fullRange ? { start: fullRange.start, end: fullRange.end } : null),
      }),
    [rows, selectedCategories, selectedRegions, selectedProducts, dateRange, fullRange]
  );

  const rev = useMemo(() => totalRevenue(filtered), [filtered]);
  const units = useMemo(() => totalSales(filtered), [filtered]);
  const tx = filtered.length;
  const avg = tx ? rev / tx : 0;

  const trend = useMemo(() => revenueByDate(filtered), [filtered]);
  const top = useMemo(() => topProducts(filtered, 8), [filtered]);

  function handleImported(result: ParseResult) {
    setImportErrors(result.errors);
    if (result.rows.length) {
      setRows(result.rows);
      setLastFileName(result.fileName);
      setLastSource(result.source);
      setSelectedCategories([]);
      setSelectedRegions([]);
      setSelectedProducts([]);
      setDateRange(null);
    }
  }

  function handleDemoDb() {
    const demo = buildSampleSales();
    setRows(demo);
    setLastFileName("demo-database.json");
    setLastSource("database");
    setImportErrors([]);
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedProducts([]);
    setDateRange(null);
  }

  function resetFilters() {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedProducts([]);
    setDateRange(null);
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Project · Sales &amp; Revenue Analysis</p>
          <h1>Dashboard</h1>
          <p className="lede">
            Import sales lines, then explore KPIs, trends, and top products with filters and slicers.
          </p>
        </div>
      </header>

      {importErrors.length > 0 && (
        <div className="alert alert--warn" role="status">
          {importErrors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}

      <DataImporter
        onImported={handleImported}
        onLoadDemoDb={handleDemoDb}
        lastFileName={lastFileName}
        lastSource={lastSource}
      />

      <FiltersPanel
        categories={categories}
        regions={regions}
        products={products}
        selectedCategories={selectedCategories}
        selectedRegions={selectedRegions}
        selectedProducts={selectedProducts}
        dateRange={dateRange}
        fullRange={fullRange}
        onCategories={setSelectedCategories}
        onRegions={setSelectedRegions}
        onProducts={setSelectedProducts}
        onDateRange={setDateRange}
        onResetFilters={resetFilters}
      />

      <section className="panel">
        <div className="panel-head">
          <h2>KPIs</h2>
          <span className="badge badge--muted">{filtered.length} rows in view</span>
        </div>
        <KPICards totalRevenue={rev} totalUnits={units} transactionCount={tx} avgOrderValue={avg} />
      </section>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <h2>Revenue trend</h2>
          </div>
          <RevenueTrendChart data={trend} />
        </section>
        <section className="panel chart-panel">
          <div className="panel-head">
            <h2>Top products by revenue</h2>
          </div>
          <TopProductsChart data={top} />
        </section>
      </div>
    </div>
  );
}
