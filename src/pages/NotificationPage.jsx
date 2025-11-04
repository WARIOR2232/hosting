import { useEffect, useState } from "react";

export default function NotificationPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 URL Google Apps Script
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPMnfrDkOyhTuppAEYjzwwlBcfM4h3ttYk9GSWPZDYUFXoUwN6gTUVP8kfzr5DronmOw/exec";

  // 🔹 Format tanggal Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 🔹 Ambil data dari Google Sheet
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbypnD-6X_EWw7EVg-E-ZQR6RtyRzU-XBQvElZ8YWMbJcsdKvwustsRn6YFYFbjPDfAp/exec"
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
        setFiltered(soonExpired);
      })
      .catch(() => showToast("Gagal memuat data.", "error"))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Toast sederhana
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Pencarian Nama Pemilik / PT
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (!value) {
      setFiltered(data);
      return;
    }
    const filteredData = data.filter(
      (item) =>
        item.NamaPemilik?.toLowerCase().includes(value) ||
        item.NamaPT?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  // 🔹 Konfirmasi kirim email semua
  const handleSendAll = async () => {
    if (filtered.length === 0)
      return showToast("Tidak ada data untuk dikirim.", "error");

    const confirmSend = window.confirm(
      `Anda yakin ingin mengirim email ke ${filtered.length} penerima?`
    );
    if (!confirmSend) return;

    setSending(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ allData: filtered }),
      });
      const text = await res.text();
      showToast(text || "Email berhasil dikirim ke semua PT.");
    } catch {
      showToast("Gagal mengirim email massal.", "error");
    }
    setSending(false);
  };

  // 🔹 Konfirmasi kirim email satuan
  const handleSendSingle = async (item) => {
    const confirmSend = window.confirm(
      `Kirim email ke ${item.NamaPemilik} (${item.NamaPT})?`
    );
    if (!confirmSend) return;

    setSending(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ singleData: item }),
      });
      const text = await res.text();
      showToast(text || `Email untuk ${item.NamaPemilik} berhasil dikirim.`);
    } catch {
      showToast(`Gagal mengirim email untuk ${item.NamaPemilik}`, "error");
    }
    setSending(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* ✅ Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-md z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
        🔔 Notifikasi SIP Akan Kadaluarsa
      </h2>

      {/* 🔍 Kolom Pencarian */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Cari berdasarkan nama pemilik atau PT..."
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSendAll}
          disabled={sending || filtered.length === 0}
          className={`${
            sending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-medium px-5 py-2 rounded-lg transition-all w-full sm:w-auto`}
        >
          {sending ? "Mengirim..." : "Kirim Semua Email"}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">
          🔄 Memuat data SIP...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          ❌ Tidak ada hasil untuk pencarian atau tidak ada data kadaluarsa.
        </div>
      ) : (
        // ✅ TABEL RESPONSIF
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm sm:text-base">
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
              {filtered.map((item, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
