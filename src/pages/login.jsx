// src/pages/login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import bck1 from "../assets/bck2.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect ke dashboard
    } catch (err) {
      setError("Login gagal. Periksa email/password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bck1})` }}
    >
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        {/* === FORM LOGIN === */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Login
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded text-center md:text-left">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Masukkan email kamu"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-white font-semibold transition duration-300 shadow"
              style={{
                background: "linear-gradient(to right, #91C233, #FFD700)",
              }}
            >
              Login
            </button>
          </form>
        </div>

        {/* === GAMBAR SAMPING (HILANG DI MOBILE) === */}
        <div
          className="hidden md:block md:w-1/2 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${bck1})`,
          }}
        ></div>
      </div>
    </div>
  );
}
