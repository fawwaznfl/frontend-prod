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
import { Download, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Pencil, Trash2 } from "lucide-react";
export default function Kontrak() {
    const { searchTerm } = useSearch();
    const [kontraks, setKontraks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    const dashboardType = localStorage.getItem("dashboard_type");
    const exportExcel = () => {
        // Format data biar rapi di Excel
        const excelData = kontraks.map((k) => ({
            "Nama Pegawai": k.pegawai?.name || "-",
            "Jenis Kontrak": k.jenis_kontrak,
            "Tanggal Mulai": k.tanggal_mulai,
            "Tanggal Selesai": k.tanggal_selesai,
            "Keterangan": k.keterangan || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kontrak");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, `Data_Kontrak_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    // FIX DatePicker state
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();
    // Custom Input For Datepicker
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "\n      border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-blue-500 transition-all focus:outline-none", children: value || "Pilih tanggal" }));
    const fetchCompanies = async () => {
        if (dashboardType !== "superadmin") {
            setCompanies([]); // kosongkan (admin tidak butuh)
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setCompanies(data);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
            setCompanies([]);
        }
    };
    const fetchKontraks = async () => {
        try {
            const token = localStorage.getItem("token");
            const userCompany = localStorage.getItem("company_id");
            const res = await api.get("/kontrak", {
                headers: { Authorization: `Bearer ${token}` },
                params: dashboardType === "admin" ? { company_id: userCompany } : {},
            });
            setKontraks(res.data.data);
        }
        catch (err) {
            console.error("Error fetching kontraks:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
        fetchKontraks();
    }, []);
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Kontrak yang dihapus tidak bisa dikembalikan!",
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
                await api.delete(`/kontrak/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setKontraks(kontraks.filter((k) => k.id !== id));
                Swal.fire("Terhapus!", "Kontrak berhasil dihapus.", "success");
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus kontrak.", "error");
            }
        }
    };
    const handleEdit = (kontrak) => {
        navigate(`/edit-kontrak/${kontrak.id}`);
    };
    const columns = [
        { header: "No", accessor: "id", cell: (_, index) => index + 1, width: "60px" },
        { header: "Nama Pegawai", accessor: "pegawai", cell: (row) => row.pegawai?.name || "-" },
        { header: "Jenis Kontrak", accessor: "jenis_kontrak" },
        { header: "Tanggal Mulai", accessor: "tanggal_mulai" },
        { header: "Tanggal Selesai", accessor: "tanggal_selesai" },
        { header: "Keterangan", accessor: "keterangan", cell: (row) => row.keterangan || "-" },
        {
            header: "File",
            accessor: "file_kontrak",
            cell: (row) => row.file_kontrak ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => window.open(`${row.file_kontrak}`, "_blank"), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center", children: _jsx(Eye, { size: 16 }) }), _jsx("button", { onClick: () => {
                            const link = document.createElement("a");
                            link.href = `${row.file_kontrak}`;
                            link.download = `Kontrak-${row.pegawai?.name ?? row.id}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        }, className: "bg-green-600 hover:bg-green-700 text-white p-2 rounded flex items-center justify-center", children: _jsx(Download, { size: 16 }) })] })) : ("-"),
        },
        {
            header: "Actions",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center", title: "Edit", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center justify-center", title: "Hapus", children: _jsx(Trash2, { size: 16 }) })] })),
            width: "150px",
        },
    ];
    // FILTER NAME + DATE
    const filteredKontraks = kontraks.filter((k) => {
        const name = (k.pegawai?.name ?? "").toLowerCase();
        const pegawaiMatch = name.includes(pegawaiSearch.toLowerCase());
        const nameMatch = (k.pegawai?.name ?? "");
        const mulai = new Date(k.tanggal_mulai);
        const selesai = new Date(k.tanggal_selesai);
        const dateMatch = (!startDate || selesai >= startDate) &&
            (!endDate || mulai <= endDate);
        const companyMatch = !selectedCompany || String(k.pegawai?.company_id) === selectedCompany;
        return pegawaiMatch && nameMatch && dateMatch && companyMatch;
    });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Kontrak", description: "Daftar Kontrak" }), _jsx(PageHeader, { pageTitle: "Kontrak", titleClass: "text-[32px] dark:text-white", rightContent: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: exportExcel, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl", children: "\uD83D\uDCC4 Export" }), _jsx("button", { onClick: () => navigate("/add-kontrak"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" })] }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Pegawai" }), _jsx("div", { className: "border px-3 py-2 rounded-lg w-72 h-[39px] bg-white dark:bg-gray-700 dark:text-white flex items-center", children: _jsx("input", { type: "text", placeholder: "Cari nama pegawai...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value), className: "w-full bg-transparent focus:outline-none text-gray-900 dark:text-white" }) })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg h-[42px]", children: "Reset" })] })] }) }), _jsx("div", { className: "\n              overflow-x-auto\n              [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n              dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n              [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n              dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n              dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n              dark:[&_thead]:bg-gray-800\n              dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n              dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n              [&_tr]:transition-colors\n            ", children: _jsx(DataTable, { columns: columns, data: filteredKontraks, disableSearch: true }) })] })) }) })] }));
}
