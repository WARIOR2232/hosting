import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditModal({ isOpen, onClose, onSave, selectedData }) {
  const [formData, setFormData] = useState({
    NomorSIP: "",
    NamaPemilik: "",
    NamaPT: "",
    Brand: "",
    Kualifikasi: "",
    Kewarganegaraan: "",
    TanggalBerlaku: "",
    TanggalBerakhir: "",
  });

  // ===========================
  // NORMALISASI TANGGAL FIX
  // ===========================
  const normalizeToInputDate = (dateValue) => {
    if (!dateValue) return "";

    // Jika sudah berupa Date
    if (dateValue instanceof Date && !isNaN(dateValue)) {
      const y = dateValue.getFullYear();
      const m = String(dateValue.getMonth() + 1).padStart(2, "0");
      const d = String(dateValue.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    if (typeof dateValue === "string") {
      // ISO string "2025-11-27T00:00:00.000Z"
      if (dateValue.includes("T")) {
        const dt = new Date(dateValue);
        if (!isNaN(dt)) {
          const y = dt.getFullYear();
          const m = String(dt.getMonth() + 1).padStart(2, "0");
          const d = String(dt.getDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }
      }

      // Format YYYY-MM-DD
      const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) return dateValue;

      // Format DD/MM/YYYY atau DD-MM-YYYY
      const dmyMatch = dateValue.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmyMatch) {
        const d = dmyMatch[1].padStart(2, "0");
        const m = dmyMatch[2].padStart(2, "0");
        const y = dmyMatch[3];
        return `${y}-${m}-${d}`;
      }
    }

    return "";
  };

  // ===========================
  // SET FORM SAAT MODAL DIBUKA
  // ===========================
  useEffect(() => {
    if (selectedData) {
      setFormData({
        NomorSIP: selectedData.NomorSIP || "",
        NamaPemilik: selectedData.NamaPemilik || "",
        NamaPT: selectedData.NamaPT || "",
        Brand: selectedData.Brand || "",
        Kualifikasi: selectedData.Kualifikasi || "",
        Kewarganegaraan: selectedData.Kewarganegaraan || "",
        TanggalBerlaku: normalizeToInputDate(selectedData.TanggalBerlaku),
        TanggalBerakhir: normalizeToInputDate(selectedData.TanggalBerakhir),
      });
    }
  }, [selectedData]);

  // ===========================
  // HANDLE CHANGE INPUT
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================
  // SUBMIT + VALIDASI
  // ===========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.TanggalBerlaku || !formData.TanggalBerakhir) {
      Swal.fire({
        icon: "warning",
        title: "Tanggal wajib diisi",
        text: "Tanggal Berlaku dan Tanggal Berakhir tidak boleh kosong!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const payload = {
      ...formData,
      rowNumber: selectedData?.rowNumber,
    };

    onSave(payload);
    onClose();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil diperbarui",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          ✏️ Edit Data Sertifikat
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Nomor SIP</label>
            <input
              type="text"
              name="NomorSIP"
              value={formData.NomorSIP}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama Pemilik</label>
            <input
              type="text"
              name="NamaPemilik"
              value={formData.NamaPemilik}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama PT</label>
            <input
              type="text"
              name="NamaPT"
              value={formData.NamaPT}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              type="text"
              name="Brand"
              value={formData.Brand}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kualifikasi</label>
            <input
              type="text"
              name="Kualifikasi"
              value={formData.Kualifikasi}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kewarganegaraan</label>
            <input
              type="text"
              name="Kewarganegaraan"
              value={formData.Kewarganegaraan}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal Berlaku</label>
            <input
              type="date"
              name="TanggalBerlaku"
              value={formData.TanggalBerlaku}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal Berakhir</label>
            <input
              type="date"
              name="TanggalBerakhir"
              value={formData.TanggalBerakhir}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 w-full"
              required
            />
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Batal
            </button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
