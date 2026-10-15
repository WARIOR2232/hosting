import { summarize, tally } from "./useSipData";

export default function BreakdownFasilitas({ rows }) {
  const facilities = tally(rows, "fasilitas").map(([name]) => name);
  const count = (list, dokter, wn) =>
    list.filter((r) => (r.kelompok === "Dokter") === dokter && r.wn === wn).length;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-800">Breakdown per Fasilitas</h3>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-100 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">Fasilitas</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-right">Aktif Bersih</th>
              <th className="px-3 py-2 text-right">Dokter WNA</th>
              <th className="px-3 py-2 text-right">Dokter WNI</th>
              <th className="px-3 py-2 text-right">Nakes WNA</th>
              <th className="px-3 py-2 text-right">Nakes WNI</th>
              <th className="px-3 py-2 text-right">Akan Expired</th>
              <th className="px-3 py-2 text-right">Expired</th>
              <th className="px-3 py-2 text-right">Dicabut</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((name) => {
              const list = rows.filter((r) => r.fasilitas === name);
              const s = summarize(list);
              return (
                <tr key={name} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-semibold">{name}</td>
                  <td className="px-3 py-2 text-right">{s.total}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">{s.bersih}</td>
                  <td className="px-3 py-2 text-right">{count(list, true, "WNA")}</td>
                  <td className="px-3 py-2 text-right">{count(list, true, "WNI")}</td>
                  <td className="px-3 py-2 text-right">{count(list, false, "WNA")}</td>
                  <td className="px-3 py-2 text-right">{count(list, false, "WNI")}</td>
                  <td className="px-3 py-2 text-right font-bold text-amber-600">{s.akan}</td>
                  <td className="px-3 py-2 text-right font-bold text-red-600">{s.expired}</td>
                  <td className="px-3 py-2 text-right font-bold text-red-600">{s.dicabut}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}