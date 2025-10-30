import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/EditModal";
import Select from "react-select";
import * as XLSX from "xlsx"; // ✅ Tambahan Export to Excel
import { saveAs } from "file-saver"; // ✅ Tambahan Export to Excel

export default function CertificateTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedPT, setSelectedPT] = useState("Semua");
  const [selectedKualifikasi, setSelectedKualifikasi] = useState("Semua");

  // modal / edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const itemsPerPage = 15;
  const navigate = useNavigate();

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbypnD-6X_EWw7EVg-E-ZQR6RtyRzU-XBQvElZ8YWMbJcsdKvwustsRn6YFYFbjPDfAp/exec";

    // ✅ Fetch data (ganti URL dengan Apps Script kamu)
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbypnD-6X_EWw7EVg-E-ZQR6RtyRzU-XBQvElZ8YWMbJcsdKvwustsRn6YFYFbjPDfAp/exec") // contoh: https://script.google.com/macros/s/xxx/exec
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetch data:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Tambahan Export to Excel
  const handleExport = () => {
    // 1️⃣ Ubah data JSON ke worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // 2️⃣ Buat workbook dan tambahkan worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataSIP");

    // 3️⃣ Tulis workbook ke buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // 4️⃣ Buat file dan trigger download
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DataSIP.xlsx");
  };
  // fetch
  const fetchData = () => {
    setLoading(true);
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((result) => {
        setData(result || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateForTable = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (isNaN(d)) return isoString;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const toInputDate = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (!isNaN(d)) return d.toISOString().split("T")[0];
    const parts = String(value).split(/[\/\-\.]/);
    if (parts.length === 3 && parts[2].length === 4) {
      const [d1, m1, y1] = parts;
      return `${y1}-${m1.padStart(2, "0")}-${d1.padStart(2, "0")}`;
    }
    return "";
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "akan expired":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // delete
  const handleDelete = async (row) => {
    if (!window.confirm(`Yakin ingin menghapus data ${row.NamaPemilik}?`)) return;
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "delete",
          rowNumber: row.rowNumber,
        }),
      });
      fetchData();
    } catch (err) {
      console.error("hapus gagal", err);
    }
  };

  // open edit modal
  const handleEdit = (row) => {
    const prepared = {
      ...row,
      TanggalBerlaku: toInputDate(row.TanggalBerlaku),
      TanggalBerakhir: toInputDate(row.TanggalBerakhir),
    };
    setSelectedData(prepared);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedData(null);
  };

  // save edited data (jaga tanggal berakhir tetap sama)
  const handleSaveEdit = async (updatedData) => {
    if (
      !updatedData.TanggalBerakhir ||
      updatedData.TanggalBerakhir !== selectedData.TanggalBerakhir
    ) {
      alert("⚠️ Tanggal berakhir tidak boleh kosong atau diubah!");
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "edit",
          rowNumber: updatedData.rowNumber,
          ...updatedData,
        }),
      });

      handleCloseModal();
      fetchData();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("update gagal", err);
    }
  };

  // filters
  const uniqueNamaPT = ["Semua", ...new Set(data.map((i) => i.NamaPT))];
  const uniqueKualifikasi = ["Semua", ...new Set(data.map((i) => i.Kualifikasi))];

  const filteredData = data.filter((row) => {
    const matchesName = row.NamaPemilik?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || row.Status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPT = selectedPT === "Semua" || row.NamaPT === selectedPT;
    const matchesKualifikasi =
      selectedKualifikasi === "Semua" || row.Kualifikasi === selectedKualifikasi;
    return matchesName && matchesStatus && matchesPT && matchesKualifikasi;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Certificate List</h2>
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daftar Surat Izin Praktik</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Cari berdasarkan nama pemilik..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <Select
          className="w-full md:w-1/3"
          options={uniqueNamaPT.map((pt) => ({ value: pt, label: pt }))}
          onChange={(selected) => {
            setSelectedPT(selected?.value || "Semua");
            setCurrentPage(1);
          }}
          placeholder="Pilih atau ketik Nama PT..."
          isSearchable
          isClearable
        />

        <Select
          className="w-full md:w-1/3"
          options={uniqueKualifikasi.map((k) => ({ value: k, label: k }))}
          onChange={(selected) => {
            setSelectedKualifikasi(selected?.value || "Semua");
            setCurrentPage(1);
          }}
          placeholder="Pilih atau ketik Kualifikasi..."
          isSearchable
          isClearable
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="Semua">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Akan Expired">Akan Expired</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nomor SIP</th>
            <th className="px-4 py-3">Nama Pemilik</th>
            <th className="px-3.5 py-3">Pelaku Usaha</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Kualifikasi</th>
            <th className="px-4 py-3">Kewarganegaraan</th>
            <th className="px-9 py-3">Tanggal Berlaku</th>
            <th className="px-9 py-3">Tanggal Berakhir</th>
            <th className="px-6 py-3">Sisa Hari</th>
            <th className="px-9 py-3">Status</th>
            <th className="px-9 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={row.rowNumber ?? index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 text-center">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{row.NomorSIP}</td>
              <td className="px-4 py-2">{row.NamaPemilik}</td>
              <td className="px-4 py-2">{row.NamaPT}</td>
              <td className="px-4 py-2">{row.Brand}</td>
              <td className="px-4 py-2">{row.Kualifikasi}</td>
              <td className="px-4 py-2 text-center">{row.Kewarganegaraan}</td>
              <td className="px-4 py-2 text-center">{formatDateForTable(row.TanggalBerlaku)}</td>
              <td className="px-4 py-2 text-center">{formatDateForTable(row.TanggalBerakhir)}</td>
              <td className="px-1 py-2 text-center">{row.SisaHari}</td>
              <td className="px-1 py-2 text-center">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(row.Status)}`}>
                  {row.Status}
                </span>
              </td>
              <td className="px-2 py-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(row)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={12} className="text-center py-6 text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-blue-100"
          }`}
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-blue-100"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Tombol Tambah Data */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/TambahData")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          + Tambah Data Baru
        </button>
      </div>

      {/* Modal Edit */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        selectedData={selectedData}
      />

      {/* Toast sukses */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✅ Data berhasil diperbarui!
        </div>
      )}
    </div>
  );
}
