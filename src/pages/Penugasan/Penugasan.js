import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { Pencil, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function Penugasan() {
    const { searchTerm } = useSearch();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const dashboardType = localStorage.getItem("dashboard_type");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    // DATE FILTER
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();
    // FETCH COMPANIES
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data);
        }
        catch {
            setCompanies([]);
        }
    };
    // FETCH ASSIGNMENTS
    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/penugasan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignments(res.data.data);
        }
        catch (err) {
            console.error("Error fetching penugasan:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAssignments();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    // EXPORT EXCEL
    const exportExcel = () => {
        const excelData = assignments.map((t) => ({
            "Nomor Penugasan": t.nomor_penugasan,
            Tanggal: t.created_at,
            "Nama Pegawai": t.pegawai?.name || "-",
            "Judul Pekerjaan": t.judul_pekerjaan,
            "Rincian Pekerjaan": t.rincian_pekerjaan,
            Status: t.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Penugasan");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, `Data_Penugasan_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Tugas yang dihapus tidak bisa dikembalikan!",
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
                await api.delete(`/penugasan/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAssignments(assignments.filter((t) => t.id !== id));
                Swal.fire("Terhapus!", "Tugas berhasil dihapus.", "success");
            }
            catch {
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus tugas.", "error");
            }
        }
    };
    const handleEdit = (row) => {
        navigate(`/edit-penugasan/${row.id}`);
    };
    // TABLE COLUMNS
    const columns = [
        {
            header: "No",
            accessor: "id",
            width: "60px",
            cell: (_, idx) => idx + 1,
        },
        { header: "Nomor Penugasan", accessor: "nomor_penugasan" },
        {
            header: "Tanggal",
            accessor: "created_at",
            cell: (row) => new Date(row.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        },
        {
            header: "Nama Pegawai",
            accessor: "pegawai",
            cell: (row) => row.pegawai?.name || "-",
        },
        { header: "Judul Pekerjaan", accessor: "judul_pekerjaan" },
        { header: "Rincian Pekerjaan", accessor: "rincian_pekerjaan" },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => {
                const colors = {
                    finish: "#a3d88d",
                    process: "#c7defe",
                    pending: "#ffecb1",
                };
                const textColor = "#000";
                return (_jsx("span", { style: {
                        backgroundColor: colors[row.status] || "#ccc",
                        color: textColor,
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontWeight: 500,
                        textTransform: "capitalize",
                    }, children: row.status }));
            },
        },
        {
            header: "Actions",
            width: "150px",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg", title: "Edit", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg", title: "Hapus", children: _jsx(Trash2, { size: 16 }) })] })),
        },
    ];
    // FINAL FILTER
    const filteredAssignments = assignments.filter((t) => {
        const name = (t.pegawai?.name ?? "").toLowerCase();
        const pegawaiMatch = name.includes(pegawaiSearch.toLowerCase());
        const tanggal = new Date(t.created_at);
        const dateMatch = (!startDate || tanggal >= startDate) &&
            (!endDate || tanggal <= endDate);
        const companyMatch = !selectedCompany || String(t.pegawai?.company_id) === selectedCompany;
        return pegawaiMatch && dateMatch && companyMatch;
    });
    // CUSTOM DATE INPUT
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-blue-500 transition-all", children: value || "Pilih tanggal" }));
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Penugasan", description: "Daftar Penugasan" }), _jsx(PageHeader, { pageTitle: "Penugasan", titleClass: "text-[32px] dark:text-white", rightContent: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: exportExcel, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl", children: "\uD83D\uDCC4 Export" }), _jsx("button", { onClick: () => navigate("/add-penugasan"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" })] }) }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Cari Pegawai" }), _jsx("div", { className: "border px-3 py-2 rounded-lg w-72 h-[39px] bg-white dark:bg-gray-700 dark:text-white flex items-center", children: _jsx("input", { type: "text", placeholder: "Cari nama pegawai...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value), className: "w-full bg-transparent focus:outline-none" }) })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), className: "px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg h-[42px]", children: "Reset" })] })] }) }), _jsx("div", { className: "\n              overflow-x-auto\n              [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n              dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n              [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n              dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n              dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n              dark:[&_thead]:bg-gray-800\n              dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n              dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n              [&_tr]:transition-colors\n            ", children: _jsx(DataTable, { columns: columns, data: filteredAssignments, disableSearch: true }) })] })) }) })] }));
}
