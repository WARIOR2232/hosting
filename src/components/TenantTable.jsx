import { useEffect, useState } from "react";
import Select from "react-select";

export default function CertificateTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedPT, setSelectedPT] = useState("Semua");
  const [selectedKualifikasi, setSelectedKualifikasi] = useState("Semua");

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwXsfbvs-0iFNl2MrWaRIuHvCuapkxiRJ-E1iw0DfH7yEZzc_Pg6lbM0c7OKSnHGWD3zw/exec")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      });
  }, []);

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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 🔍 Ambil daftar unik Nama PT & Kualifikasi untuk dropdown
  const uniqueNamaPT = ["Semua", ...new Set(data.map((item) => item.NamaPT))];
  const uniqueKualifikasi = ["Semua", ...new Set(data.map((item) => item.Kualifikasi))];

  // 🔍 Filter data berdasarkan nama, status, PT, dan kualifikasi
  const filteredData = data.filter((row) => {
    const matchesName = row.NamaPemilik.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || row.Status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPT = selectedPT === "Semua" || row.NamaPT === selectedPT;
    const matchesKualifikasi =
      selectedKualifikasi === "Semua" || row.Kualifikasi === selectedKualifikasi;

    return matchesName && matchesStatus && matchesPT && matchesKualifikasi;
  });

  // 🔢 Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Certificate List</h2>

      {/* 🔍 Search & Filter Section */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
        {/* Input pencarian nama */}
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

        {/* Filter Nama PT */}
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

        {/* Filter Kualifikasi */}
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

        {/* Filter Status */}
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

      {/* 🧾 Tabel Data Sertifikat */}
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama Pemilik</th>
            <th className="px-3.5 py-3">Nama PT</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Kualifikasi</th>
            <th className="px-9 py-3">Tanggal Berlaku</th>
            <th className="px-9 py-3">Tanggal Berakhir</th>
            <th className="px-6 py-3">Sisa Hari</th>
            <th className="px-9 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 text-center">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{row.NamaPemilik}</td>
              <td className="px-4 py-2">{row.NamaPT}</td>
              <td className="px-4 py-2">{row.Brand}</td>
              <td className="px-4 py-2">{row.Kualifikasi}</td>
              <td className="px-4 py-2 text-center">{formatDate(row.TanggalBerlaku)}</td>
              <td className="px-4 py-2 text-center">{formatDate(row.TanggalBerakhir)}</td>
              <td className="px-1 py-2 text-center">{row.SisaHari}</td>
              <td className="px-1 py-2 text-center">
                <span
                  className={`text-xs font-semibold px-1 py-1 rounded-full ${getStatusStyle(
                    row.Status
                  )}`}
                >
                  {row.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⏩ Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          Next →
        </button>
      </div>

      {/* ➕ Tombol Tambah Data */}
      <div className="mt-6 flex justify-center">
        <a
          href="/TambahData"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          + Tambah Data Baru
        </a>
      </div>
    </div>
  );
}
