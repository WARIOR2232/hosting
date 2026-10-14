import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TambahData() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    NomorSIP: "",
    NamaPemilik: "",
    NamaPT: "",
    Brand: "",
    Kualifikasi: "",
    Kategori: "",
    KelompokTenaga: "",
    TanggalBerlaku: "",
    TanggalBerakhir: "",
    Kewarganegaraan: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwIrGsMgTBTG8bRhD8b9dCKgqSf_J1Vk0apEzuaVCMvVWi4FysVRO4QfK5gWY2DVOV8/exec",
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
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil ditambahkan.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: result.message || "Terjadi kesalahan.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Gagal kirim data", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan data.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Tambah Data SIP
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {[
          { label: "Nomor SIP", name: "NomorSIP" },
          { label: "Nama Pemilik", name: "NamaPemilik" },
          { label: "Nama PT", name: "NamaPT" },
          { label: "Brand", name: "Brand" },
          { label: "Kualifikasi", name: "Kualifikasi" },
          { label: "Kategori", name: "Kategori" },
          { label: "Kelompok Tenaga", name: "KelompokTenaga" },
          {
            label: "Tanggal Berlaku",
            name: "TanggalBerlaku",
            type: "date",
          },
          {
            label: "Tanggal Berakhir",
            name: "TanggalBerakhir",
            type: "date",
          },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">
              {label}
            </label>
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
            <option value="">-- Pilih Kewarganegaraan --</option>
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
    </div>
  );
}