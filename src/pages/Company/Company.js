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
import * as XLSX from "xlsx";
import { Pencil, Trash2 } from "lucide-react";
export default function Company() {
    const { searchTerm } = useSearch();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
    }, []);
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Perusahaan yang dihapus tidak bisa dikembalikan!",
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
                await api.delete(`/companies/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompanies(companies.filter((c) => c.id !== id));
                Swal.fire("Terhapus!", "Perusahaan berhasil dihapus.", "success");
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus perusahaan.", "error");
            }
        }
    };
    // EDIT
    const handleEdit = (company) => {
        navigate(`/edit-company/${company.id}`);
    };
    // EXPORT CSV
    const handleExport = () => {
        if (companies.length === 0)
            return;
        const headers = ["No", "Nama", "Alamat", "Telepon", "Email", "Website"];
        const rows = companies.map((c, index) => [
            index + 1,
            c.name,
            c.alamat,
            c.telepon,
            c.email,
            c.website,
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((item) => `"${item}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "companies.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // IMPORT EXCEL/CSV
    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const data = evt.target?.result;
            if (!data)
                return;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            if (jsonData.length === 0) {
                Swal.fire("Info", "File kosong atau format tidak valid", "info");
                return;
            }
            try {
                const token = localStorage.getItem("token");
                for (const row of jsonData) {
                    const payload = {
                        name: row.Name || "",
                        alamat: row.Alamat || "",
                        telepon: row.Telepon || "",
                        email: row.Email || "",
                        website: row.Website || "",
                    };
                    if (!payload.name)
                        continue;
                    await api.post("/companies", payload, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
                Swal.fire("Berhasil", "Data perusahaan berhasil diimport", "success");
                fetchCompanies();
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat import", "error");
            }
        };
        reader.readAsBinaryString(file);
    };
    const columns = [
        {
            header: "No",
            accessor: "id",
            cell: (_, index) => index + 1,
            width: "60px",
        },
        { header: "Nama", accessor: "name" },
        { header: "Alamat", accessor: "alamat" },
        { header: "Telepon", accessor: "telepon" },
        { header: "Email", accessor: "email" },
        { header: "Website", accessor: "website" },
        {
            header: "Actions",
            cell: (row) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleEdit(row), className: "p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white", title: "Edit", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white", title: "Hapus", children: _jsx(Trash2, { size: 16 }) })] })),
            width: "150px",
        },
    ];
    const filteredCompanies = companies.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Company", description: "Company" }), _jsx(PageHeader, { pageTitle: "Perusahaan", titleClass: "text-[32px] dark:text-white", rightContent: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: handleExport, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl flex items-center gap-2", children: "\uD83D\uDCC4 Export" }), _jsxs("label", { className: "bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer", children: ["\uD83D\uDCCA Import", _jsx("input", { type: "file", accept: ".xlsx, .xls, .csv", onChange: handleImport, className: "hidden" })] }), _jsx("button", { onClick: () => navigate("/add-company"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" })] }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { title: "Daftar Perusahaan", className: "\n              bg-white border border-gray-200\n              dark:bg-gray-900 dark:border-gray-700\n            ", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredCompanies, searchPlaceholder: "Cari perusahaan..." }) })) }) })] }));
}
