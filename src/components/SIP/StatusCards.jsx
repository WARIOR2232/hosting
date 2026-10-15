import StatCard from "./StatCard";
import { summarize } from "./useSipData";

export default function StatusCards({ rows }) {
  const s = summarize(rows);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-800">Status SIP</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Aktif" value={s.aktif} note="SIP aktif tanpa warning masa berlaku" accent="border-t-green-600" />
        <StatCard label="Akan Expired" value={s.akan} note="Tetap dihitung aktif bersih" accent="border-t-amber-500" />
        <StatCard label="Expired" value={s.expired} note="Dikeluarkan dari aktif bersih" accent="border-t-red-600" />
        <StatCard label="Dicabut" value={s.dicabut} note="Dikeluarkan dari aktif bersih" accent="border-t-slate-500" />
      </div>
    </section>
  );
}