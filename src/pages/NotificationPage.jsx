import { useEffect, useState } from "react";

export default function NotificationPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔹 URL Google Apps Script (Deploy Web App)
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPMnfrDkOyhTuppAEYjzwwlBcfM4h3ttYk9GSWPZDYUFXoUwN6gTUVP8kfzr5DronmOw/exec";

  // 🔹 Format tanggal ke format Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 🔹 Ambil data dari Google Sheets
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbypnD-6X_EWw7EVg-E-ZQR6RtyRzU-XBQvElZ8YWMbJcsdKvwustsRn6YFYFbjPDfAp/exec" //sama dengan tenant tabel
    )
      .then((res) => res.json())
      .then((result) => {
        const soonExpired = result.filter((item) => {
          const diff =
            (new Date(item.TanggalBerakhir) - new Date()) /
            (1000 * 60 * 60 * 24);
          return diff > 0 && diff <= 30;
        });
        setData(soonExpired);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Kirim semua email (massal)
  const handleSendAll = async () => {
    if (data.length === 0) return alert("Tidak ada data untuk dikirim.");
    setSending(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ allData: data }),
      });
      const text = await res.text();
      alert(text || "Email berhasil dikirim ke semua PT.");
    } catch (err) {
      alert("❌ Gagal mengirim email massal.");
    }
    setSending(false);
  };

  // 🔹 Kirim email untuk satu orang
  const handleSendSingle = async (item) => {
    setSending(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ singleData: item }),
      });
      const text = await res.text();
      alert(text || `Email untuk ${item.NamaPemilik} berhasil dikirim.`);
    } catch (err) {
      alert("❌ Gagal mengirim email untuk " + item.NamaPemilik);
    }
    setSending(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        🔔 Notifikasi SIP Akan Kadaluarsa
      </h2>

      {/* Tombol kirim semua */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSendAll}
          disabled={sending || data.length === 0}
          className={`${
            sending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-medium px-5 py-2 rounded-lg transition-all`}
        >
          {sending ? "Mengirim..." : "Kirim Semua Email"}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">
          🔄 Memuat data SIP...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b text-left">Nama Pemilik</th>
                <th className="py-2 px-4 border-b text-left">Nama PT</th>
                <th className="py-2 px-4 border-b text-left">
                  Tanggal Kadaluwarsa
                </th>
                <th className="py-2 px-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    ✅ Tidak ada SIP yang akan kadaluarsa dalam 30 hari.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="py-2 px-4 border-b">{item.NamaPemilik}</td>
                    <td className="py-2 px-4 border-b">{item.NamaPT}</td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(item.TanggalBerakhir)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleSendSingle(item)}
                        disabled={sending}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all"
                      >
                        Kirim Email
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
