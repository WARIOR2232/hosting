import { useEffect, useState } from "react";

export default function CertificateTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

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

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Certificate List</h2>
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
                <span className={`text-xs font-semibold px-1 py-1 rounded-full ${getStatusStyle(row.Status)}`}>
                  {row.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
  {/* Tombol Previous */}
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-3 py-1 border rounded ${
      currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-blue-100"
    }`}
  >
    ← Prev
  </button>

  {/* Nomor Halaman */}
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

  {/* Tombol Next */}
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className={`px-3 py-1 border rounded ${
      currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-blue-100"
    }`}
  >
    Next →
  </button>
</div>

    </div>
  );
}
