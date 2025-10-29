import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TambahData() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    NomorSIP: "",
    NamaPemilik: "",
    NamaPT: "",
    Brand: "",
    Kualifikasi: "",
    TanggalBerlaku: "",
    TanggalBerakhir: "",
    Kewarganegaraan: "",
  });

  const [showSuccess, setShowSuccess] = useState(false); // Pop-up sukses

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔗 Ganti dengan URL Apps Script kamu
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwXsfbvs-0iFNl2MrWaRIuHvCuapkxiRJ-E1iw0DfH7yEZzc_Pg6lbM0c7OKSnHGWD3zw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(form).toString(),
        }
      );

      const result = await response.json();

      if (result.result === "Success") {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/"); // kembali ke halaman utama
        }, 2000);
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Gagal kirim data", error);
      alert("⚠️ Terjadi kesalahan saat menambahkan data.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded-lg relative">
      <h2 className="text-xl font-bold mb-4 text-center">
        Tambah Data Sertifikat
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {[
          { label: "Nomor SIP", name: "NomorSIP" },
          { label: "Nama Pemilik", name: "NamaPemilik" },
          { label: "Nama PT", name: "NamaPT" },
          { label: "Brand", name: "Brand" },
          { label: "Kualifikasi", name: "Kualifikasi" },
          { label: "Tanggal Berlaku", name: "TanggalBerlaku", type: "date" },
          { label: "Tanggal Berakhir", name: "TanggalBerakhir", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        {/* 🟢 Dropdown Kewarganegaraan */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Kewarganegaraan
          </label>
          <select
            name="Kewarganegaraan"
            value={form.Kewarganegaraan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Pilih --</option>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan
        </button>
      </form>

      {/* 🎉 Pop-up sukses */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              ✅ Data Berhasil Ditambahkan!
            </h3>
            <p className="text-gray-600">Anda akan diarahkan ke halaman utama...</p>
          </div>
        </div>
      )}
    </div>
  );
}
