import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function AddCutiPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [preview, setPreview] = useState(null);
    const [jenisCuti, setJenisCuti] = useState("");
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [tanggalSelesai, setTanggalSelesai] = useState(null);
    const [alasan, setAlasan] = useState("");
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (!jenisCuti || !tanggalMulai || !alasan) {
            Swal.fire("Oops", "Lengkapi semua data wajib", "warning");
            return;
        }
        if (!user?.id || !user?.company_id) {
            Swal.fire("Error", "User tidak valid, silakan login ulang", "error");
            return;
        }
        const formData = new FormData();
        formData.append("pegawai_id", String(user.id));
        formData.append("company_id", String(user.company_id));
        // DATA LAIN
        formData.append("jenis_cuti", jenisCuti);
        formData.append("tanggal_mulai", formatDate(tanggalMulai));
        if (tanggalSelesai) {
            formData.append("tanggal_selesai", formatDate(tanggalSelesai));
        }
        formData.append("alasan", alasan);
        if (foto) {
            formData.append("foto", foto);
        }
        try {
            setLoading(true);
            await api.post("/cuti", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pengajuan cuti berhasil dikirim",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/cuti-izin");
        }
        catch (err) {
            console.error(err?.response?.data);
            Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const handleFotoChange = (file) => {
        setFoto(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        else {
            setPreview(null);
        }
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Ajukan Cuti" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100", value: user?.name || "Tidak ada nama" })] }), _jsx("label", { className: "text-sm text-gray-600", children: "Kategori" }), _jsxs("select", { className: "w-full border rounded-xl px-4 py-3", value: jenisCuti, onChange: (e) => setJenisCuti(e.target.value), children: [_jsx("option", { value: "", children: "-- Pilih Jenis Cuti --" }), _jsx("option", { value: "cuti", children: "Cuti" }), _jsx("option", { value: "izin_masuk", children: "Izin Masuk" }), _jsx("option", { value: "izin_telat", children: "Izin Telat" }), _jsx("option", { value: "izin_pulang_cepat", children: "Izin Pulang Cepat" }), _jsx("option", { value: "sakit", children: "Sakit" }), _jsx("option", { value: "melahirkan", children: "Melahirkan" })] }), _jsx("label", { className: "text-sm text-gray-600", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: tanggalMulai, onChange: setTanggalMulai, dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Mulai", className: "w-full border rounded-xl px-4 py-3" }), _jsx("label", { className: "text-sm text-gray-600", children: "Tanggal Selesai" }), _jsx(DatePicker, { selected: tanggalSelesai, onChange: setTanggalSelesai, dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Selesai", className: "w-full border rounded-xl px-4 py-3", minDate: tanggalMulai ?? undefined }), _jsx("label", { className: "text-sm text-gray-600", children: "Alasan Cuti" }), _jsx("textarea", { placeholder: "Alasan cuti", className: "w-full border rounded-xl px-4 py-3", rows: 4, value: alasan, onChange: (e) => setAlasan(e.target.value) }), _jsx("label", { className: "text-sm text-gray-600", children: "Foto Pendukung (Opsional)" }), _jsxs("div", { className: "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer hover:border-indigo-400 transition", children: [_jsx("input", { type: "file", accept: "image/*", className: "hidden", id: "foto", onChange: (e) => handleFotoChange(e.target.files?.[0] || null) }), _jsx("label", { htmlFor: "foto", className: "cursor-pointer", children: preview ? (_jsxs("div", { className: "relative", children: [_jsx("img", { src: preview, alt: "Preview", className: "mx-auto h-40 object-cover rounded-xl shadow" }), _jsx("button", { type: "button", onClick: (e) => {
                                                        e.preventDefault();
                                                        handleFotoChange(null);
                                                    }, className: "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow", children: "Hapus" })] })) : (_jsxs("div", { className: "flex flex-col items-center gap-2 text-gray-500", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center", children: "\uD83D\uDCF7" }), _jsx("p", { className: "text-sm font-medium", children: "Upload foto pendukung" }), _jsx("p", { className: "text-xs text-gray-400", children: "JPG / PNG \u2022 Max 2MB" })] })) })] })] }), _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-md disabled:opacity-60", children: loading ? "Mengirim..." : "Ajukan Cuti" })] })] }));
}
