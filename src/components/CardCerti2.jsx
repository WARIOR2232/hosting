import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Award, Layers } from "lucide-react";

export default function CardCerti2() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbypnD-6X_EWw7EVg-E-ZQR6RtyRzU-XBQvElZ8YWMbJcsdKvwustsRn6YFYFbjPDfAp/exec")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  // === KUALIFIKASI CHART ===
  const qualificationCount = data.reduce((acc, item) => {
    const key = item.Kualifikasi?.trim() || "Tidak diketahui";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sortedQual = Object.entries(qualificationCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const top3Qual = sortedQual.slice(0, 3);
  const othersQual = sortedQual.slice(3).reduce((sum, item) => sum + item.value, 0);
  const qualData = othersQual > 0 ? [...top3Qual, { name: "Lainnya", value: othersQual }] : top3Qual;

  const QUAL_COLORS = ["#3b82f6", "#22c55e", "#eab308", "#9ca3af"];

  // === BRAND CHART ===
  const brandCount = data.reduce((acc, item) => {
    const key = item.Brand?.trim() || "Tidak diketahui";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sortedBrand = Object.entries(brandCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5

  return (
    <section className="mt-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🟦 KUALIFIKASI */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-700 font-semibold text-lg"> SIP Berdasarkan Kualifikasi</h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={qualData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                labelLine={false}
                label={({ name, value }) => {
                  const short = name.length > 22 ? name.slice(0, 22) + "..." : name;
                  return `${short} (${value})`;
                }}
              >
                {qualData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={QUAL_COLORS[index % QUAL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🟨 BRAND TERBANYAK */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-yellow-600" />
            <h3 className="text-gray-700 font-semibold text-lg">SIP Berdasarkan Brand</h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={sortedBrand}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#eab308" radius={[5, 5, 5, 5]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
