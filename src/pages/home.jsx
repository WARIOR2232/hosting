import TenantTable from '../components/TenantTable';
import CardCerti from '../components/CardCerti';

export default function Home() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="mb-6">Welcome , <span className="font-medium">username </span>!</p>

      {/* Contoh konten */}
      <CardCerti/>
      <TenantTable/>
      
    </section>
  );
}
