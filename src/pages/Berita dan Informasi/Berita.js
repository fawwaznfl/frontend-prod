import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import { useSearch } from "../../SearchContext";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
export default function BeritaPage() {
    const { searchTerm } = useSearch();
    const [beritaList, setBeritaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const dashboardType = localStorage.getItem("dashboard_type");
    const [localSearch, setLocalSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("all");
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const getImageUrl = (path) => {
        if (!path)
            return "/default-image.png";
        return `${API_URL}/storage/${path}`;
    };
    const fetchBerita = async () => {
        try {
            const token = localStorage.getItem("token");
            const companyId = localStorage.getItem("company_id");
            const params = dashboardType === "superadmin"
                ? {}
                : { company_id: companyId };
            const res = await api.get("/berita", {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            setBeritaList(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetching berita:", err);
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
            setCompanies(Array.isArray(res.data.data) ? res.data.data : []);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
        }
    };
    useEffect(() => {
        fetchBerita();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus Berita?",
            text: "Data ini tidak bisa dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/berita/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBeritaList((prev) => prev.filter((b) => b.id !== id));
            Swal.fire("Terhapus", "Berita berhasil dihapus", "success");
        }
        catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
        }
    };
    const handleEdit = (row) => {
        navigate(`/edit-berita/${row.id}`);
    };
    const columns = [
        {
            header: "No",
            accessor: "id",
            width: "60px",
            cell: (_, index) => index + 1,
        },
        {
            header: "Tipe",
            accessor: "tipe",
            width: "120px",
            cell: (row) => (_jsx("span", { className: "px-2 py-1 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white", children: row.tipe })),
        },
        {
            header: "Judul",
            accessor: "judul",
        },
        {
            header: "Isi Konten",
            accessor: "isi_konten",
            cell: (row) => (_jsx("p", { className: "line-clamp-2 text-gray-700 dark:text-gray-300", children: row.isi_konten })),
        },
        {
            header: "Gambar",
            accessor: "gambar",
            width: "120px",
            cell: (row) => row.gambar ? (_jsx("img", { src: getImageUrl(row.gambar), alt: "gambar", className: "w-16 h-16 object-cover rounded-lg border dark:border-gray-700" })) : (_jsx("span", { className: "text-gray-400", children: "-" })),
        },
        {
            header: "Actions",
            width: "140px",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white", title: "Edit", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white", title: "Hapus", children: _jsx(Trash, { size: 18 }) })] })),
        },
    ];
    const filteredList = beritaList
        .filter((b) => b.judul.toLowerCase().includes(localSearch.toLowerCase()))
        .filter((b) => selectedCompany === "all" ? true : Number(b.company_id) === Number(selectedCompany));
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Berita", description: "Daftar Berita" }), _jsx(PageHeader, { pageTitle: "Berita", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/add-berita"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsxs(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-6 items-end", children: [_jsxs("div", { className: "flex flex-col w-72", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Judul" }), _jsx("input", { type: "text", placeholder: "Cari judul berita...", value: localSearch, onChange: (e) => setLocalSearch(e.target.value), className: "border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white" })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value === "all" ? "all" : Number(e.target.value)), className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }) }), loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredList, disableSearch: true }) }))] }) })] }));
}
