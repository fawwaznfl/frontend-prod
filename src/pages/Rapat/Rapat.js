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
export default function Rapat() {
    const { searchTerm } = useSearch();
    const [rapatList, setRapatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const dashboardType = localStorage.getItem("dashboard_type");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
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
    // FETCH RAPAT
    const fetchRapat = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/rapat", {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log("DATA RAPAT:", res.data.data); 
            setRapatList(res.data.data);
        }
        catch (err) {
            console.error("Error fetching rapat:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRapat();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    // EXPORT EXCEL
    const exportExcel = () => {
        const excelData = rapatList.map((r) => ({
            "Nama Pertemuan": r.nama_pertemuan,
            Tanggal: r.tanggal_rapat,
            "Jam Mulai": r.waktu_mulai,
            "Jam Selesai": r.waktu_selesai,
            Lokasi: r.lokasi,
            "Jenis Pertemuan": r.jenis_pertemuan,
            "Company ID": r.company_id || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Rapat");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(file, `Data_Rapat_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Rapat yang dihapus tidak bisa dikembalikan!",
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
                await api.delete(`/rapat/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setRapatList(rapatList.filter((r) => r.id !== id));
                Swal.fire("Terhapus!", "Rapat berhasil dihapus.", "success");
            }
            catch {
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus rapat.", "error");
            }
        }
    };
    const handleEdit = (row) => navigate(`/edit-rapat/${row.id}`);
    // CUSTOM DATE INPUT
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-blue-500 transition-all", children: value || "Pilih tanggal" }));
    // TABLE COLUMNS
    const columns = [
        { header: "No", accessor: "id", width: "60px", cell: (_, idx) => idx + 1 },
        { header: "Nama Pertemuan", accessor: "nama_pertemuan" },
        {
            header: "Tanggal",
            accessor: "tanggal_rapat",
            cell: (row) => row.tanggal_rapat
                ? new Date(row.tanggal_rapat).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : "-",
        },
        {
            header: "Jam Mulai",
            accessor: "waktu_mulai",
            cell: (row) => (row.waktu_mulai ? row.waktu_mulai.substring(0, 5).replace(":", ".") : "-"),
        },
        {
            header: "Jam Selesai",
            accessor: "waktu_selesai",
            cell: (row) => (row.waktu_selesai ? row.waktu_selesai.substring(0, 5).replace(":", ".") : "-"),
        },
        { header: "Lokasi", accessor: "lokasi" },
        { header: "Jenis Pertemuan", accessor: "jenis_pertemuan" },
        {
            header: "Notulen",
            accessor: "file_notulen",
            cell: (row) => row.file_notulen ? (_jsxs("a", { href: row.file_notulen, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition w-fit text-sm", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" }) }), _jsx("span", { className: "font-medium", children: "Notulen" })] })) : (_jsx("span", { className: "text-gray-500", children: "-" })),
        },
        {
            header: "Actions",
            width: "150px",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg", title: "Edit", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg", title: "Hapus", children: _jsx(Trash2, { size: 16 }) })] })),
        },
    ];
    // FILTERED DATA
    const filteredRapat = rapatList.filter((r) => {
        const name = (r.pegawai?.name ?? "").toLowerCase();
        const pegawaiMatch = name.includes(pegawaiSearch.toLowerCase());
        const tanggal = new Date(r.tanggal_rapat);
        const dateMatch = (!startDate || tanggal >= startDate) && (!endDate || tanggal <= endDate);
        // <-- Perbaikan: bandingkan dengan String(selectedCompany) agar null/''
        const companyMatch = !selectedCompany || String(r.company_id) === String(selectedCompany);
        const searchMatch = r.nama_pertemuan.toLowerCase().includes(searchTerm.toLowerCase());
        return pegawaiMatch && dateMatch && companyMatch && searchMatch;
    });
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Daftar Rapat", description: "Manajemen data rapat" }), _jsx(PageHeader, { pageTitle: "Rapat", titleClass: "text-[32px] dark:text-white", rightContent: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: exportExcel, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl", children: "\uD83D\uDCC4 Export" }), _jsx("button", { onClick: () => navigate("/add-rapat"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" })] }) }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsx("div", { className: "flex flex-wrap gap-4", children: dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Company" }), _jsxs("select", { className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", value: selectedCompany ?? "", onChange: (e) => {
                                                            const value = e.target.value === "" ? null : e.target.value;
                                                            setSelectedCompany(value);
                                                        }, children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: String(c.id), children: c.name }, c.id)))] })] })) }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg h-[42px]", children: "Reset" })] })] }) }), _jsx("div", { className: "\n              overflow-x-auto\n              [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n              dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n              [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n              dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n              dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n              dark:[&_thead]:bg-gray-800\n              dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n              dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n              [&_tr]:transition-colors\n            ", children: _jsx(DataTable, { columns: columns, data: filteredRapat, disableSearch: true }) })] })) }) })] }));
}
