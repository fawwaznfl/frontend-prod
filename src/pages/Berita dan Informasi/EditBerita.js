import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
export default function EditBerita() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [companyId, setCompanyId] = useState("");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipe, setTipe] = useState("berita");
    const [judul, setJudul] = useState("");
    const [isi_konten, setIsiKonten] = useState("");
    const [tanggalPublikasi, setTanggalPublikasi] = useState("");
    const [gambar, setGambar] = useState(null);
    const [preview, setPreview] = useState(null);
    // =============================
    // FETCH COMPANIES
    // =============================
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
        }
    };
    // =============================
    // GET DATA BERITA
    // =============================
    const fetchData = async () => {
        try {
            const res = await api.get(`/berita/${id}`);
            const d = res.data.data;
            setCompanyId(d.company_id);
            setTipe(d.tipe);
            setJudul(d.judul);
            setIsiKonten(d.isi_konten);
            setTanggalPublikasi(d.tanggal_publikasi);
            setPreview(d.gambar_url);
        }
        catch (err) {
            console.error("Error get berita:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
        fetchData();
    }, []);
    // =============================
    // HANDLE IMAGE PREVIEW
    // =============================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setGambar(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };
    // =============================
    // SUBMIT (UPDATE)
    // =============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("company_id", companyId);
        formData.append("tipe", tipe);
        formData.append("judul", judul);
        formData.append("isi_konten", isi_konten);
        formData.append("tanggal_publikasi", tanggalPublikasi);
        if (gambar instanceof File) {
            formData.append("gambar", gambar);
        }
        try {
            const res = await api.post(`/berita/${id}?_method=PUT`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Berita berhasil diperbarui 🎉",
                timer: 1500,
                showConfirmButton: false,
            });
            setTimeout(() => navigate("/berita"), 1500);
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan!",
            });
            console.log("API Error:", error.response?.data);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Berita", description: "Edit Berita" }), _jsx(PageHeader, { pageTitle: "Edit Berita", titleClass: "text-[32px] dark:text-white" }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-6", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Company" }), _jsxs("select", { value: companyId, onChange: (e) => setCompanyId(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tanggal Publikasi" }), _jsx("input", { type: "date", value: tanggalPublikasi, onChange: (e) => setTanggalPublikasi(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tipe" }), _jsxs("select", { value: tipe, onChange: (e) => setTipe(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "berita", children: "Berita" }), _jsx("option", { value: "informasi", children: "Informasi" })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Judul" }), _jsx("input", { type: "text", value: judul, onChange: (e) => setJudul(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Konten" }), _jsx("textarea", { rows: 5, value: isi_konten, onChange: (e) => setIsiKonten(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Gambar" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" }), preview && (_jsx("img", { src: preview, className: "w-32 h-32 object-cover mt-3 rounded-lg border dark:border-gray-700" }))] }), _jsxs("div", { className: "flex gap-3 pt-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "Simpan Perubahan" }), _jsx("button", { type: "button", onClick: () => navigate("/berita"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "Batal" })] })] })) }) })] }));
}
