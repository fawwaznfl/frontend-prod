import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function AddLaporanKerjaPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [informasiUmum, setInformasiUmum] = useState("");
    const [pekerjaan, setPekerjaan] = useState("");
    const [pekerjaanBelumDilaksanakan, setPekerjaanBelumDilaksanakan] = useState("");
    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);
    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!informasiUmum || !pekerjaan) {
            Swal.fire("Oops", "Informasi umum dan pekerjaan wajib diisi", "warning");
            return;
        }
        if (!user?.id || !user?.company_id) {
            Swal.fire("Error", "User tidak valid, silakan login ulang", "error");
            return;
        }
        try {
            setLoading(true);
            await api.post("/laporan-kerja", {
                pegawai_id: user.id,
                informasi_umum: informasiUmum,
                pekerjaan_dilaksanakan: pekerjaan,
                pekerjaan_belum_dilaksanakan: pekerjaanBelumDilaksanakan,
                catatan: catatan || null,
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Laporan kerja berhasil disimpan",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/laporan-kerja-pegawai");
        }
        catch (err) {
            console.error(err?.response?.data);
            Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    // ================= UI =================
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Tambah Laporan Kerja" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, value: user?.name || "Tidak ada nama", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Informasi Umum" }), _jsx("textarea", { rows: 3, placeholder: "Contoh: Laporan kerja harian tanggal 2 Januari 2026", value: informasiUmum, onChange: (e) => setInformasiUmum(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Pekerjaan yang Dilaksanakan" }), _jsx("textarea", { rows: 4, placeholder: "Jelaskan pekerjaan yang dilakukan hari ini", value: pekerjaan, onChange: (e) => setPekerjaan(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Pekerjaan Belum Selesai" }), _jsx("textarea", { rows: 4, placeholder: "Jelaskan pekerjaan yang belum diselesaikan", value: pekerjaanBelumDilaksanakan, onChange: (e) => setPekerjaanBelumDilaksanakan(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Catatan" }), _jsx("textarea", { rows: 3, placeholder: "Catatan tambahan", value: catatan, onChange: (e) => setCatatan(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] })] }), _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-md disabled:opacity-60", children: loading ? "Menyimpan..." : "Simpan Laporan" })] })] }));
}
