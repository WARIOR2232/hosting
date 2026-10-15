import StatCard from "./StatCard";
import { summarize } from "./useSipData";

export default function SummaryCards({ rows }) {
  const s = summarize(rows);

  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold text-slate-800">
        Statistik Surat Izin Praktik (SIP)
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total SIP terdata" value={s.total} note="Seluruh SIP yang tercatat" />
        <StatCard label="SIP aktif bersih" value={s.bersih} note="Tidak termasuk Dicabut & Expired" accent="border-t-green-600" />
        <StatCard label="Aktif" value={s.aktif} note="Status AKTIF" accent="border-t-green-600" />
        <StatCard label="Akan expired" value={s.akan} note="Tetap masuk aktif bersih" accent="border-t-amber-500" />
        <StatCard
          label="Dicabut + Expired"
          value={s.dicabut + s.expired}
          note={`Dicabut ${s.dicabut} • Expired ${s.expired}`}
          accent="border-t-red-600"
        />
      </div>

      <div className="mt-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-2.5 text-sm text-slate-700">
        <b>Definisi hitung:</b> SIP Aktif Bersih adalah seluruh SIP yang tidak berstatus Dicabut dan
        tidak Expired. SIP berstatus Akan Expired tetap masuk angka aktif bersih, namun ditandai
        sebagai perhatian.
      </div>
    </section>
  );
}