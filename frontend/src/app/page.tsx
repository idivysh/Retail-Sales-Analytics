"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API = "http://127.0.0.1:8000";

type KPI = {
  Metric: string;
  Value: number;
};

type Monthly = {
  month: string;
  merchandise_revenue: number;
  quantity_sold: number;
  invoice_count: number;
};

type Country = {
  country: string;
  merchandise_revenue: number;
  quantity_sold: number;
  invoice_count: number;
  unique_customers: number;
};

type Segment = {
  customer_type: string;
  customer_count: number;
  total_revenue: number;
  average_revenue: number;
  customer_percentage: number;
};

const EMERALD = "#38D996";
const CHAMPAGNE = "#D8B36A";
const COLORS = [EMERALD, CHAMPAGNE];

const money = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);

const number = (n: number) => n.toLocaleString("en-IN");

const shortMonth = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });

const tooltipStyle = {
  backgroundColor: "#121A15",
  border: "1px solid #2A3B30",
  borderRadius: 12,
  color: "#E9EFE8",
  padding: "10px 14px",
};

export default function Home() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [monthly, setMonthly] = useState<Monthly[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("All");
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const endpoints = [
          "/api/kpis",
          "/api/monthly-sales",
          "/api/country-sales",
          "/api/customer-segmentation",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) => fetch(`${API}${endpoint}`))
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("One or more API endpoints returned an error.");
        }

        const [k, m, c, s] = await Promise.all(
          responses.map((response) => response.json())
        );

        setKpis(k);
        setMonthly(m);
        setCountries(c);
        setSegments(s);
      } catch {
        setError(
          "Could not load dashboard data. Make sure your FastAPI server is running on port 8000."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    const sectionIds = [
      "overview",
      "sales",
      "countries",
      "customers",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const visibleMonthly =
    period === "All" ? monthly : monthly.slice(-Number(period));

  const revenue =
    kpis.find((k) => k.Metric.toLowerCase().includes("revenue"))?.Value ?? 0;

  const units =
    kpis.find((k) => k.Metric.toLowerCase().includes("units"))?.Value ?? 0;

  const invoices =
    kpis.find((k) => k.Metric.toLowerCase().includes("invoices"))?.Value ?? 0;

  const customers =
    kpis.find((k) => k.Metric.toLowerCase().includes("customers"))?.Value ?? 0;

  const totalSegmentCustomers = segments.reduce(
    (sum, item) => sum + item.customer_count,
    0
  );

  const repeatCustomers =
    segments.find((s) =>
      s.customer_type.toLowerCase().includes("repeat")
    )?.customer_count ?? 0;

  const repeatPercentage = totalSegmentCustomers
    ? (repeatCustomers / totalSegmentCustomers) * 100
    : 0;

  return (
    <main className="min-h-screen bg-[#090D0C] text-[#E9EFE8]">
      <div className="flex min-h-screen">
        {/* Fixed sidebar */}
        <aside className="dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-white/[0.07] px-5 py-7 lg:flex">
          <a href="#overview" className="mb-12 flex items-center gap-3">
            <span className="brand-mark">R</span>

            <span>
              <span className="block text-lg font-bold tracking-tight">
                Retail<span className="text-[#38D996]">IQ</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#829387]">
                SALES INTELLIGENCE
              </span>
            </span>
          </a>

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#65776A]">
            Workspace
          </p>

          <nav className="space-y-2 text-sm">
            {[
              { id: "overview", label: "Overview", icon: "◈" },
              { id: "sales", label: "Sales analytics", icon: "↗" },
              {
                id: "countries",
                label: "Country performance",
                icon: "◎",
              },
              {
                id: "customers",
                label: "Customer insights",
                icon: "♧",
              },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`sidebar-link ${
                  activeSection === item.id ? "active" : ""
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  error ? "bg-red-400" : "bg-[#38D996]"
                } shadow-[0_0_10px_#38D996]`}
              />
              <span className="text-xs font-semibold">
                {error ? "Connection issue" : "System operational"}
              </span>
            </div>

            <p className="text-xs leading-5 text-[#91A397]">
              FastAPI connected
              <br />
              Analytics services online
            </p>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-[#38D996] to-[#D8B36A]" />
            </div>
          </div>
        </aside>

        {/* Main dashboard */}
        <section
          id="overview"
          className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:ml-[250px] lg:px-10"
        >
          <header className="mb-9 flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#38D996]">
                <span className="h-px w-6 bg-[#38D996]" />
                Business intelligence
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Retail overview<span className="text-[#38D996]">.</span>
              </h1>

              <p className="mt-3 text-sm text-[#A0AEA3]">
                Your sales performance, products and customers in one place.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/[0.09] bg-[#111915] px-4 py-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  error ? "bg-red-400" : "bg-[#38D996]"
                } shadow-[0_0_10px_#38D996]`}
              />

              <span className="text-xs font-medium">
                {error
                  ? "Connection issue"
                  : loading
                    ? "Connecting..."
                    : "API connected"}
              </span>
            </div>
          </header>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="dashboard-panel flex min-h-56 items-center justify-center rounded-2xl">
              <div className="text-sm text-[#91A397]">
                Loading your retail analytics...
              </div>
            </div>
          ) : (
            <>
              {/* KPI section */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="section-label">Performance snapshot</p>
                <p className="text-[11px] text-[#91A397]">
                  Based on processed dataset
                </p>
              </div>

              <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  label="Merchandise revenue"
                  value={money(revenue)}
                  note="Total merchandise sales"
                  symbol="↗"
                  accent="green"
                  featured
                />

                <KpiCard
                  label="Units sold"
                  value={number(units)}
                  note="Recorded sales quantity"
                  symbol="▤"
                  accent="gold"
                />

                <KpiCard
                  label="Unique invoices"
                  value={number(invoices)}
                  note="Distinct transactions"
                  symbol="▧"
                  accent="green"
                />

                <KpiCard
                  label="Identified customers"
                  value={number(customers)}
                  note="Customers with an ID"
                  symbol="♧"
                  accent="gold"
                />
              </div>

              {/* Sales chart controls */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="section-label">Sales performance</p>

                <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-[#111915] p-1">
                  {[
                    { label: "6M", value: "6" },
                    { label: "12M", value: "12" },
                    { label: "All", value: "All" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setPeriod(item.value)}
                      className={`rounded-lg px-3 py-2 text-xs transition-colors duration-200 ${
                        period === item.value
                          ? "bg-[#1B2D24] text-[#38D996]"
                          : "text-[#91A397] hover:bg-white/[0.04] hover:text-[#E9EFE8]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Revenue and customer charts */}
              <div className="mb-6 grid grid-cols-1 gap-5 2xl:grid-cols-[1.65fr_1fr]">
                <article
                  id="sales"
                  className="dashboard-panel min-w-0 rounded-2xl p-5 sm:p-6"
                >
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold">
                        Revenue over time
                      </h2>
                      <p className="mt-1 text-xs text-[#91A397]">
                        Monthly merchandise revenue
                      </p>
                    </div>

                    <span className="rounded-lg border border-[#38D996]/20 bg-[#38D996]/[0.07] px-3 py-2 text-[10px] font-medium tracking-wide text-[#38D996]">
                      MONTHLY
                    </span>
                  </div>

                  <div className="h-[290px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={visibleMonthly}
                        margin={{ top: 8, right: 8, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={EMERALD}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={EMERALD}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#29372E"
                          strokeDasharray="3 5"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          tickFormatter={shortMonth}
                          tick={{ fill: "#91A397", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          minTickGap={25}
                        />

                        <YAxis
                          tickFormatter={(v) =>
                            `${(v / 1000).toFixed(0)}k`
                          }
                          tick={{ fill: "#91A397", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(value) => [
                            money(Number(value)),
                            "Revenue",
                          ]}
                          labelFormatter={(label) =>
                            shortMonth(String(label))
                          }
                        />

                        <Area
                          type="monotone"
                          dataKey="merchandise_revenue"
                          stroke={EMERALD}
                          strokeWidth={2.5}
                          fill="url(#revenueGradient)"
                          dot={false}
                          activeDot={{
                            r: 5,
                            fill: CHAMPAGNE,
                            stroke: "#090D0C",
                            strokeWidth: 2,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article
                  id="customers"
                  className="dashboard-panel min-w-0 rounded-2xl p-5 sm:p-6"
                >
                  <h2 className="text-base font-semibold">
                    Customer segments
                  </h2>

                  <p className="mt-1 text-xs text-[#91A397]">
                    One-time vs repeat buyers
                  </p>

                  <div className="relative mt-3 h-[230px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segments}
                          dataKey="customer_count"
                          nameKey="customer_type"
                          innerRadius={66}
                          outerRadius={94}
                          paddingAngle={5}
                          stroke="none"
                        >
                          {segments.map((segment, index) => (
                            <Cell
                              key={segment.customer_type}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(value, name) => [
                            number(Number(value)),
                            String(name),
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">
                        {repeatPercentage.toFixed(1)}%
                      </span>
                      <span className="mt-1 text-[10px] font-medium tracking-wider text-[#91A397]">
                        REPEAT BUYERS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {segments.map((segment, index) => (
                      <div
                        key={segment.customer_type}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-sm"
                            style={{
                              background: COLORS[index % COLORS.length],
                            }}
                          />

                          <span className="text-xs text-[#A0AEA3]">
                            {segment.customer_type}
                          </span>
                        </div>

                        <span className="text-xs font-semibold">
                          {number(segment.customer_count)}
                          <span className="ml-2 text-[#91A397]">
                            {segment.customer_percentage.toFixed(1)}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              {/* Geographic insights */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="section-label">Geographic insights</p>
                <span className="text-[10px] font-medium tracking-wide text-[#91A397]">
                  TOP COUNTRIES BY REVENUE
                </span>
              </div>

              <article
                id="countries"
                className="dashboard-panel mb-8 rounded-2xl p-5 sm:p-6"
              >
                <div className="mb-6">
                  <h2 className="text-base font-semibold">
                    Country performance
                  </h2>
                  <p className="mt-1 text-xs text-[#91A397]">
                    Merchandise revenue by country
                  </p>
                </div>

                <div className="h-[310px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={countries.slice(0, 8)}
                      layout="vertical"
                      margin={{ top: 0, right: 22, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#29372E"
                        strokeDasharray="3 5"
                        horizontal={false}
                      />

                      <XAxis
                        type="number"
                        tickFormatter={(v) =>
                          `${(v / 1000).toFixed(0)}k`
                        }
                        tick={{ fill: "#91A397", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        type="category"
                        dataKey="country"
                        width={105}
                        tick={{ fill: "#C0CCC2", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [
                          money(Number(value)),
                          "Revenue",
                        ]}
                      />

                      <Bar
                        dataKey="merchandise_revenue"
                        radius={[0, 6, 6, 0]}
                        maxBarSize={24}
                      >
                        {countries.slice(0, 8).map((country, index) => (
                          <Cell
                            key={country.country}
                            fill={index === 0 ? CHAMPAGNE : EMERALD}
                            fillOpacity={index === 0 ? 1 : 0.75}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[11px] text-[#75867A]">
                <span>Retail Sales Analytics &amp; Customer Insights</span>
                <span>
                  Built with Next.js · FastAPI · Pandas · Recharts
                </span>
              </footer>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
  note,
  symbol,
  accent,
  featured = false,
}: {
  label: string;
  value: string;
  note: string;
  symbol: string;
  accent: "green" | "gold";
  featured?: boolean;
}) {
  const color = accent === "gold" ? CHAMPAGNE : EMERALD;

  return (
    <article
      className={`kpi-card ${featured ? "kpi-featured" : ""}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[#A0AEA3]">{label}</p>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{
            color,
            backgroundColor: `${color}12`,
            border: `1px solid ${color}28`,
          }}
        >
          {symbol}
        </span>
      </div>

      <p className="break-words text-2xl font-bold tracking-tight text-[#E9EFE8] sm:text-[28px]">
        {value}
      </p>

      <p className="mt-3 text-[11px] text-[#91A397]">{note}</p>

      <div className="mt-5 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full w-[38%] rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      </div>
    </article>
  );
}
