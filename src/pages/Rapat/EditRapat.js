import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
export default function EditRapat() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        company_id: "",
        nama_pertemuan: "",
        tanggal_rapat: "",
        waktu_mulai: "",
        waktu_selesai: "",
        lokasi: "",
        detail_pertemuan: "",
        jenis_pertemuan: "",
        file_notulen: null,
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [existingFile, setExistingFile] = useState(null);
    // FETCH COMPANY
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get("/companies", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompanies(res.data.data || res.data);
            }
            catch (err) {
                console.error("Gagal fetch companies:", err);
            }
        };
        fetchCompanies();
    }, []);
    // FETCH RAPAT BY ID
    useEffect(() => {
        const fetchRapat = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/rapat/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data.data;
                setForm({
                    company_id: data.company_id ?? "",
                    nama_pertemuan: data.nama_pertemuan ?? "",
                    tanggal_rapat: data.tanggal_rapat ?? "",
                    waktu_mulai: data.waktu_mulai ? data.waktu_mulai.slice(0, 5) : "",
                    waktu_selesai: data.waktu_selesai ? data.waktu_selesai.slice(0, 5) : "",
                    lokasi: data.lokasi ?? "",
                    detail_pertemuan: data.detail_pertemuan ?? "",
                    jenis_pertemuan: data.jenis_pertemuan ?? "",
                    file_notulen: null,
                });
                setExistingFile(data.file_notulen
                    ? `${import.meta.env.VITE_API_URL}/storage/${data.file_notulen}`
                    : null);
                setLoading(false);
            }
            catch (err) {
                console.error("Gagal fetch rapat:", err);
                setLoading(false);
            }
        };
        fetchRapat();
    }, [id]);
    // INPUT HANDLER
    const handleChange = (e) => {
        const { name, value } = e.target;
        // KHUSUS INPUT TIME → pastikan hanya HH:mm
        if (name === "waktu_mulai" || name === "waktu_selesai") {
            const clean = value.substring(0, 5);
            setForm({ ...form, [name]: clean });
            return;
        }
        setForm({ ...form, [name]: value });
    };
    const handleFile = (e) => {
        setForm({ ...form, file_notulen: e.target.files?.[0] || null });
    };
    // SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "file_notulen")
                return;
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });
        if (form.file_notulen) {
            formData.append("file_notulen", form.file_notulen);
        }
        try {
            const token = localStorage.getItem("token");
            await api.post(`/rapat/${id}?_method=PUT`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Berhasil", "Rapat berhasil diperbarui", "success");
            navigate("/rapat");
        }
        catch (err) {
            console.log("VALIDATION ERROR:", err.response?.data);
            Swal.fire("Error", JSON.stringify(err.response?.data, null, 2), "error");
        }
    };
    if (loading)
        return _jsx("p", { className: "p-4", children: "Loading..." });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Rapat", description: "Form edit rapat" }), _jsx(PageHeader, { pageTitle: "Edit Rapat", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/rapat"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx(ComponentCard, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 p-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Nama Pertemuan" }), _jsx("input", { type: "text", name: "nama_pertemuan", value: form.nama_pertemuan, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal" }), _jsx("input", { type: "date", name: "tanggal_rapat", value: form.tanggal_rapat, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Jam Mulai" }), _jsx("input", { type: "time", name: "waktu_mulai", value: form.waktu_mulai, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Jam Selesai" }), _jsx("input", { type: "time", name: "waktu_selesai", value: form.waktu_selesai, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Lokasi" }), _jsx("input", { type: "text", name: "lokasi", value: form.lokasi, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Jenis Pertemuan" }), _jsxs("select", { name: "jenis_pertemuan", value: form.jenis_pertemuan, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Jenis" }), _jsx("option", { value: "offline", children: "Offline" }), _jsx("option", { value: "online", children: "Online" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Detail Pertemuan" }), _jsx("textarea", { name: "detail_pertemuan", rows: 4, value: form.detail_pertemuan, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "File Notulen (Opsional)" }), _jsxs("div", { className: "\n                border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-[80px] cursor-pointer transition\n                bg-gray-50 hover:bg-gray-100 border-gray-300\n                dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600", onClick: () => document.getElementById("file_notulen")?.click(), children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-gray-500 mb-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16V4a1 1 0 011-1h4l5 5v8a1 1 0 01-1 1H7a1 1 0 01-1-1z" }) }), _jsx("p", { className: "text-gray-700 dark:text-gray-200 font-medium", children: form.file_notulen ? form.file_notulen.name : "Klik untuk upload file" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Format: PDF, DOC, DOCX (Max 5 MB)" }), _jsx("input", { id: "file_notulen", type: "file", accept: ".pdf,.doc,.docx", onChange: handleFile, className: "hidden" })] }), existingFile && (_jsxs("div", { className: "\n                border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-[80px] cursor-pointer transition\n                bg-gray-50 hover:bg-gray-100 border-gray-300\n                dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600", children: [_jsx("p", { className: "text-gray-700 dark:text-gray-200", children: "File Saat Ini:" }), _jsx("a", { href: existingFile, target: "_blank", className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Lihat Notulen" })] }))] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg", children: "Update Rapat" })] }) })] }));
}
