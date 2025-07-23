import TenantTable from '../components/TenantTable';

export default function Tenants() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Tenants</h2>
      <p className="text-gray-600">Daftar tenant akan ditampilkan di sini.</p>
      <TenantTable/>
    </section>
  );
}
