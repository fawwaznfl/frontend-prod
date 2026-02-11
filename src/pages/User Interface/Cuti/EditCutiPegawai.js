import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function EditCutiPegawai() {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [preview, setPreview] = useState(null);
    const [existingFoto, setExistingFoto] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const [jenisCuti, setJenisCuti] = useState("");
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [tanggalSelesai, setTanggalSelesai] = useState(null);
    const [alasan, setAlasan] = useState("");
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    // ================= FETCH DETAIL =================
    useEffect(() => {
        if (!id)
            return;
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/cuti/${id}`);
                const data = res.data.data ?? res.data;
                setJenisCuti(data.jenis_cuti);
                setTanggalMulai(data.tanggal_mulai
                    ? new Date(`${data.tanggal_mulai}T00:00:00`)
                    : null);
                setTanggalSelesai(data.tanggal_selesai
                    ? new Date(`${data.tanggal_selesai}T00:00:00`)
                    : null);
                setAlasan(data.alasan || "");
                if (data.foto) {
                    setExistingFoto(data.foto);
                    setPreview(`${STORAGE_URL}/${data.foto}`);
                }
            }
            catch (err) {
                Swal.fire("Error", "Data cuti tidak ditemukan", "error");
                navigate(-1);
            }
            finally {
                setLoadingPage(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);
    // ================= FOTO =================
    const handleFotoChange = (file) => {
        setFoto(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
        else {
            setPreview(existingFoto
                ? `${STORAGE_URL}/${existingFoto}`
                : null);
        }
    };
    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!jenisCuti || !tanggalMulai || !alasan) {
            Swal.fire("Oops", "Lengkapi semua data wajib", "warning");
            return;
        }
        const formData = new FormData();
        formData.append("jenis_cuti", jenisCuti);
        formData.append("tanggal_mulai", tanggalMulai.toISOString().slice(0, 10));
        if (tanggalSelesai) {
            formData.append("tanggal_selesai", tanggalSelesai.toISOString().slice(0, 10));
        }
        formData.append("alasan", alasan);
        if (foto) {
            formData.append("foto", foto);
        }
        try {
            setLoading(true);
            await api.post(`/cuti/${id}?_method=PUT`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pengajuan cuti berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/cuti-izin");
        }
        catch (err) {
            Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    // ================= LOADING PAGE =================
    if (loadingPage) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center text-gray-500", children: "Memuat data cuti..." }));
    }
    // ================= UI =================
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Edit Pengajuan Cuti" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { readOnly: true, value: user?.name || "-", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsx("label", { className: "text-sm text-gray-600", children: "Kategori" }), _jsxs("select", { value: jenisCuti, onChange: (e) => setJenisCuti(e.target.value), className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "", children: "-- Pilih Jenis Cuti --" }), _jsx("option", { value: "tahunan", children: "Tahunan" }), _jsx("option", { value: "sakit", children: "Sakit" }), _jsx("option", { value: "melahirkan", children: "Melahirkan" }), _jsx("option", { value: "penting", children: "Penting" }), _jsx("option", { value: "lainnya", children: "Lainnya" })] }), _jsx("label", { className: "text-sm text-gray-600", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: tanggalMulai, onChange: setTanggalMulai, dateFormat: "yyyy-MM-dd", className: "w-full border rounded-xl px-4 py-3" }), _jsx("label", { className: "text-sm text-gray-600", children: "Tanggal Selesai" }), _jsx(DatePicker, { selected: tanggalSelesai, onChange: setTanggalSelesai, dateFormat: "yyyy-MM-dd", minDate: tanggalMulai ?? undefined, className: "w-full border rounded-xl px-4 py-3" }), _jsx("label", { className: "text-sm text-gray-600", children: "Alasan" }), _jsx("textarea", { value: alasan, onChange: (e) => setAlasan(e.target.value), rows: 4, className: "w-full border rounded-xl px-4 py-3" }), _jsx("label", { className: "text-sm text-gray-600", children: "Foto Pendukung" }), _jsxs("div", { className: "border-2 border-dashed rounded-2xl p-4 text-center", children: [_jsx("input", { type: "file", id: "foto", accept: "image/*", className: "hidden", onChange: (e) => handleFotoChange(e.target.files?.[0] || null) }), _jsx("label", { htmlFor: "foto", className: "cursor-pointer", children: preview ? (_jsx("img", { src: preview, alt: "Foto Cuti", className: "mx-auto h-40 object-cover rounded-xl shadow" })) : (_jsx("p", { className: "text-sm text-gray-400", children: "Klik untuk upload foto" })) })] })] }), _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full disabled:opacity-60", children: loading ? "Menyimpan..." : "Simpan Perubahan" })] })] }));
}
