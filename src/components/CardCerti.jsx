import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function CardCerti() {
  const [data, setData] = useState([]);

 useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      });
  }, []);

  const total = data.length;
  const active = data.filter(item => item.Status === "AKTIF").length;
  const expired = data.filter(item => item.Status === "EXPIRED").length;
  const expiring = data.filter(item => item.Status === "AKAN EXPIRED").length;

  const pieData = [
    { name: "Active", value: active },
    { name: "Expiring Soon", value: expiring },
    { name: "Expired", value: expired },
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 rounded-lg bg-white shadow">
          <p className="text-gray-500">Total Certificates</p>
          <h2 className="text-3xl font-bold text-gray-800">{total}</h2>
        </div>
        <div className="p-6 rounded-lg bg-white shadow">
          <p className="text-gray-500">Expiring Soon</p>
          <h2 className="text-3xl font-bold text-yellow-500 uppercase">{expiring} akan expired</h2>
          <h2 className="text-3xl font-bold text-red-500">{expired} EXPIRED</h2>
          <h2 className="text-3xl font-bold text-black-500">{active} AKTIF</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow ">
        <h3 className="text-lg font-semibold mb-4">Status Comparison</h3>
        <PieChart width={300} height={200}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} label dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow w-full md:w-1/2">
        <h3 className="text-lg font-semibold mb-4">Status Comparison</h3>
        <PieChart width={300} height={200}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} label dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div> */}
    </section>
  );
}
