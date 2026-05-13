import type { DateRange } from "../lib/aggregations";

type Props = {
  categories: string[];
  regions: string[];
  products: string[];
  selectedCategories: string[];
  selectedRegions: string[];
  selectedProducts: string[];
  dateRange: DateRange | null;
  fullRange: DateRange | null;
  onCategories: (v: string[]) => void;
  onRegions: (v: string[]) => void;
  onProducts: (v: string[]) => void;
  onDateRange: (v: DateRange | null) => void;
  onResetFilters: () => void;
};

function Slicer({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div className="slicer">
      <p className="slicer-label">{label}</p>
      <div className="slicer-chips">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={`chip ${active ? "chip--on" : ""}`}
              onClick={() => toggle(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FiltersPanel({
  categories,
  regions,
  products,
  selectedCategories,
  selectedRegions,
  selectedProducts,
  dateRange,
  fullRange,
  onCategories,
  onRegions,
  onProducts,
  onDateRange,
  onResetFilters,
}: Props) {
  return (
    <section className="panel filters">
      <div className="panel-head">
        <h2>Filters & slicers</h2>
        <button type="button" className="btn btn--ghost" onClick={onResetFilters}>
          Reset all
        </button>
      </div>
      <p className="muted small">
        Slicers narrow the dataset before KPIs and charts recompute. Empty selection means &quot;all&quot; for that dimension.
      </p>
      <div className="date-row">
        <label className="field">
          <span>From</span>
          <input
            type="date"
            value={dateRange?.start ?? fullRange?.start ?? ""}
            min={fullRange?.start}
            max={fullRange?.end}
            onChange={(e) => {
              const start = e.target.value;
              if (!fullRange) return;
              const end = dateRange?.end ?? fullRange.end;
              if (start && end >= start) onDateRange({ start, end });
            }}
          />
        </label>
        <label className="field">
          <span>To</span>
          <input
            type="date"
            value={dateRange?.end ?? fullRange?.end ?? ""}
            min={fullRange?.start}
            max={fullRange?.end}
            onChange={(e) => {
              const end = e.target.value;
              if (!fullRange) return;
              const start = dateRange?.start ?? fullRange.start;
              if (end && start <= end) onDateRange({ start, end });
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onDateRange(null)}
          disabled={!fullRange}
        >
          Full date range
        </button>
      </div>
      <Slicer label="Category" options={categories} selected={selectedCategories} onChange={onCategories} />
      <Slicer label="Region" options={regions} selected={selectedRegions} onChange={onRegions} />
      <Slicer label="Product" options={products.slice(0, 40)} selected={selectedProducts} onChange={onProducts} />
      {products.length > 40 && (
        <p className="muted small">Showing first 40 products as chips; use category/region to narrow further.</p>
      )}
    </section>
  );
}
