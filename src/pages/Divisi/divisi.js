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
import { Pencil, Trash2 } from "lucide-react";
export default function DivisiPage() {
    const { searchTerm, setSearchTerm } = useSearch();
    const [divisis, setDivisis] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState("all");
    const navigate = useNavigate();
    // Fetch Companies
    const fetchCompanies = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/companies", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data.data);
    };
    // Fetch Divisi
    const fetchDivisis = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/divisis", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDivisis(res.data.data);
        }
        catch (err) {
            console.error("Error fetching divisi:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDivisis();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    useEffect(() => {
        if (companies.length === 0)
            return;
        setDivisis((prev) => prev.map((d) => ({
            ...d,
            company_name: companies.find((c) => c.id === d.company_id)?.name || "-",
        })));
    }, [companies]);
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Divisi yang dihapus tidak bisa dikembalikan!",
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
                await api.delete(`/divisis/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDivisis(divisis.filter((d) => d.id !== id));
                Swal.fire("Terhapus!", "Divisi berhasil dihapus.", "success");
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus divisi.", "error");
            }
        }
    };
    // EDIT
    const handleEdit = (divisi) => {
        navigate(`/edit-divisi/${divisi.id}`);
    };
    const columns = [
        {
            header: "No",
            accessor: "id",
            cell: (_, index) => index + 1,
            width: "60px",
        },
        { header: "Nama Divisi", accessor: "nama" },
        {
            header: "Perusahaan",
            accessor: "company_name",
            cell: (row) => row.company_name || "-",
        },
        {
            header: "Actions",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center", children: _jsx(Pencil, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center", children: _jsx(Trash2, { size: 18 }) })] })),
            width: "120px",
        },
    ];
    const [localSearch, setLocalSearch] = useState("");
    const filteredDivisis = divisis
        .filter((d) => d.nama.toLowerCase().includes(localSearch.toLowerCase()))
        .filter((d) => selectedCompany === "all" ? true : d.company_id === selectedCompany);
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Divisi", description: "Daftar Divisi" }), _jsx(PageHeader, { pageTitle: "Divisi", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("div", { className: "flex flex-wrap gap-2", children: _jsx("button", { onClick: () => navigate("/add-divisi"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" }) }) }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsxs(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-6 items-end", children: [_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Divisi" }), _jsx("input", { type: "text", placeholder: "Cari divisi...", value: localSearch, onChange: (e) => setLocalSearch(e.target.value), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white" })] }), localStorage.getItem("dashboard_type") === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value === "all" ? "all" : Number(e.target.value)), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }) }), loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n              overflow-x-auto\n              [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n              dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n              [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n              dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n              dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n              dark:[&_thead]:bg-gray-800\n              dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n              dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n              [&_tr]:transition-colors\n            ", children: _jsx(DataTable, { columns: columns, data: filteredDivisis, disableSearch: true }) }))] }) })] }));
}
