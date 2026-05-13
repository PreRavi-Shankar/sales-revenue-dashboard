import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ImportSource } from "../types";
import { normalizeRecords } from "./normalize";

export type ParseResult = {
  rows: ReturnType<typeof normalizeRecords>;
  source: ImportSource;
  fileName: string;
  errors: string[];
};

function pushError(errors: string[], msg: string) {
  errors.push(msg);
}

export function parseCsvFile(file: File): Promise<ParseResult> {
  const errors: string[] = [];
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data ?? [];
        const rows = normalizeRecords(data);
        if (rows.length === 0) pushError(errors, "No valid rows found. Expected columns like date, product, quantity, unit price, revenue.");
        resolve({ rows, source: "csv", fileName: file.name, errors });
      },
      error: (err) => reject(err),
    });
  });
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  const errors: string[] = [];
  return file.arrayBuffer().then((buf) => {
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) {
      pushError(errors, "Workbook has no sheets.");
      return { rows: [], source: "excel" as const, fileName: file.name, errors };
    }
    const sheet = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    const rows = normalizeRecords(json);
    if (rows.length === 0) pushError(errors, "No valid rows on first sheet. Check column names (date, product, quantity, unit price, revenue).");
    return { rows, source: "excel", fileName: file.name, errors };
  });
}

/** JSON array export from a database or API — same logical columns as CSV/Excel. */
export function parseDatabaseJson(text: string, fileName: string): ParseResult {
  const errors: string[] = [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    pushError(errors, "Invalid JSON.");
    return { rows: [], source: "database", fileName, errors };
  }
  if (!Array.isArray(parsed)) {
    pushError(errors, "JSON must be an array of row objects.");
    return { rows: [], source: "database", fileName, errors };
  }
  const rows = normalizeRecords(parsed as Record<string, unknown>[]);
  if (rows.length === 0) pushError(errors, "No valid rows in JSON array.");
  return { rows, source: "database", fileName, errors };
}
