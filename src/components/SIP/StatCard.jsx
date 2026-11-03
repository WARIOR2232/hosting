export default function StatCard({ label, value, note, accent = "border-t-teal-600", span2 = false }) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-slate-200 border-t-4 ${accent} bg-white p-4 ${
        span2 ? "col-span-2 lg:col-span-1" : ""
      }`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1.5 text-3xl font-bold leading-tight text-slate-900">{value}</p>
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  );
}
