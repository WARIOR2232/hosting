import StatCard from "./StatCard";
import { summarize } from "./useSipData";

const GROUPS = [
  { label: "Dokter WNA", fn: (r) => r.kelompok === "Dokter" && r.wn === "WNA" },
  { label: "Dokter WNI", fn: (r) => r.kelompok === "Dokter" && r.wn === "WNI" },
  { label: "Tenaga Kesehatan WNA", fn: (r) => r.kelompok !== "Dokter" && r.wn === "WNA" },
  { label: "Tenaga Kesehatan WNI", fn: (r) => r.kelompok !== "Dokter" && r.wn === "WNI" },
];

export default function BreakdownKelompok({ rows }) {
  const data = GROUPS.map((g) => ({ label: g.label, ...summarize(rows.filter(g.fn)) }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-800">
        Breakdown Berdasarkan Kewarganegaraan &amp; Kelompok Tenaga
      </h3>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.map((d) => (
          <StatCard
            key={d.label}
            label={d.label}
            value={d.total}
            note={d.total ? `Aktif bersih ${d.bersih}` : "Tidak terdapat data SIP"}
          />
        ))}
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-100 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">Kelompok</th>
              <th className="px-3 py-2 text-right">Total SIP</th>
              <th className="px-3 py-2 text-right">Aktif Bersih</th>
              <th className="px-3 py-2 text-right">Aktif</th>
              <th className="px-3 py-2 text-right">Akan Expired</th>
              <th className="px-3 py-2 text-right">Expired</th>
              <th className="px-3 py-2 text-right">Dicabut</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-slate-200">
                <td className="px-3 py-2 font-semibold">{d.label}</td>
                <td className="px-3 py-2 text-right">{d.total}</td>
                <td className="px-3 py-2 text-right font-bold text-green-700">{d.bersih}</td>
                <td className="px-3 py-2 text-right">{d.aktif}</td>
                <td className="px-3 py-2 text-right font-bold text-amber-600">{d.akan}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">{d.expired}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">{d.dicabut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}