import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import { useSearch } from "../../SearchContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { Check, X } from "lucide-react";
export default function DataLembur() {
    const { searchTerm } = useSearch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dashboardType = localStorage.getItem("dashboard_type");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    const navigate = useNavigate();
    // Date filter
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 \n              hover:border-blue-500 transition-all focus:outline-none", children: value || "Pilih tanggal" }));
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data || []);
        }
        catch (err) {
            console.error(err);
        }
    };
    const fetchLembur = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/lembur", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data.data);
        }
        catch (err) {
            console.error("Error fetching lembur:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLembur();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Lembur?",
            text: "Data tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/lembur/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(data.filter((d) => d.id !== id));
            Swal.fire("Berhasil", "Data lembur dihapus.", "success");
        }
        catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
    };
    const openMap = (lokasi) => {
        if (!lokasi)
            return;
        const [lat, lng] = lokasi.split(",");
        if (!lat || !lng)
            return;
        const url = `https://www.google.com/maps?q=${lat.trim()},${lng.trim()}`;
        window.open(url, "_blank");
    };
    const columns = [
        { header: "No", accessor: undefined, cell: (_, i) => i + 1 },
        { header: "Nama Pegawai", accessor: "pegawai", cell: (r) => r.pegawai?.name || "-" },
        { header: "Tanggal", accessor: "tanggal_lembur" },
        { header: "Jam Mulai", accessor: "jam_mulai", cell: (r) => r.jam_mulai || "-" },
        {
            header: "Lokasi Masuk",
            cell: (r) => {
                if (!r.lokasi_masuk)
                    return "-";
                return (_jsx("button", { onClick: () => openMap(r.lokasi_masuk), className: "text-blue-600 underline hover:text-blue-800", children: r.lokasi_masuk }));
            },
        },
        {
            header: "Foto Masuk",
            cell: (r) => r.foto_masuk_url ? (_jsx("img", { src: r.foto_masuk_url, className: "h-14 rounded-lg object-cover" })) : ("-"),
        },
        { header: "Jam Selesai", accessor: "jam_selesai", cell: (r) => r.jam_selesai || "-" },
        {
            header: "Lokasi Pulang",
            cell: (r) => {
                if (!r.lokasi_pulang)
                    return "-";
                return (_jsx("button", { onClick: () => openMap(r.lokasi_pulang), className: "text-blue-600 underline hover:text-blue-800", children: r.lokasi_pulang }));
            },
        },
        {
            header: "Foto Pulang",
            cell: (r) => r.foto_pulang_url ? (_jsx("img", { src: r.foto_pulang_url, className: "h-14 rounded-lg object-cover" })) : ("-"),
        },
        {
            header: "Status",
            cell: (row) => _jsx(StatusBadge, { status: row.status }),
        },
        {
            header: "Action",
            cell: (row) => (_jsx("div", { className: "flex gap-2", children: row.status === "menunggu" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleApprove(row.id), title: "disetujui", className: "bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg", children: _jsx(Check, { size: 16 }) }), _jsx("button", { onClick: () => handleReject(row.id), title: "ditolak", className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg", children: _jsx(X, { size: 16 }) })] })) })),
        },
    ];
    // FILTER DATA
    const filteredData = data.filter((item) => {
        const nameMatch = item.pegawai?.name?.toLowerCase().includes(pegawaiSearch.toLowerCase());
        const tanggal = new Date(item.tanggal_lembur);
        const dateMatch = (!startDate || tanggal >= startDate) &&
            (!endDate || tanggal <= endDate);
        const companyMatch = !selectedCompany ||
            String(item.pegawai?.company_id) === selectedCompany;
        return nameMatch && dateMatch && companyMatch;
    });
    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: "Setujui Lembur?",
            text: "Lembur akan disetujui",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Setujui",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.post(`/lembur/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData((prev) => prev.map((item) => item.id === id ? { ...item, status: "disetujui" } : item));
            Swal.fire("Berhasil", "Lembur disetujui", "success");
        }
        catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        }
    };
    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: "Tolak Lembur?",
            text: "Lembur akan ditolak",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Tolak",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.post(`/lembur/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData((prev) => prev.map((item) => item.id === id ? { ...item, status: "ditolak" } : item));
            Swal.fire("Berhasil", "Lembur ditolak", "success");
        }
        catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        }
    };
    const StatusBadge = ({ status }) => {
        const map = {
            menunggu: {
                label: "Menunggu",
                className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            },
            disetujui: {
                label: "Disetujui",
                className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            },
            ditolak: {
                label: "Ditolak",
                className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            },
        };
        const cfg = map[status] || {
            label: status,
            className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        };
        return (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold inline-block ${cfg.className}`, children: cfg.label }));
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Data Lembur", description: "Data Lembur Pegawai" }), _jsx(PageHeader, { pageTitle: "Data Lembur" }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { className: "p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Cari Pegawai" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "Cari nama pegawai...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value) })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg", children: "Reset" })] })] }) }), _jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredData, disableSearch: true }) })] })) }) })] }));
}
