
export default function Investments() {
  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    nama: "Budi",
    email: "budi@example.com",
    pesan: "Halo ini pesan dari React",
  };

  const url = "https://script.google.com/macros/s/AKfycbyHAYn87NJvcZ3C7pEAbbRrpWAL0OrthTr2gnVdWPWM2pp58G7QmQHth51k0sQ_bd58/exec"; // Ganti dengan URL milikmu

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result);
    alert("Data berhasil dikirim!");
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal mengirim data");
  }
};

  return (
    <section className="p-4">
      <form onSubmit={handleSubmit}>
  <input type="text" name="nama" placeholder="Nama" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="pesan" placeholder="Pesan" required />
  <button type="submit">Kirim</button>
</form>

    </section>
  );
}
