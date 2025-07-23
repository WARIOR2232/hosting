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

  if (loading) return <p>Loading...</p>;

  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Email</th></tr>
      </thead>
      <tbody>
        {tenants.map((tenant, i) => (
          <tr key={i}>
            <td>{tenant.nama}</td>
            <td>{tenant.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
