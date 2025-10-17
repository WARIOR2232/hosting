import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import CertificateTable from "../components/TenantTable";
import CardCerti from "../components/CardCerti";
import { Link } from "react-router-dom";
import CardCerti2 from "../components/CardCerti2";

export default function Home() {
  const [data, setData] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwXsfbvs-0iFNl2MrWaRIuHvCuapkxiRJ-E1iw0DfH7yEZzc_Pg6lbM0c7OKSnHGWD3zw/exec")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);

        // Hitung jumlah status "Akan Expired"
        const count = result.filter(
          (item) => item.Status?.toLowerCase() === "akan expired"
        ).length;

        setNotifCount(count);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <section className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Dashboard</h2>

        {/* Ikon Notifikasi */}
        <Link
          to="/investments"
          className="relative p-2 rounded-full hover:bg-gray-100 transition duration-200 ease-in-out"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </Link>
      </div>

      <p className="mb-6 text-sm sm:text-base">
        Welcome paksabar nhahahai, <span className="font-medium">username yohohoohohohohoho</span>!
      </p>

      {/* Komponen lain */}
      <CardCerti data={data} />
      <CardCerti2 data={data} />
      <CertificateTable data={data} />
    </section>
  );
}
