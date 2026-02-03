import { useEffect, useMemo, useRef, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwbr7UhsH-HxKcucDjxa6rGRAbdA09ElHNwwS9aKgOyGn69bOO1nK2u8j9__e0u1p7R/exec";

const ROWS_PER_PAGE = 15;

export default function RPTKATable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FILTER =================
  const [lokasiFilter, setLokasiFilter] = useState(new Set());
  const [brandFilter, setBrandFilter] = useState(new Set());
  const [ptFilter, setPtFilter] = useState(new Set());

  // ================= PAGINATION =================
  const [page, setPage] = useState(1);

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      const res = await fetch(API_URL + "?t=" + Date.now());
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    load();
  }, []);

  // ================= UNIQUE OPTIONS =================
  const getUnique = (key) =>
    [...new Set(data.map((d) => d[key]).filter(Boolean))];

  // ================= FILTER LOGIC =================
  const filtered = useMemo(() => {
    return data.filter((d) => {
      const lokasiOK =
        lokasiFilter.size === 0 || lokasiFilter.has(d.Lokasi);
      const brandOK =
        brandFilter.size === 0 || brandFilter.has(d.Brand);
      const ptOK =
        ptFilter.size === 0 || ptFilter.has(d.NamaPT);

      return lokasiOK && brandOK && ptOK;
    });
  }, [data, lokasiFilter, brandFilter, ptFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filtered.slice(start, start + ROWS_PER_PAGE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1); // reset kalau filter berubah
  }, [lokasiFilter, brandFilter, ptFilter]);

  const toggle = (val, setter, current) => {
    const newSet = new Set(current);
    newSet.has(val) ? newSet.delete(val) : newSet.add(val);
    setter(newSet);
  };

  const statusColor = (s) => {
    if (s?.toLowerCase().includes("aktif"))
      return "bg-green-200 text-green-800";
    if (s?.toLowerCase().includes("expired"))
      return "bg-red-200 text-red-800";
    return "bg-yellow-200 text-yellow-800";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4">

      {/* ================= FILTER DROPDOWN ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        <DropdownFilter
          title="Lokasi KEK"
          list={getUnique("Lokasi")}
          selected={lokasiFilter}
          onChange={(v) => toggle(v, setLokasiFilter, lokasiFilter)}
        />
        <DropdownFilter
          title="Brand"
          list={getUnique("Brand")}
          selected={brandFilter}
          onChange={(v) => toggle(v, setBrandFilter, brandFilter)}
        />
        <DropdownFilter
          title="Nama PT"
          list={getUnique("NamaPT")}
          selected={ptFilter}
          onChange={(v) => toggle(v, setPtFilter, ptFilter)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow overflow-auto">

        <table className="min-w-full text-sm table-fixed">

          {/* HEADER HIJAU */}
          <thead className="bg-green-600 text-white sticky top-0 z-10">
            <tr className="text-left">
              {[
                "No",
                "Nomor",
                "Pemilik",
                "Jabatan",
                "Pelaku Usaha",
                "Brand",
                "Lokasi",
                "Kewarganegaraan",
                "Sisa Hari",
                "Status",
                "Link",
              ].map((h) => (
                <th key={h} className="p-3 font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, i) => (
<tr
  key={i}
  className="border-b odd:bg-gray-50 hover:bg-green-50 text-sm"
>
  {/* No */}
  <td className="p-2 text-center w-12">
    {(page - 1) * ROWS_PER_PAGE + i + 1}
  </td>

  {/* Nomor */}
  <td className="p-2 max-w-[150px] break-words">
    {item.NomorRPTKA}
  </td>

  {/* Nama */}
  <td className="p-2 max-w-[170px] break-words">
    {item.NamaPemilik}
  </td>

  {/* Jabatan (wrap kebawah) */}
  <td className="p-2 max-w-[200px] whitespace-normal break-words">
    {item.Jabatan}
  </td>

  {/* PT */}
  <td className="p-2 max-w-[150px] break-words">
    {item.NamaPT}
  </td>

  {/* Brand */}
  <td className="p-2 max-w-[140px] break-words">
    {item.Brand}
  </td>

  {/* Lokasi */}
  <td className="p-2 max-w-[120px] break-words">
    {item.Lokasi}
  </td>

  {/* Kewarganegaraan */}
  <td className="p-2 text-center w-[90px]">
    {item.Kewarganegaraan}
  </td>

  {/* Sisa Hari */}
  <td className="p-2 text-center w-[100px] font-medium">
    {item.SisaHari}
  </td>

  {/* Status */}
  <td className="p-2 text-center w-[90px]">
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(
        item.Status
      )}`}
    >
      {item.Status}
    </span>
  </td>

  {/* Link */}
  <td className="p-2 text-center w-[80px]">
    <a
      href={item.LinkRPTKA}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline font-medium"
    >
      View
    </a>
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-2 items-center">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100"
        >
          ← Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
}




/* =================================================
   DROPDOWN CHECKLIST FILTER
================================================= */
function DropdownFilter({ title, list, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded-xl px-3 py-2 bg-white shadow flex justify-between items-center"
      >
        <span>
          {title}
          {selected.size > 0 && (
            <span className="ml-2 text-xs bg-green-600 text-white px-2 rounded-full">
              {selected.size}
            </span>
          )}
        </span>
        {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-52 overflow-auto p-2 space-y-1">
          {list.map((item) => (
            <label
              key={item}
              className="flex gap-2 text-sm hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(item)}
                onChange={() => onChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
