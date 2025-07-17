export default function Home() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="mb-6">Welcome, <span className="font-medium">username</span>!</p>

      {/* Contoh konten */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-white shadow">Card 1 hai </div>
        <div className="p-6 rounded-lg bg-white shadow">Card 2</div>
        <div className="p-6 rounded-lg bg-white shadow">Card 3</div>
      </div>
    </section>
  );
}
