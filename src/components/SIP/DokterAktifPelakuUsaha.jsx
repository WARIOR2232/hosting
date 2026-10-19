import StatCard from "./StatCard";

// Hanya status AKTIF saja (expired, dicabut, akan expired tidak dihitung)
const AKTIF_ONLY = (rows) => rows.filter((r) => r.status === "AKTIF"|| r.status === "AKAN EXPIRED");

export default function DokterAktifPelakuUsaha({ rows }) {
  const aktif = AKTIF_ONLY(rows);

  // Ringkasan: Dokter aktif per kewarganegaraan
  const dokterWna = aktif.filter((r) => r.kelompok === "Dokter" && r.wn === "WNA").length;
  const dokterWni = aktif.filter((r) => r.kelompok === "Dokter" && r.wn === "WNI").length;
  const totalDokter = dokterWna + dokterWni;

  // Per pelaku usaha (fasilitas)
  const pelakuUsaha = [];
  const map = {};
  aktif.forEach((r) => {
    if (!map[r.fasilitas]) {
      map[r.fasilitas] = { label: r.fasilitas, wna: 0, wni: 0 };
      pelakuUsaha.push(map[r.fasilitas]);
    }
    if (r.kelompok === "Dokter") {
      if (r.wn === "WNA") map[r.fasilitas].wna++;
      else map[r.fasilitas].wni++;
    }
  });
  // urut berdasarkan total dokter aktif terbanyak
  pelakuUsaha.sort((a, b) => b.wna + b.wni - (a.wna + a.wni));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-800">
        Dokter Aktif per Pelaku Usaha (WNA &amp; WNI)
      </h3>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Total Dokter Aktif"
          value={totalDokter}
          note="Hanya SIP berstatus AKTIF & AKAN EXPIRED"
          accent="border-t-green-600"
        />
        <StatCard
          label="Dokter WNA Aktif"
          value={dokterWna}
          note="Dokter asing dengan SIP AKTIF & AKAN EXPIRED"
          accent="border-t-blue-600"
        />
        <StatCard
          label="Dokter WNI Aktif"
          value={dokterWni}
          note="Dokter Indonesia dengan SIP AKTIF & AKAN EXPIRED"
          accent="border-t-indigo-600"
        />
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-slate-100 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">Pelaku Usaha</th>
              <th className="px-3 py-2 text-right">Dokter WNA Aktif</th>
              <th className="px-3 py-2 text-right">Dokter WNI Aktif</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {pelakuUsaha.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                  Tidak terdapat dokter dengan SIP aktif
                </td>
              </tr>
            ) : (
              pelakuUsaha.map((p) => (
                <tr key={p.label} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-semibold">{p.label}</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700">{p.wna}</td>
                  <td className="px-3 py-2 text-right font-bold text-indigo-700">{p.wni}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-700">
                    {p.wna + p.wni}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
