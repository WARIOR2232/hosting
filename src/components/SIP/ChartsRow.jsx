import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { tally } from "./useSipData";

const COLORS = ["#0f766e", "#2563eb", "#d97706", "#9333ea", "#db2777", "#94a3b8"];

function DonutCard({ title, data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl border border-slate-200 border-t-4 border-t-teal-600 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{title}</p>
      {total === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">Belum ada data</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="75%" paddingAngle={2}>
                {data.map((d, i) => (
                  <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} (${((v / total) * 100).toFixed(1)}%)`, n]} />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const toPie = (pairs) => pairs.map(([name, value]) => ({ name, value }));

export default function ChartsRow({ rows }) {
  const kualifikasi = toPie(tally(rows, "kualifikasi").slice(0, 5)); // Top 5

  const fas = tally(rows, "fasilitas");
  const fasilitas = toPie(fas.slice(0, 5));
  const lainnya = fas.slice(5).reduce((sum, [, v]) => sum + v, 0);
  if (lainnya) fasilitas.push({ name: "Lainnya", value: lainnya });

  const wn = toPie(tally(rows, "wn"));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-800">Grafik Ringkasan</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <DonutCard title="Top 5 kualifikasi" data={kualifikasi} />
        <DonutCard title="SIP per fasilitas" data={fasilitas} />
        <DonutCard title="Kewarganegaraan" data={wn} />
      </div>
    </section>
  );
}