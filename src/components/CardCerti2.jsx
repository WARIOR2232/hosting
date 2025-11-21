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
import { Award, Layers, Users } from "lucide-react";

export default function CardCerti2() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbyUdOij65T8KQvfRLdiZJnuhXwQUhE0PSqyaJudi7cO3LoBjdWCvxFM2B_DPuRHtIi8/exec")
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

  const qualData =
    othersQual > 0
      ? [...top3Qual, { name: "Lainnya", value: othersQual }]
      : top3Qual;

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
    .slice(0, 5);

  // === WNI / WNA ===
  const nationalityCount = data.reduce(
    (acc, item) => {
      const key = item.Kewarganegaraan?.toLowerCase().trim();
      if (key === "wni") acc.wni++;
      else if (key === "wna") acc.wna++;
      else acc.tidakDiketahui++;
      return acc;
    },
    { wni: 0, wna: 0, tidakDiketahui: 0 }
  );

  const nationalityData = [
    { name: "WNI", value: nationalityCount.wni },
    { name: "WNA", value: nationalityCount.wna },
  ];

  const NATIONAL_COLORS = ["#16a34a", "#dc2626"];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* 🟦 KUALIFIKASI */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-700 font-semibold text-lg">
              SIP Berdasarkan Kualifikasi
            </h3>
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
                label={({ name, value, percent }) => {
                  const percentage = (percent * 100).toFixed(1);
                  const short = name.length > 22 ? name.slice(0, 22) + "..." : name;
                  return `${short} (${percentage}%)`;
                }}
              >
                {qualData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={QUAL_COLORS[index % QUAL_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => {
                  const total = qualData.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, name];
                }}
              />

              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🟨 BRAND */}
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
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#eab308" radius={[5, 5, 5, 5]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🟩 WNI / WNA */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-700 font-semibold text-lg">
              SIP Berdasarkan Kewarganegaraan
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={nationalityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label={({ name, value, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
              >
                {nationalityData.map((entry, index) => (
                  <Cell
                    key={`cell-national-${index}`}
                    fill={NATIONAL_COLORS[index % NATIONAL_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => {
                  const total = nationalityData.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, name];
                }}
              />

              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
