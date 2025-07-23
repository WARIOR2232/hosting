import { useEffect, useState } from "react";

export default function TenantTable() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://script.google.com/macros/s/AKfycbxN992z4Uy9eoPrCAl9wPQ0aDGIs2A50adQD2FDyA3ElCzM344kuACGGm2Za3V9NT23Qg/exec"; // ganti dengan link kamu
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTenants(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nama</th>
            <th className="px-4 py-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="px-4 py-2 border text-center">{tenant.id}</td>
              <td className="px-4 py-2 border">{tenant.nama}</td>
              <td className="px-4 py-2 border">{tenant.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
