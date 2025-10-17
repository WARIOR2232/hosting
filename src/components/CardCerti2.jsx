import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { BarChart3, Award, Layers } from "lucide-react";

export default function CardCerti2() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);


  // === 2️⃣ KUALIFIKASI CHART ===
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

  // === 3️⃣ BRAND CHART ===
  const brandCount = data.reduce((acc, item) => {
    const key = item.Brand?.trim() || "Tidak diketahui";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sortedBrand = Object.entries(brandCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // 5 teratas

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Statistik Sertifikat</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 🟩 STATUS */}

        {/* 🟦 KUALIFIKASI */}
        <div className="bg-blue rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-7 h-7 text-blue-600" />
            <h3 className="text-gray-700 font-semibold text-xl">Kualifikasi Terbanyak</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={qualData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, value }) => `${name} (${value})`}
              >
                {qualData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={QUAL_COLORS[index % QUAL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🟨 BRAND TERBANYAK */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow-50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="w-7 h-7 text-yellow-600" />
            <h3 className="text-gray-700 font-semibold text-xl">Brand Terbanyak</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sortedBrand} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#eab308" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </section>
  );
}
