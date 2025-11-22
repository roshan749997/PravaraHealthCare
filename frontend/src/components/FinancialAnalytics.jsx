import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlySummary = [
  { month: "Jan", income: 38.5, expense: 32.1 },
  { month: "Feb", income: 40.2, expense: 33.6 },
  { month: "Mar", income: 42.8, expense: 34.9 },
  { month: "Apr", income: 44.4, expense: 36.8 },
  { month: "May", income: 39.8, expense: 37.2 },
  { month: "Jun", income: 45.6, expense: 38.8 },
  { month: "Jul", income: 47.1, expense: 39.4 },
  { month: "Aug", income: 49.3, expense: 40.2 },
  { month: "Sep", income: 48.7, expense: 41.1 },
  { month: "Oct", income: 51.2, expense: 42.3 },
  { month: "Nov", income: 52.4, expense: 43.5 },
  { month: "Dec", income: 54.1, expense: 44.9 },
];

const incomeBreakdown = [
  { label: "Salary", value: 142000 },
  { label: "Business", value: 168000 },
  { label: "Investment", value: 74500 },
];

const expenseBreakdown = [
  { name: "Housing", value: 40, color: "#A020F0" },
  { name: "Transportation", value: 25, color: "#D400FF" },
  { name: "Entertainment", value: 20, color: "#FF00CC" },
  { name: "Food", value: 10, color: "#A020F0" },
  { name: "Other", value: 5, color: "#D400FF" },
];

const forecastData = [
  { month: "Jan", income: 36, expense: 31 },
  { month: "Feb", income: 38, expense: 32 },
  { month: "Mar", income: 41, expense: 34 },
  { month: "Apr", income: 44, expense: 35 },
  { month: "May", income: 39, expense: 37 },
  { month: "Jun", income: 46, expense: 38 },
  { month: "Jul", income: 48, expense: 39 },
  { month: "Aug", income: 50, expense: 41 },
];

const metricCards = [
  { title: "Total Income", value: 384567.45, change: "+8.7%", tone: "text-[#A020F0]", chip: "bg-[#A020F0]/20" },
  { title: "Total Expenses", value: 328942.6, change: "-6.3%", tone: "text-[#FF00CC]", chip: "bg-[#FF00CC]/20" },
  { title: "Total Net Income", value: 55624.85, change: "+21.4%", tone: "text-[#A020F0]", chip: "bg-[#A020F0]/20" },
];

const incomeTotal = incomeBreakdown.reduce((sum, item) => sum + item.value, 0);
const expenseTotalTransactions = 130;
const formatCurrency = (amount) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function FinancialAnalytics() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gray-500">Analytics · Summary</p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Financial analytics</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[0.65rem] font-medium">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">All accounts</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">Monthly</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">2024</span>
        </div>
      </header>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[2.1fr_0.9fr]">
        <article className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Monthly Income & Expenses</h3>
              <p className="text-[0.65rem] text-gray-500">Income vs expenses · Jan - Dec</p>
            </div>
          </div>
          <div className="mt-4 h-44">
            <ResponsiveContainer>
              <BarChart 
                data={monthlySummary} 
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                barCategoryGap="15%"
                barGap={8}
              >
                <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#6B7280", fontSize: 10 }} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#6B7280", fontSize: 10 }} 
                  tickFormatter={(value) => `₹${value}L`}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const formattedValue = `₹${Number(value).toFixed(2)}L`;
                    return [formattedValue, name === "income" ? "Income" : "Expenses"];
                  }}
                  labelFormatter={(label) => `${label} 2024`}
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E5E7EB", 
                    borderRadius: "12px", 
                    color: "#111827",
                    padding: "8px 12px"
                  }}
                  itemStyle={{ padding: "4px 0" }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ color: "#111827", paddingTop: "5px", fontSize: "12px" }} 
                />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#6366F1" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  name="Expenses" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="grid gap-3">
          {metricCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gray-500">{card.title}</p>
              <p className="mt-2 text-xl font-semibold">{formatCurrency(card.value)}</p>
              <span className={`mt-1.5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.65rem] font-semibold text-gray-700`}>
                {card.change}
              </span>
            </div>
          ))}
        </aside>
      </div>

      <div className="grid gap-4 border-t border-gray-200 px-4 py-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Income Overview</h3>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gray-700">
              Categories
            </span>
          </div>
          <p className="mt-3 text-xl font-semibold">{formatCurrency(incomeTotal)}</p>
          <div className="mt-3 space-y-2.5">
            {incomeBreakdown.map((item, index) => {
              const percentage = Math.round((item.value / incomeTotal) * 100);
              const colors = ["#6366F1", "#60A5FA", "#10B981"];
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-semibold text-[0.65rem]">{formatCurrency(item.value)} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length],
                        boxShadow: `0 0 0 ${colors[index % colors.length]}40`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Expense Analysis</h3>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gray-700">
              Transactions
            </span>
          </div>
          <div className="mt-4 h-36">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "12px", color: "#111827" }}
                />
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="90%"
                  strokeWidth={0}
                >
                  {expenseBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="600">
                  {expenseTotalTransactions} Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-1.5 text-[0.65rem]">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Financial Forecast</h3>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gray-700">
              May focus
            </span>
          </div>
          <div className="mt-4 h-36">
            <ResponsiveContainer>
              <LineChart data={forecastData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#6B7280", fontSize: 10 }} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#6B7280", fontSize: 10 }} 
                  tickFormatter={(value) => `₹${value}L`}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [`₹${Number(value).toFixed(1)}L`, name === "income" ? "Income" : "Expenses"]}
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E5E7EB", 
                    borderRadius: "12px", 
                    color: "#111827",
                    padding: "8px 12px"
                  }}
                  itemStyle={{ padding: "4px 0" }}
                />
                <Legend iconType="line" wrapperStyle={{ color: "#111827", fontSize: "12px", paddingTop: "5px" }} />
                <ReferenceLine 
                  x="May" 
                  stroke="#9CA3AF" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3"
                  label={{ 
                    value: "May", 
                    position: "top", 
                    fill: "#111827",
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    padding: "0",
                    borderRadius: "0"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="none"
                  fill="url(#forecastGradient)"
                  fillOpacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={{ fill: "#6366F1", r: 4, strokeWidth: 2, stroke: "#FFFFFF" }}
                  activeDot={{ r: 6, fill: "#6366F1" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expenses" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "#FFFFFF" }}
                  activeDot={{ r: 6, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed text-gray-500">
            Expecting deficit in May. Consider saving more in April or optimizing leisure expenses.
          </p>
        </article>
      </div>
    </section>
  );
}

