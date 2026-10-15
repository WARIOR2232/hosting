import { useSipData } from "./useSipData";
import SummaryCards from "./SummaryCards";
import BreakdownKelompok from "./BreakdownKelompok";
import StatusCards from "./StatusCards";
import BreakdownFasilitas from "./BreakdownFasilitas";
import ChartsRow from "./ChartsRow";

export default function SipDashboard() {
  const { rows, loading, error } = useSipData();

  if (loading) return <p className="mt-4 text-slate-500">Memuat data SIP...</p>;
  if (error) return <p className="mt-4 text-red-600">Gagal memuat data: {error}</p>;

  return (
    <div className="mt-4 space-y-4">
      <SummaryCards rows={rows} />
      <BreakdownKelompok rows={rows} />
      <StatusCards rows={rows} />
      <BreakdownFasilitas rows={rows} />
      <ChartsRow rows={rows} />
    </div>
  );
}