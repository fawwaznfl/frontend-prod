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
import { Briefcase, CheckCircle, XCircle, Calendar, AlertTriangle, Coffee } from "lucide-react";
export default function DataDinasLuar() {
    const { searchTerm } = useSearch();
    const [absens, setAbsens] = useState([]);
    const [loading, setLoading] = useState(true);
    const dashboardType = localStorage.getItem("dashboard_type");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    const exportExcel = () => {
        const excelData = absens.map((a) => ({
            "Nama Pegawai": a.pegawai?.name || "-",
            Tanggal: a.tanggal,
            "Jam Masuk": a.jam_masuk || "-",
            "Jam Pulang": a.jam_pulang || "-",
            Keterangan: a.keterangan || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Absen");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        saveAs(new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }), `Data_Dinas Luar_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-blue-500 transition-all focus:outline-none", children: value || "Pilih tanggal" }));
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
    const fetchAbsens = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/dinas-luar", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAbsens(res.data.data);
        }
        catch (err) {
            console.error("Error fetching absen:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAbsens();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Absen?",
            text: "Data absen ini tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await api.delete(`/dinas-luar/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAbsens(absens.filter((a) => a.id !== id));
                Swal.fire("Terhapus!", "Data absen berhasil dihapus.", "success");
            }
            catch (error) {
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
            }
        }
    };
    const handleEdit = (row) => {
        navigate(`/edit-absen/${row.id}`);
    };
    const columns = [
        { header: "No", accessor: "id", cell: (_, index) => index + 1 },
        { header: "Nama Pegawai", accessor: "pegawai", cell: (row) => row.pegawai?.name || "-" },
        { header: "Shift", cell: (r) => r.shift?.nama || "-" },
        { header: "Tanggal", accessor: "tanggal" },
        { header: "Jam Masuk", accessor: "jam_masuk", cell: (r) => r.jam_masuk || "-" },
        {
            header: "Foto Masuk",
            cell: (r) => {
                if (!r.foto_masuk)
                    return "-";
                const foto = r.foto_masuk.startsWith("http")
                    ? r.foto_masuk
                    : `${STORAGE_URL}/${r.foto_masuk}`;
                return (_jsx("img", { src: foto, alt: "Foto Masuk", className: "w-14 h-14 object-cover rounded-full cursor-pointer border shadow-sm", onClick: () => window.open(foto, "_blank") }));
            },
        },
        { header: "Telat", accessor: "telat", cell: (r) => r.telat || "-" },
        { header: "Lokasi Masuk", cell: (r) => r.lokasi_masuk || "-" },
        { header: "Jam Pulang", accessor: "jam_pulang", cell: (r) => r.jam_pulang || "-" },
        {
            header: "Foto Pulang",
            cell: (r) => {
                if (!r.foto_pulang)
                    return "-";
                const foto = r.foto_pulang.startsWith("http")
                    ? r.foto_pulang
                    : `${STORAGE_URL}/${r.foto_pulang}`;
                return (_jsx("img", { src: foto, alt: "Foto Pulang", className: "w-14 h-14 object-cover rounded-full cursor-pointer border shadow-sm", onClick: () => window.open(foto, "_blank") }));
            },
        },
        { header: "Pulang Cepat", accessor: "pulang_cepat", cell: (r) => r.pulang_cepat || "-" },
        {
            header: "Status",
            cell: (row) => _jsx(StatusBadge, { status: row.status }),
        },
        { header: "Keterangan", accessor: "keterangan", cell: (r) => r.keterangan || "-" },
        {
            header: "Actions",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(row), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg", children: _jsx(Trash2, { size: 16 }) })] })),
        },
    ];
    const filteredAbsens = absens.filter((a) => {
        const name = (a.pegawai?.name ?? "").toLowerCase();
        const pegawaiMatch = name.includes(pegawaiSearch.toLowerCase());
        const tanggal = new Date(a.tanggal);
        const dateMatch = (!startDate || tanggal >= startDate) &&
            (!endDate || tanggal <= endDate);
        const companyMatch = !selectedCompany ||
            String(a.pegawai?.company_id) === selectedCompany;
        return pegawaiMatch && dateMatch && companyMatch;
    });
    const StatusBadge = ({ status }) => {
        if (!status)
            return _jsx("span", { children: "-" });
        const map = {
            hadir: {
                text: "Hadir",
                className: "bg-green-100 text-green-700 border-green-300",
                icon: _jsx(CheckCircle, { size: 14 }),
            },
            sakit: {
                text: "Sakit",
                className: "bg-yellow-100 text-yellow-700 border-yellow-300",
                icon: _jsx(AlertTriangle, { size: 14 }),
            },
            izin: {
                text: "Izin",
                className: "bg-blue-100 text-blue-700 border-blue-300",
                icon: _jsx(Calendar, { size: 14 }),
            },
            cuti: {
                text: "Cuti",
                className: "bg-purple-100 text-purple-700 border-purple-300",
                icon: _jsx(Coffee, { size: 14 }),
            },
            dinas_luar: {
                text: "Dinas Luar",
                className: "bg-cyan-100 text-cyan-700 border-cyan-300",
                icon: _jsx(Briefcase, { size: 14 }),
            },
            libur: {
                text: "Libur",
                className: "bg-gray-200 text-gray-700 border-gray-300",
                icon: _jsx(Calendar, { size: 14 }),
            },
            alpha: {
                text: "Alpha",
                className: "bg-red-100 text-red-700 border-red-300",
                icon: _jsx(XCircle, { size: 14 }),
            },
        };
        const item = map[status];
        return (_jsxs("span", { className: `
          inline-flex items-center gap-1.5
          px-3 py-1
          text-xs font-semibold
          rounded-full border
          whitespace-nowrap
          ${item?.className ?? "bg-gray-100 text-gray-600 border-gray-300"}
        `, children: [item?.icon, item?.text ?? status] }));
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Absen", description: "Data Absen Pegawai" }), _jsx(PageHeader, { pageTitle: "Data Dinas Luar", rightContent: _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: exportExcel, className: "bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl", children: "\uD83D\uDCC4 Export" }) }) }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { className: "p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Cari Pegawai" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "Cari nama pegawai...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value) })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg", children: "Reset" })] })] }) }), _jsx("div", { className: "\n                overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100 dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n                dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredAbsens, disableSearch: true }) })] })) }) })] }));
}
