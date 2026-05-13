import { useRef } from "react";
import type { ImportSource } from "../types";
import { parseCsvFile, parseExcelFile, parseDatabaseJson } from "../lib/parsers";
import type { ParseResult } from "../lib/parsers";

type Props = {
  onImported: (result: ParseResult) => void;
  onLoadDemoDb: () => void;
  lastFileName: string | null;
  lastSource: ImportSource | null;
};

export function DataImporter({ onImported, onLoadDemoDb, lastFileName, lastSource }: Props) {
  const csvRef = useRef<HTMLInputElement>(null);
  const xlsxRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);

  const label = (s: ImportSource | null) =>
    s === "csv" ? "CSV" : s === "excel" ? "Excel" : s === "database" ? "Database (JSON)" : "—";

  return (
    <section className="panel import">
      <div className="panel-head">
        <h2>Data import</h2>
        {lastFileName && (
          <span className="badge">
            {label(lastSource)} · {lastFileName}
          </span>
        )}
      </div>
      <p className="muted">
        Upload <strong>CSV</strong> or <strong>Excel</strong> (.xlsx). For a database workflow, export query results to{" "}
        <strong>JSON array</strong> and import that file (same columns as spreadsheet).
      </p>
      <div className="import-actions">
        <input ref={csvRef} type="file" accept=".csv,text/csv" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          const res = await parseCsvFile(f);
          onImported(res);
        }} />
        <input ref={xlsxRef} type="file" accept=".xlsx,.xls" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          const res = await parseExcelFile(f);
          onImported(res);
        }} />
        <input ref={jsonRef} type="file" accept=".json,application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          const text = await f.text();
          const res = parseDatabaseJson(text, f.name);
          onImported(res);
        }} />
        <button type="button" className="btn" onClick={() => csvRef.current?.click()}>
          Import CSV
        </button>
        <button type="button" className="btn" onClick={() => xlsxRef.current?.click()}>
          Import Excel
        </button>
        <button type="button" className="btn" onClick={() => jsonRef.current?.click()}>
          Import DB (JSON)
        </button>
        <button type="button" className="btn btn--accent2" onClick={onLoadDemoDb}>
          Load demo database
        </button>
      </div>
      <p className="muted small">
        Sample files in <code className="mono">public/</code>:{" "}
        <a href="/sample-sales.csv" download>
          sample-sales.csv
        </a>
        ,{" "}
        <a href="/sample-sales.json" download>
          sample-sales.json
        </a>{" "}
        (save from dev server root when running <code className="mono">npm run dev</code>).
      </p>
      <p className="muted small mono">
        Expected columns: date, product, category, region, quantity, unit_price (or unit price), revenue — or omit one of
        quantity/unit_price/revenue if the others are present.
      </p>
    </section>
  );
}
