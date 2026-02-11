import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
export default function EditInventory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        kode_barang: "",
        nama_barang: "",
        stok: "",
        satuan: "",
        lokasi_id: "",
        divisi_id: "",
        company_id: "",
        keterangan: "",
    });
    // Master data
    const [companies, setCompanies] = useState([]);
    const [lokasi, setLokasi] = useState([]);
    const [divisi, setDivisi] = useState([]);
    const [filteredLokasi, setFilteredLokasi] = useState([]);
    const [filteredDivisi, setFilteredDivisi] = useState([]);
    // Normalize Response
    const normalize = (res) => res?.data?.data || res?.data || [];
    // ===========================
    // FETCH MASTER DATA
    // ===========================
    const fetchMasterData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [comp, lok, div] = await Promise.all([
                api.get("/companies", { headers }),
                api.get("/lokasis", { headers }),
                api.get("/divisis", { headers }),
            ]);
            setCompanies(normalize(comp));
            setLokasi(normalize(lok));
            setDivisi(normalize(div));
        }
        catch (err) {
            console.error(err);
        }
    };
    // ===========================
    // FETCH INVENTORY DETAIL
    // ===========================
    const fetchInventoryDetail = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const res = await api.get(`/inventory/${id}`, { headers });
            const data = res.data.data;
            setForm({
                kode_barang: data.kode_barang,
                nama_barang: data.nama_barang,
                stok: data.stok,
                satuan: data.satuan,
                lokasi_id: data.lokasi_id || "",
                divisi_id: data.divisi_id || "",
                company_id: data.company_id || "",
                keterangan: data.keterangan || "",
            });
        }
        catch (err) {
            console.error("Error fetch detail:", err);
            Swal.fire("Error", "Gagal memuat data inventory!", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMasterData();
        fetchInventoryDetail();
    }, []);
    // ===========================
    // Filter lokasi & divisi ketika company berubah
    // ===========================
    useEffect(() => {
        if (!form.company_id)
            return;
        const fl = lokasi.filter((l) => l.company_id == form.company_id);
        const fd = divisi.filter((d) => d.company_id == form.company_id);
        setFilteredLokasi(fl);
        setFilteredDivisi(fd);
    }, [form.company_id, lokasi, divisi]);
    // ===========================
    // Handle Change
    // ===========================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    // ===========================
    // SUBMIT UPDATE
    // ===========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await api.put(`/inventory/${id}`, form, { headers });
            Swal.fire("Berhasil", "Inventory berhasil diperbarui", "success");
            navigate("/inventory");
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Periksa kembali input data!", "error");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Inventory", description: "Edit data inventory" }), _jsx(PageHeader, { pageTitle: "Edit Inventory", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/inventory"), className: "bg-gray-600 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-xl", children: "Kembali" }) }), _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-6", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Kode Barang" }), _jsx("input", { name: "kode_barang", value: form.kode_barang, onChange: handleChange, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Nama Barang" }), _jsx("input", { name: "nama_barang", value: form.nama_barang, onChange: handleChange, required: true, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Stok" }), _jsx("input", { type: "number", name: "stok", value: form.stok, onChange: handleChange, required: true, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Satuan" }), _jsx("input", { name: "satuan", value: form.satuan, onChange: handleChange, required: true, placeholder: "pcs / unit / box", className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, required: true, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Lokasi" }), _jsxs("select", { name: "lokasi_id", value: form.lokasi_id, onChange: handleChange, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Lokasi" }), filteredLokasi.map((l) => (_jsx("option", { value: l.id, children: l.nama_lokasi }, l.id)))] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Divisi" }), _jsxs("select", { name: "divisi_id", value: form.divisi_id, onChange: handleChange, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Divisi" }), filteredDivisi.map((d) => (_jsx("option", { value: d.id, children: d.nama_divisi || d.nama }, d.id)))] })] }), _jsxs("div", { className: "flex flex-col md:col-span-2", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, rows: 3, className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsx("div", { className: "md:col-span-2 flex justify-end", children: _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl", children: "Simpan Perubahan" }) })] })) })] }));
}
