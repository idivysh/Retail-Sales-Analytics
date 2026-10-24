# Retail Sales Analytics & Customer Insights

An end-to-end retail analytics project that transforms transaction-level sales data into actionable business insights through Python data analysis, a FastAPI backend, and an interactive Next.js dashboard.

## Project Overview

This project analyzes the Online Retail dataset to understand sales performance, customer purchasing behavior, and geographic revenue distribution. It combines exploratory data analysis with a web dashboard that presents key performance indicators and interactive visualizations.

## Key Features

- **Sales analytics:** Monthly merchandise revenue and quantity sold.
- **Country performance:** Compare merchandise revenue across countries.
- **Customer segmentation:** Analyze one-time and repeat buyers.
- **Customer insights:** Explore customer revenue, purchasing frequency, and purchase history.
- **KPI dashboard:** View revenue, units sold, invoices, products, countries, and identified customers.
- **REST API:** Serve processed analytics data through FastAPI endpoints.
- **Interactive visualizations:** Display trends and comparisons using Recharts.

## Technology Stack

| Area | Technologies |
|---|---|
| Data analysis | Python, Pandas, NumPy |
| Visualization | Matplotlib, Seaborn, Plotly, Recharts |
| Backend | FastAPI, Uvicorn |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Data source | Online Retail Excel dataset |
| Data exchange | CSV and JSON |

## Project Structure

```text
retail-sales-analytics/
├── data/
│   ├── raw/
│   │   └── Online Retail.xlsx
│   └── processed/
│       ├── monthly_sales.csv
│       ├── country_sales.csv
│       ├── customer_segmentation.csv
│       ├── customer_summary.csv
│       └── kpi_summary.csv
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── app/
│   ├── public/
│   └── package.json
└── README.md
```

*This structure illustrates the main project components; your actual folders may contain additional files.*

## Dashboard Metrics

The current processed reports contain these results:

| Metric | Value |
|---|---:|
| Merchandise revenue | £19,499,175.72 |
| Units sold | 11,127,534 |
| Unique invoices | 39,553 |
| Unique products | 4,878 |
| Countries represented | 43 |
| Identified customers | 5,852 |

These figures reflect the current processed dataset and its filtering rules. They should not be interpreted as audited financial results.

## Key Business Insights

- The United Kingdom contributes the largest share of merchandise revenue in the processed data.
- Repeat buyers represent approximately 72.4% of identified customers.
- Monthly revenue varies over time, with prominent peaks around November.
- Transaction-quality checks identify negative quantities, zero-price records, and accounting adjustments that require appropriate treatment.

## Data Processing

The analysis includes data inspection, missing-value checks, transaction-quality investigation, revenue calculations, aggregation, and customer segmentation.

Cancellation-style invoices, negative quantities, non-positive prices, and selected non-merchandise descriptions were excluded from the preliminary merchandise dataset. These filtering choices affect the reported metrics and should be considered when interpreting the results.

## Backend API

Start the backend from the project root with the appropriate Python environment activated:

```bash
python -m uvicorn backend.main:app --reload
```

API documentation:

- `http://127.0.0.1:8000/docs`

Available endpoints:

- `/api/kpis`
- `/api/monthly-sales`
- `/api/country-sales`
- `/api/customer-segmentation`
- `/api/customer-summary`

## Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

Keep the backend running in its own terminal while testing the dashboard.

## Installation Notes

- Use a supported Python version and install the backend dependencies from `backend/requirements.txt` if needed.
- Use a compatible Node.js version for the installed Next.js project.
- Place the source Excel workbook in `data/raw/` before rerunning the analysis.
- Do not commit virtual environments, `node_modules`, secrets, or private credentials.

## Future Improvements

- Deploy the frontend and API to production hosting.
- Add date-range filters and product-level analysis.
- Improve API error handling and automated tests.
- Add reproducible data-processing scripts and data validation checks.
- Document dataset attribution and licensing.
- Add dashboard screenshots and a live demo link.

## Author

**Vengala Divyamsh Sai**

Retail analytics, data visualization, Python development, and full-stack dashboard development.
