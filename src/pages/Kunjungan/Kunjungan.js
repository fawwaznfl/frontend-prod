import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash } from "lucide-react";
export default function KunjunganPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [companies, setCompanies] = useState([]);
    const dashboardType = localStorage.getItem("dashboard_type");
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/kunjungan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setList(res.data.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin?",
            text: "Data kunjungan akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/kunjungan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setList((prev) => prev.filter((i) => i.id !== id));
            Swal.fire("Berhasil", "Data dihapus", "success");
        }
        catch {
            Swal.fire("Gagal", "Tidak bisa menghapus data", "error");
        }
    };
    const fetchCompanies = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/companies", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data.data);
    };
    useEffect(() => {
        fetchData();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    const statusBadge = (status) => {
        const map = {
            berlangsung: "bg-blue-100 text-blue-700",
            selesai: "bg-green-100 text-green-700",
            batal: "bg-red-100 text-red-700",
        };
        return (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${map[status]}`, children: status }));
    };
    const columns = [
        {
            header: "No",
            cell: (_, i) => i + 1,
            width: "60px",
        },
        {
            header: "Nama",
            accessor: "pegawai",
            cell: (row) => row.pegawai?.name || "-",
        },
        {
            header: "Tanggal",
            accessor: "tanggal_mulai",
            cell: (row) => new Date(row.tanggal_mulai).toLocaleDateString("id-ID"),
        },
        {
            header: "Visit In",
            cell: (row) => (_jsxs("div", { className: "space-y-1 text-sm text-center flex flex-col items-center", children: [_jsx("p", { className: "font-medium text-gray-800 dark:text-gray-100", children: formatTanggal(row.created_at) }), _jsx("p", { className: "text-gray-700 dark:text-gray-200", children: row.pegawai?.name || "-" }), row.keterangan && (_jsxs("p", { className: "text-gray-600 dark:text-gray-300", children: ["Keterangan: ", row.keterangan] })), _jsxs("div", { className: "flex gap-4 pt-1", children: [_jsx("a", { href: `${import.meta.env.VITE_API_BASE_URL}/storage/${row.upload_foto}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline", children: "\uD83D\uDCCE Lampiran" }), _jsx("a", { href: `https://www.google.com/maps?q=${row.lokasi_masuk}`, target: "_blank", rel: "noopener noreferrer", className: "text-green-600 dark:text-green-400 hover:underline", children: "\uD83D\uDCCD Lokasi" })] })] })),
        },
        {
            header: "Visit Out",
            cell: (row) => {
                if (!row.foto_keluar) {
                    return (_jsx("button", { onClick: () => navigate(`/kunjungan/${row.id}/visit-out`), className: "bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-xs", children: "Visit Out" }));
                }
                return (_jsxs("div", { className: "space-y-1 text-sm text-center flex flex-col items-center", children: [_jsx("p", { className: "font-medium text-gray-800 dark:text-gray-100", children: formatTanggal(row.updated_at) }), _jsx("p", { className: "text-gray-700 dark:text-gray-200", children: row.pegawai?.name || "-" }), row.keterangan_keluar && (_jsxs("p", { className: "text-gray-600 dark:text-gray-300", children: ["Keterangan: ", row.keterangan_keluar] })), _jsxs("div", { className: "flex gap-4 pt-1", children: [_jsx("a", { href: `${import.meta.env.VITE_API_BASE_URL}/storage/${row.foto_keluar}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline", children: "\uD83D\uDCCE Lampiran" }), _jsx("a", { href: `https://www.google.com/maps?q=${row.lokasi_keluar}`, target: "_blank", rel: "noopener noreferrer", className: "text-green-600 dark:text-green-400 hover:underline", children: "\uD83D\uDCCD Lokasi" })] })] }));
            },
        },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => statusBadge(row.status),
        },
        {
            header: "Actions",
            cell: (row) => (_jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: () => handleDelete(row.id), className: "p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white", children: _jsx(Trash, { size: 18 }) }) })),
            width: "150px",
        },
    ];
    const formatTanggal = (date) => new Date(date).toLocaleString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    // Search
    const filteredKunjungan = list
        .filter((k) => k.pegawai?.name
        ?.toLowerCase()
        .includes(localSearch.toLowerCase()))
        .filter((k) => selectedCompany === "all"
        ? true
        : k.company_id === selectedCompany);
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Kunjungan", description: "Data Kunjungan" }), _jsx(PageHeader, { pageTitle: "Kunjungan", titleClass: "text-[32px]", rightContent: _jsx("button", { onClick: () => navigate("/add-kunjungan"), className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "+ Visit In" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsxs(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-6 items-end", children: [_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Divisi" }), _jsx("input", { type: "text", placeholder: "Cari divisi...", value: localSearch, onChange: (e) => setLocalSearch(e.target.value), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white" })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value === "all" ? "all" : Number(e.target.value)), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }) }), loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredKunjungan, disableSearch: true }) }))] }) })] }));
}
