import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function AddBerita() {
    const navigate = useNavigate();
    // AMBIL USER
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dashboardType = user.dashboard_type;
    const userCompanyId = user.company_id;
    const [companyId, setCompanyId] = useState(dashboardType === "admin" ? String(userCompanyId) : "");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipe, setTipe] = useState("berita");
    const [judul, setJudul] = useState("");
    const [isi_konten, setIsiKonten] = useState("");
    const [gambar, setGambar] = useState(null);
    const [preview, setPreview] = useState(null);
    // =============================
    // FETCH COMPANIES
    // =============================
    const fetchCompanies = async () => {
        if (dashboardType === "admin") {
            setLoading(false);
            return; // ADMIN tidak perlu fetch companies
        }
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
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
    }, []);
    // =============================
    // IMAGE PREVIEW
    // =============================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setGambar(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };
    // =============================
    // SUBMIT
    // =============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("company_id", companyId.toString());
        formData.append("tipe", tipe);
        formData.append("judul", judul);
        formData.append("isi_konten", isi_konten);
        if (gambar instanceof File) {
            formData.append("gambar", gambar);
        }
        try {
            await api.post("/berita", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Berita berhasil dibuat 🎉",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/berita");
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan!",
            });
        }
    };
    // ===========================================================
    // UI
    // ===========================================================
    const inputClass = "border px-3 py-2 rounded-lg bg-white text-gray-900 " +
        "dark:bg-gray-700 dark:text-white dark:border-gray-600";
    const labelClass = "text-sm font-medium mb-1 text-gray-800 dark:text-gray-200";
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Berita", description: "Tambah Berita Baru" }), _jsx(PageHeader, { pageTitle: "Tambah Berita", titleClass: "text-[32px] dark:text-white" }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsx(ComponentCard, { className: "p-6 dark:bg-gray-800 dark:border-gray-700", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: labelClass, children: "Company" }), _jsxs("select", { value: companyId, onChange: (e) => setCompanyId(e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), dashboardType === "admin" && (_jsx("input", { type: "hidden", value: userCompanyId, name: "company_id" })), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: labelClass, children: "Tipe" }), _jsxs("select", { value: tipe, onChange: (e) => setTipe(e.target.value), className: inputClass, children: [_jsx("option", { value: "berita", children: "Berita" }), _jsx("option", { value: "informasi", children: "Informasi" })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: labelClass, children: "Judul" }), _jsx("input", { type: "text", value: judul, onChange: (e) => setJudul(e.target.value), className: inputClass })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: labelClass, children: "Konten" }), _jsx("textarea", { value: isi_konten, onChange: (e) => setIsiKonten(e.target.value), rows: 5, className: inputClass })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: labelClass, children: "Gambar" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: inputClass }), preview && (_jsx("img", { src: preview, className: "w-32 h-32 object-cover mt-3 rounded-lg border dark:border-gray-600" }))] }), _jsxs("div", { className: "flex gap-3 pt-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "Simpan" }), _jsx("button", { type: "button", onClick: () => navigate("/berita"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "Batal" })] })] })) }) })] }));
}
