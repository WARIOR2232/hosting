import { useEffect, useState } from "react";

export default function PelakuUsahaTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbycqA5MLEnUFujo6vDbssKgi-5gtcrRmNCHExUtTlUYXhrmCuRF7rhMSShDAjCeZN_k/exec") // ganti dengan URL milikmu
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar Pelaku Usaha</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">No</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((usaha, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{usaha["No"]}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
