# Sales & Revenue Analysis Dashboard

A browser-based dashboard to explore sales lines: import data from **CSV**, **Excel**, or a **JSON database export**, then view **KPIs**, **revenue over time**, and **top products** with **filters and slicers**.

## Features

- **Data import**
  - CSV (`.csv`)
  - Excel (`.xlsx` / `.xls`) — first sheet is read
  - Database-style **JSON array** export (same logical columns as spreadsheets)
  - **Load demo database** — built-in sample data for instant exploration
- **KPIs** — total revenue, total units sold, transaction count, average line value
- **Charts** — revenue trend (area chart), top products by revenue (bar chart)
- **Interactivity** — date range, category / region / product slicers (multi-select chips), reset filters

## Tech stack

- [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — dev server and production build
- [Recharts](https://recharts.org/) — charts
- [Papa Parse](https://www.papaparse.com/) — CSV parsing
- [SheetJS (`xlsx`)](https://sheetjs.com/) — Excel parsing

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes `npm`)

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
git clone <your-repo-url>
cd sales-revenue-dashboard
npm install
npm run dev
```

Open the URL shown in the terminal (typically **http://localhost:5173**).

### Other scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Start dev server with hot reload     |
| `npm run build`| Typecheck + production build → `dist/` |
| `npm run preview` | Serve the production build locally |

## Sample data

The `public/` folder includes small files you can import to test:

- `sample-sales.csv`
- `sample-sales.json`

With the dev server running, you can download them from the app’s import section links or open them from disk when using **Import CSV** / **Import DB (JSON)**.

## Expected data shape

Each row should represent one sale line. After import, rows are normalized to: **date**, **product**, **category**, **region**, **quantity**, **unit price**, **revenue**.

Supported column aliases include (non-exhaustive): `sale_date` / `order_date` → date; `qty` / `units` → quantity; `unit_price` / `unit price` → unit price; `total` / `sales` / `amount` → revenue.

You may omit **one** of quantity, unit price, or revenue if the other two are present (the missing value is derived).

## Project structure

```
sales-revenue-dashboard/
├── public/              # Static assets + sample CSV/JSON
├── src/
│   ├── components/      # UI: import, filters, KPIs, charts
│   ├── data/            # Demo data generator
│   ├── lib/             # Parsers, normalization, aggregations
│   ├── App.tsx          # Main state and layout
│   ├── main.tsx         # App entry
│   └── types.ts         # Shared TypeScript types
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Deploying to GitHub Pages (optional)

1. Set `base` in `vite.config.ts` to your repo name if the site is not at the domain root, for example: `base: '/sales-revenue-dashboard/'`.
2. Run `npm run build`.
3. Publish the `dist/` folder (e.g. with the [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) action or any static host).

## License

This project is provided as-is for learning and portfolio use. Add a `LICENSE` file if you need a specific license.
