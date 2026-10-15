import { useEffect, useState } from "react";

export const API_URL =
  "https://script.google.com/macros/s/AKfycbwIrGsMgTBTG8bRhD8b9dCKgqSf_J1Vk0apEzuaVCMvVWi4FysVRO4QfK5gWY2DVOV8/exec";

// ⚠️ SESUAIKAN dengan nama kolom di JSON Google Sheet Anda.
// Tiap field boleh punya beberapa kemungkinan nama, yang pertama ditemukan dipakai.
const FIELD = {
  status: ["Status"],
  fasilitas: ["Brand"], // ganti ke ["NamaPT"] kalau ingin per PT
  kelompok: ["KelompokTenaga"],
  kualifikasi: ["Kualifikasi"],
  wn: ["Kewarganegaraan"],
};

const get = (item, keys) => {
  for (const k of keys) {
    if (item[k] !== undefined && item[k] !== null && item[k] !== "") return String(item[k]).trim();
  }
  return "";
};

export function normalizeRow(item) {
  const status = get(item, FIELD.status).toUpperCase();
  const kualifikasi = get(item, FIELD.kualifikasi) || "-";
  const kelompok = get(item, FIELD.kelompok);
  const wn = get(item, FIELD.wn).toUpperCase();

  return {
    fasilitas: get(item, FIELD.fasilitas) || "-",
    kualifikasi,
    // Tenaga Medis = Dokter, selain itu = Tenaga Kesehatan
    kelompok: /medis/i.test(kelompok) ? "Dokter" : "Tenaga Kesehatan",
    wn: wn && !/WNI|INDONESIA/.test(wn) ? "WNA" : "WNI",
    status: /CABUT/.test(status)
      ? "DICABUT"
      : /AKAN/.test(status)
      ? "AKAN EXPIRED"
      : /EXPIRED|KADALUWARSA|KEDALUWARSA/.test(status)
      ? "EXPIRED"
      : /AKTIF/.test(status)
      ? "AKTIF"
      : "",
  };
}

export function useSipData() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let off = false;
    fetch(API_URL)
      .then((res) => res.json())
      .then((result) => {
        if (!off) setRows((Array.isArray(result) ? result : []).map(normalizeRow));
      })
      .catch((e) => !off && setError(e.message || "Gagal memuat data"))
      .finally(() => !off && setLoading(false));
    return () => {
      off = true;
    };
  }, []);

  return { rows, loading, error };
}

// Hitung status. Aktif bersih = AKTIF + AKAN EXPIRED
export function summarize(rows) {
  const c = (s) => rows.filter((r) => r.status === s).length;
  const aktif = c("AKTIF");
  const akan = c("AKAN EXPIRED");
  return {
    total: rows.length,
    aktif,
    akan,
    expired: c("EXPIRED"),
    dicabut: c("DICABUT"),
    bersih: aktif + akan,
  };
}

// Hitung kemunculan nilai suatu field, urut terbanyak: [[nama, jumlah], ...]
export function tally(rows, key) {
  const map = {};
  rows.forEach((r) => (map[r[key]] = (map[r[key]] || 0) + 1));
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}