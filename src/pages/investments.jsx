import { useEffect, useState } from "react";

export default function Notifikasi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec"; // ganti dgn URL kamu

  // Ambil data dari Google Sheet
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((result) => {
        // Filter hanya yg statusnya "Akan Expired"
        const filtered = result.filter(
          (item) => item.Status?.toLowerCase() === "akan expired"
        );
        setData(filtered);
      })
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

  // Fungsi kirim email otomatis
  const handleSendEmail = async () => {
    if (data.length === 0) {
      alert("Tidak ada data yang akan dikirim.");
      return;
    }

    if (!window.confirm("Kirim email ke semua Pelaku Usaha yang akan kadaluarsa?")) return;

    setLoading(true);
    try {
      for (const item of data) {
        await fetch(SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sendEmail", // tanda agar Apps Script tahu
            namaPT: item.NamaPT,
            namaPemilik: item.NamaPemilik,
            tanggalBerakhir: item.TanggalBerakhir,
            emailPU: item.EmailPU, // tidak ditampilkan di UI
          }),
        });
      }
      alert("✅ Semua email peringatan telah dikirim!");
    } catch (error) {
      alert("❌ Terjadi kesalahan saat mengirim email.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        🔔 Notifikasi SIP Akan Kadaluarsa
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleSendEmail}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Mengirim..." : "Kirim Email Peringatan"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama Pemilik</th>
              <th className="px-4 py-2">Nama PT</th>
              <th className="px-4 py-2">Tanggal Berakhir</th>
              <th className="px-4 py-2">Sisa Hari</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.NamaPemilik}</td>
                <td className="px-4 py-2">{item.NamaPT}</td>
                <td className="px-4 py-2">{item.TanggalBerakhir}</td>
                <td className="px-4 py-2">{item.SisaHari}</td>
                <td className="px-4 py-2 text-orange-600 font-semibold">
                  {item.Status}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data kadaluarsa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
