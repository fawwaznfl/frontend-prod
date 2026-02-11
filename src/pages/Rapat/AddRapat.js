import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
export default function AddRapat() {
    const navigate = useNavigate();
    const [tanggalRapat, setTanggalRapat] = useState(null);
    //const dashboardType = localStorage.getItem("dashboard_type");
    //const userCompanyId = localStorage.getItem("company_id");
    const [pegawais, setPegawais] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dashboardType = user.dashboard_type;
    const userCompanyId = user.company_id;
    const [selectedPegawai, setSelectedPegawai] = useState([]);
    const [form, setForm] = useState({
        company_id: "",
        pegawai_id: "",
        nama_pertemuan: "",
        tanggal_rapat: "",
        waktu_mulai: "",
        waktu_selesai: "",
        lokasi: "",
        detail_pertemuan: "",
        jenis_pertemuan: "",
    });
    const [companies, setCompanies] = useState([]);
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
        fetchPegawais();
        // Jika admin → isi otomatis dan sembunyikan dropdown
        if (dashboardType === "admin" && userCompanyId) {
            setForm((prev) => ({
                ...prev,
                company_id: Number(userCompanyId),
            }));
        }
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        // reset pegawai kalau company diganti (superadmin)
        if (name === "company_id" && dashboardType === "superadmin") {
            setForm((prev) => ({
                ...prev,
                company_id: Number(value),
                pegawai_id: "",
            }));
            return;
        }
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.post("/rapat", {
                ...form,
                pegawai_ids: selectedPegawai,
            });
            Swal.fire("Berhasil", "Rapat berhasil ditambahkan", "success");
            navigate("/rapat");
        }
        catch (err) {
            console.error("ERROR RAPAT:", err.response?.data);
            Swal.fire("Error", err.response?.data?.message || "Validasi gagal", "error");
        }
    };
    const fetchPegawais = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/pegawais", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = res.data.map((p) => ({
                id: p.id,
                name: p.name || "Unnamed",
                company_id: p.company_id || null,
            }));
            // SUPERADMIN → semua pegawai
            if (dashboardType === "superadmin") {
                setPegawais(mapped);
            }
            // ADMIN → hanya pegawai company sendiri
            else if (dashboardType === "admin" && userCompanyId) {
                setPegawais(mapped.filter((p) => String(p.company_id) === String(userCompanyId)));
            }
        }
        catch (err) {
            console.error("Gagal fetch pegawai:", err);
            setPegawais([]);
        }
    };
    const filteredPegawai = dashboardType === "admin"
        ? pegawais
        : pegawais.filter((p) => String(p.company_id) === String(form.company_id));
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Rapat", description: "Form menambah data rapat" }), _jsx(PageHeader, { pageTitle: "Tambah Rapat", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/rapat"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx(ComponentCard, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 p-4", children: [dashboardType === "superadmin" && (_jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Company" }), _jsxs("select", { name: "company_id", className: "w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.company_id, onChange: handleChange, required: true, children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), dashboardType === "admin" && (_jsx("input", { type: "hidden", name: "company_id", value: form.company_id })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Nama Pertemuan" }), _jsx("input", { type: "text", name: "nama_pertemuan", className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.nama_pertemuan, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Tanggal" }), _jsx("div", { children: _jsx(DatePicker, { selected: tanggalRapat, onChange: (date) => {
                                                    setTanggalRapat(date);
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        tanggal_rapat: date
                                                            ? date.toISOString().split("T")[0] // hasil: 2025-01-05
                                                            : "",
                                                    }));
                                                }, dateFormat: "yyyy-MM-dd", placeholderText: "Pilih tanggal", className: "w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Jam Mulai" }), _jsx("input", { type: "time", name: "waktu_mulai", className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.waktu_mulai, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Jam Selesai" }), _jsx("input", { type: "time", name: "waktu_selesai", className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.waktu_selesai, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Lokasi Pertemuan" }), _jsx("input", { type: "text", name: "lokasi", className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.lokasi, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Jenis Pertemuan" }), _jsxs("select", { name: "jenis_pertemuan", className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.jenis_pertemuan, onChange: handleChange, required: true, children: [_jsx("option", { value: "", children: "Pilih Jenis" }), _jsx("option", { value: "offline", children: "Offline" }), _jsx("option", { value: "online", children: "Online" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Nama Pegawai" }), _jsx("select", { multiple: true, value: selectedPegawai.map(String), onChange: (e) => {
                                        const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                                        setSelectedPegawai(values);
                                    }, className: "w-full border rounded-lg px-3 py-2", children: filteredPegawai.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id))) }), _jsx("div", { children: _jsx("label", { className: "font-extralight dark:text-white", children: "Tekan ctrl/command untuk memilih lebih dari 1" }) }), _jsx("button", { type: "button", onClick: () => setSelectedPegawai(filteredPegawai.map((p) => p.id)), className: "text-sm text-blue-600 hover:underline", children: "Pilih Semua Pegawai" }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: selectedPegawai.map((id) => {
                                        const p = filteredPegawai.find((x) => x.id === id);
                                        if (!p)
                                            return null;
                                        return (_jsxs("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2", children: [p.name, _jsx("button", { type: "button", onClick: () => setSelectedPegawai(selectedPegawai.filter((x) => x !== id)), className: "text-red-500 font-bold", children: "\u00D7" })] }, id));
                                    }) })] }), _jsxs("div", { children: [_jsx("label", { className: "font-medium dark:text-white", children: "Detail Pertemuan" }), _jsx("textarea", { name: "detail_pertemuan", rows: 4, className: "w-full border rounded-lg px-3 py-2\n             dark:bg-gray-700 dark:text-white dark:border-gray-600", value: form.detail_pertemuan, onChange: handleChange, required: true })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg", children: "Simpan" })] }) })] }));
}
