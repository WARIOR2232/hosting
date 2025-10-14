import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FileText, Clock, BarChart3 } from "lucide-react";

export default function CardCerti() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec")
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  const total = data.length;
  const active = data.filter((item) => item.Status === "AKTIF").length;
  const expired = data.filter((item) => item.Status === "EXPIRED").length;
  const expiring = data.filter((item) => item.Status === "AKAN EXPIRED").length;

  const pieData = [
    { name: "Active", value: active },
    { name: "Expiring Soon", value: expiring },
    { name: "Expired", value: expired },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <section className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

        {/* 🟩 CARD 1 */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-start text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-green-50 cursor-pointer min-h-[320px]">
          {/* Header: icon + title */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-green-600" />
            <h3 className="text-gray-700 font-semibold text-5xl">Total Certificates</h3>
          </div>
          <h2 className="text-7xl font-bold text-gray-800 mt-8">{total}</h2>
        </div>

        {/* 🟨 CARD 2 */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-start text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-green-50 cursor-pointer min-h-[320px]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-10 h-10 text-yellow-500" />
            <h3 className="text-gray-700 font-semibold text-5xl">Expiring Soon</h3>
          </div>
          <div className="leading-tight mt-6 space-y-2">
            <p className="text-4xl font-semibold text-yellow-500">{expiring} Akan Expired</p>
            <p className="text-4xl font-semibold text-red-500">{expired} Expired</p>
            <p className="text-4xl font-semibold text-green-600">{active} Aktif</p>
          </div>
        </div>

        {/* 🟦 CARD 3 */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-start text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-green-50 cursor-pointer min-h-[320px]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-9 h-9 text-blue-500" />
            <h3 className="text-gray-700 font-semibold text-5xl">Status</h3>
          </div>
          <PieChart width={220} height={200}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

      </div>
    </section>
  );
}
