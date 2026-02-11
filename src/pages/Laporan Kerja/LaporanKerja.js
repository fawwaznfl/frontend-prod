import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function LaporanKerjaPage() {
    const dashboardType = localStorage.getItem("dashboard_type");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    // GET DATA
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const company_id = localStorage.getItem("company_id");
            const res = await api.get("/laporan-kerja", {
                headers: { Authorization: `Bearer ${token}` },
                params: dashboardType === "superadmin"
                    ? {}
                    : { company_id },
            });
            setData(res.data.data);
        }
        catch (err) {
            console.error("Error fetching laporan kerja:", err);
        }
        finally {
            setLoading(false);
        }
    };
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
    useEffect(() => {
        fetchData();
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
    }, []);
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });
        if (!result.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/laporan-kerja/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(data.filter((d) => d.id !== id));
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
        }
    };
    // EDIT
    const handleEdit = (row) => {
        navigate(`/edit-laporan-kerja/${row.id}`);
    };
    // COLUMNS
    const columns = [
        {
            header: "No",
            accessor: "id",
            width: "60px",
            cell: (_, index) => index + 1,
        },
        {
            header: "Nama Pegawai",
            accessor: "pegawai",
            cell: (row) => row.pegawai?.name || "-",
        },
        {
            header: "Tanggal",
            accessor: "tanggal_laporan",
        },
        {
            header: "Informasi umum",
            accessor: "informasi_umum",
        },
        {
            header: "Pekerjaan Yang Dilaksanakan",
            accessor: "pekerjaan_yang_dilaksanakan",
        },
        {
            header: "Pekerjaan Belum Selesai",
            accessor: "pekerjaan_belum_selesai",
        },
        {
            header: "Catatan",
            accessor: "catatan",
            cell: (row) => row.catatan || "-",
        },
    ];
    // FILTERING
    const filteredData = data
        .filter((d) => d.pegawai?.name.toLowerCase().includes(localSearch.toLowerCase()))
        .filter((d) => dashboardType === "superadmin"
        ? selectedCompany === "all"
            ? true
            : d.company_id === selectedCompany
        : true);
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Laporan Kerja", description: "Daftar Laporan Kerja Pegawai" }), _jsx(PageHeader, { pageTitle: "Laporan Kerja Pegawai", titleClass: "text-[32px] dark:text-white" }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsxs(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-6 items-end", children: [_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Pegawai" }), _jsx("input", { type: "text", placeholder: "Cari nama pegawai...", value: localSearch, onChange: (e) => setLocalSearch(e.target.value), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white" })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value === "all" ? "all" : Number(e.target.value)), className: "border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }) }), loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredData, disableSearch: true }) }))] }) })] }));
}
