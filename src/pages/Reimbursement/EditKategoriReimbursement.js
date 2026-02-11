import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Save } from "lucide-react";
export default function EditKategoriReimbursement() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        company_id: "",
        nama: "",
        jumlah: "",
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    // Fetch companies
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
    // Fetch detail kategori reimbursement
    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/kategori-reimbursement/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("DETAIL RESPONSE", res.data);
            const data = res.data; // ← FIX DI SINI
            if (!data) {
                throw new Error("Data tidak ditemukan");
            }
            setForm({
                company_id: data.company_id ? String(data.company_id) : "",
                nama: data.nama ?? "",
                jumlah: data.jumlah ? String(data.jumlah) : "",
            });
        }
        catch (err) {
            console.error("Error fetching detail:", err);
            Swal.fire("Gagal", "Data tidak ditemukan.", "error");
            navigate("/kategori-reimbursement");
        }
    };
    useEffect(() => {
        fetchCompanies();
        fetchDetail();
    }, []);
    // FORM CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    // SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await api.put(`/kategori-reimbursement/${id}`, {
                company_id: form.company_id,
                nama: form.nama,
                jumlah: form.jumlah ? Number(form.jumlah) : null,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Kategori reimbursement berhasil diperbarui.",
            });
            navigate("/kategori-reimbursement");
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan.",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Kategori Reimbursement", description: "Edit Kategori Reimbursement" }), _jsx(PageHeader, { pageTitle: "Edit Kategori Reimbursement", titleClass: "text-[28px] dark:text-white", rightContent: _jsxs("button", { onClick: () => navigate("/kategori-reimbursement"), className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 18 }), " Kembali"] }) }), _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block dark:text-white", children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white", required: true, children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block dark:text-white", children: "Nama Kategori" }), _jsx("input", { type: "text", name: "nama", placeholder: "Masukkan nama kategori...", value: form.nama, onChange: handleChange, className: "border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block dark:text-white", children: "Jumlah Maksimal (opsional)" }), _jsx("input", { type: "number", name: "jumlah", placeholder: "Masukkan jumlah maksimal...", value: form.jumlah, onChange: handleChange, className: "border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white" })] }), _jsxs("button", { type: "submit", disabled: loading, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium", children: [_jsx(Save, { size: 20 }), loading ? "Menyimpan..." : "Update Kategori"] })] }) })] }));
}
