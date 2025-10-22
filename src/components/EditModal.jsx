import React, { useState, useEffect } from "react";

export default function EditModal({ data, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...data });

  // Pastikan tanggal diformat ke yyyy-mm-dd agar bisa tampil di input type="date"
  useEffect(() => {
    if (data.TanggalBerlaku)
      data.TanggalBerlaku = formatDate(data.TanggalBerlaku);
    if (data.TanggalBerakhir)
      data.TanggalBerakhir = formatDate(data.TanggalBerakhir);
    setFormData({ ...data });
  }, [data]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Edit Data Sertifikat
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Pemilik */}
          <div>
            <label className="block text-sm font-medium">Nama Pemilik</label>
            <input
              type="text"
              name="NamaPemilik"
              value={formData.NamaPemilik || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Nama PT */}
          <div>
            <label className="block text-sm font-medium">Nama PT</label>
            <input
              type="text"
              name="NamaPT"
              value={formData.NamaPT || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              type="text"
              name="Brand"
              value={formData.Brand || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Kualifikasi */}
          <div>
            <label className="block text-sm font-medium">Kualifikasi</label>
            <input
              type="text"
              name="Kualifikasi"
              value={formData.Kualifikasi || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Tanggal Berlaku */}
          <div>
            <label className="block text-sm font-medium">Tanggal Berlaku</label>
            <input
              type="date"
              name="TanggalBerlaku"
              value={formData.TanggalBerlaku || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Tanggal Berakhir */}
          <div>
            <label className="block text-sm font-medium">Tanggal Berakhir</label>
            <input
              type="date"
              name="TanggalBerakhir"
              value={formData.TanggalBerakhir || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
