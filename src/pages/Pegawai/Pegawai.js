import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import { useSearch } from "../../SearchContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Edit, Trash, Clock, Briefcase, FileSignature, ScanFace } from "lucide-react";
export default function Pegawais() {
    const { searchTerm } = useSearch();
    const [pegawaiList, setPegawaiList] = useState([]);
    const [filteredPegawai, setFilteredPegawai] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [localSearch, setLocalSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const dashboardType = localStorage.getItem("dashboard_type");
    const navigate = useNavigate();
    // Fetch companies
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
            setCompanies([]);
        }
    };
    // Fetch pegawai
    const fetchPegawai = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/pegawais", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPegawaiList(res.data || []);
            setFilteredPegawai(res.data || []);
        }
        catch (err) {
            console.error("Error fetching pegawai:", err);
            setPegawaiList([]);
            setFilteredPegawai([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
        fetchPegawai();
    }, [dashboardType]);
    // Filter pegawai by company
    useEffect(() => {
        let filtered = pegawaiList;
        // filter by search text
        if (localSearch.trim() !== "") {
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(localSearch.toLowerCase()));
        }
        // filter by selected company
        if (selectedCompany !== null) {
            filtered = filtered.filter((p) => p.company_id === selectedCompany);
        }
        setFilteredPegawai(filtered);
    }, [localSearch, selectedCompany, pegawaiList]);
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Pegawai yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await api.delete(`/pegawais/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPegawaiList(pegawaiList.filter((p) => p.id !== id));
                Swal.fire("Terhapus!", "Pegawai berhasil dihapus.", "success");
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus pegawai.", "error");
            }
        }
    };
    // EDIT
    const handleEdit = (pegawai) => {
        navigate(`/edit-pegawai/${pegawai.id}`);
    };
    // EXPORT CSV
    const handleExport = () => {
        if (filteredPegawai.length === 0)
            return;
        const headers = ["No", "Nama", "Username", "Email", "Telepon", "Divisi", "Lokasi", "Role", "Dashboard", "Status", "Company"];
        const rows = filteredPegawai.map((p, index) => [
            index + 1,
            p.name,
            p.username,
            p.email,
            p.telepon,
            p.divisi_id ?? "-",
            p.lokasi_id ?? "-",
            p.role_id ?? "-",
            p.dashboard_type,
            p.status ?? "-",
            companies.find((c) => c.id === p.company_id)?.name ?? "-",
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((item) => `"${item}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pegawai.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const buildImageUrl = (path) => {
        if (!path)
            return "/default-avatar.jpg";
        if (path.startsWith("http")) {
            return path;
        }
        const base = STORAGE_URL?.replace(/\/$/, "");
        const cleanPath = path.replace(/^\//, "");
        const fullUrl = `${base}/${cleanPath}`;
        console.log("BUILT URL:", fullUrl);
        return fullUrl;
    };
    const columns = [
        { header: "No", accessor: "id", cell: (_, index) => index + 1, width: "60px" },
        { header: "Nama", accessor: "name" },
        {
            header: "Foto",
            accessor: "foto_karyawan",
            cell: (row) => (_jsx("div", { className: "flex flex-col items-center justify-center p-2", children: _jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden border", children: _jsx("img", { src: buildImageUrl(row.foto_karyawan), onError: (e) => {
                            e.currentTarget.src = "/default-avatar.jpg";
                        }, className: "w-full h-full object-cover" }) }) })),
        },
        { header: "Username", accessor: "username" },
        {
            header: "Lokasi",
            accessor: "lokasi",
            cell: (row) => row.lokasi?.nama_lokasi ?? "-",
        },
        {
            header: "Divisi",
            accessor: "divisi",
            cell: (row) => row.divisi?.nama ?? "-",
        },
        {
            header: "Role",
            accessor: "role",
            cell: (row) => row.role?.nama ?? "-",
        },
        { header: "Dashboard", accessor: "dashboard_type" },
        {
            header: "Actions",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => navigate(`/input-shift/${row.id}`), className: "p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white", title: "Input Shift", children: _jsx(Clock, { size: 18 }) }), _jsx("button", { onClick: () => navigate(`/input-dinas-luar/${row.id}`), className: "p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white", title: "Dinas Luar", children: _jsx(Briefcase, { size: 18 }) }), _jsx("button", { onClick: () => navigate(`/kontrak-kerja/${row.id}`), className: "p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white", title: "Kontrak Kerja", children: _jsx(FileSignature, { size: 18 }) }), _jsx("button", { onClick: () => handleEdit(row), className: "p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white", title: "Edit", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => navigate(`/face-recognition/${row.id}`), className: "p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white", title: "Face Recognition", children: _jsx(ScanFace, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white", title: "Hapus", children: _jsx(Trash, { size: 18 }) })] })),
            width: "240px",
        }
    ];
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Pegawai", description: "Daftar Pegawai" }), _jsx(PageHeader, { pageTitle: "Daftar Pegawai", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("div", { className: "flex flex-wrap gap-2 items-center", children: _jsx("button", { onClick: handleExport, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl flex items-center gap-2", children: "\uD83D\uDCC4 Export" }) }) }), _jsx("div", { className: "!mt-0 !pt-0 !space-y-3", children: _jsxs(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 !pt-0 !pb-0 !mt-0 !border-t-0", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-6 items-end", children: [_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Pegawai" }), _jsx("input", { type: "text", placeholder: "Cari Pegawai...", value: localSearch, onChange: (e) => setLocalSearch(e.target.value), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white" })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col w-64", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany ?? "", onChange: (e) => setSelectedCompany(e.target.value ? Number(e.target.value) : null), className: "border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }) }), loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredPegawai, disableSearch: true }) }))] }) })] }));
}
