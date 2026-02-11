import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function AddDokumenPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [namaDokumen, setNamaDokumen] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!namaDokumen || !file) {
            Swal.fire("Oops", "Nama dokumen dan file wajib diisi", "warning");
            return;
        }
        if (!user?.id || !user?.company_id) {
            Swal.fire("Error", "User tidak valid, silakan login ulang", "error");
            return;
        }
        const formData = new FormData();
        formData.append("pegawai_id", String(user.id));
        formData.append("company_id", String(user.company_id));
        formData.append("nama_dokumen", namaDokumen);
        formData.append("keterangan", keterangan);
        formData.append("file", file);
        try {
            setLoading(true);
            await api.post("/dokumen-pegawai", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Dokumen berhasil diupload",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/home-pegawai");
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Upload Dokumen" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, value: user?.name || "Tidak ada nama", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Dokumen" }), _jsx("input", { type: "text", placeholder: "Contoh: Surat Keterangan Kerja", value: namaDokumen, onChange: (e) => setNamaDokumen(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Keterangan (Opsional)" }), _jsx("textarea", { rows: 3, placeholder: "Keterangan tambahan", value: keterangan, onChange: (e) => setKeterangan(e.target.value), className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "File Dokumen" }), _jsxs("div", { className: "border-2 border-dashed rounded-2xl p-4 text-center hover:border-indigo-400 transition", children: [_jsx("input", { type: "file", className: "hidden", id: "file", accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx", onChange: (e) => setFile(e.target.files?.[0] || null) }), _jsx("label", { htmlFor: "file", className: "cursor-pointer", children: file ? (_jsxs("p", { className: "text-sm font-medium text-gray-700", children: ["\uD83D\uDCC4 ", file.name] })) : (_jsxs("div", { className: "flex flex-col items-center gap-2 text-gray-500", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center", children: "\uD83D\uDCCE" }), _jsx("p", { className: "text-sm font-medium", children: "Upload file dokumen" }), _jsx("p", { className: "text-xs text-gray-400", children: "PDF / JPG / PNG / DOC" })] })) })] })] })] }), _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-md disabled:opacity-60", children: loading ? "Mengupload..." : "Simpan Dokumen" })] })] }));
}
