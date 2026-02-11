import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function AddVisitInPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [keterangan, setKeterangan] = useState("");
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [lokasi, setLokasi] = useState("");
    const [loading, setLoading] = useState(false);
    // ================= GET LOKASI =================
    useEffect(() => {
        if (!navigator.geolocation) {
            Swal.fire("Error", "Browser tidak mendukung GPS", "error");
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setLokasi(`${lat},${lng}`);
        }, () => {
            Swal.fire("Error", "Gagal mendapatkan lokasi", "error");
        });
    }, []);
    // ================= FOTO =================
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
    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!keterangan || !foto) {
            Swal.fire("Oops", "Lengkapi keterangan & foto", "warning");
            return;
        }
        if (!lokasi) {
            Swal.fire("Oops", "Lokasi belum tersedia", "warning");
            return;
        }
        const formData = new FormData();
        formData.append("pegawai_id", String(user.id));
        if (user.company_id) {
            formData.append("company_id", String(user.company_id));
        }
        formData.append("keterangan", keterangan);
        formData.append("lokasi_masuk", lokasi);
        if (foto) {
            formData.append("upload_foto", foto);
        }
        try {
            setLoading(true);
            await api.post("/kunjungan", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Visit In berhasil disimpan",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/kunjungan-pegawai");
        }
        catch (err) {
            Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Visit In" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { readOnly: true, value: user?.name || "", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Keterangan Kunjungan" }), _jsx("textarea", { rows: 4, value: keterangan, onChange: (e) => setKeterangan(e.target.value), placeholder: "Contoh: Kunjungan ke klien A", className: "w-full border rounded-xl px-4 py-3" })] }), _jsx("label", { className: "text-sm text-gray-600", children: "Foto Kunjungan" }), _jsxs("div", { className: "border-2 border-dashed rounded-2xl p-4 text-center", children: [_jsx("input", { type: "file", accept: "image/*", id: "foto", className: "hidden", onChange: (e) => handleFotoChange(e.target.files?.[0] || null) }), _jsx("label", { htmlFor: "foto", className: "cursor-pointer", children: preview ? (_jsxs("div", { className: "relative", children: [_jsx("img", { src: preview, className: "mx-auto h-40 object-cover rounded-xl shadow" }), _jsx("button", { type: "button", onClick: (e) => {
                                                        e.preventDefault();
                                                        handleFotoChange(null);
                                                    }, className: "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full", children: "Hapus" })] })) : (_jsxs("div", { className: "flex flex-col items-center gap-2 text-gray-500", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center", children: "\uD83D\uDCF7" }), _jsx("p", { className: "text-sm font-medium", children: "Upload foto kunjungan" }), _jsx("p", { className: "text-xs text-gray-400", children: "JPG / PNG \u2022 Max 2MB" })] })) })] })] }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-md disabled:opacity-60", children: loading ? "Menyimpan..." : "Simpan Visit In" })] })] }));
}
