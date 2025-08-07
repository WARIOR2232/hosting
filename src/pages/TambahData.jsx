import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TambahData() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    NamaPemilik: "",
    NamaPT: "",
    Brand: "",
    Kualifikasi: "",
    TanggalBerlaku: "",
    TanggalBerakhir: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwXsfbvs-0iFNl2MrWaRIuHvCuapkxiRJ-E1iw0DfH7yEZzc_Pg6lbM0c7OKSnHGWD3zw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(form).toString(),
      });

      const result = await response.json();

      if (result.result === "Success") {
        alert("Data berhasil ditambahkan!");
        navigate("/");
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Gagal kirim data", error);
      alert("Gagal menambahkan data.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Tambah Data Sertifikat</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {[
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
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
