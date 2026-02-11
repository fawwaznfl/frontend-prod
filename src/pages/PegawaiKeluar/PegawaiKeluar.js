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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, Eye, CheckCircle, Trash2 } from "lucide-react";
export default function PegawaiKeluar() {
    const { searchTerm } = useSearch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dashboardType = localStorage.getItem("dashboard_type");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    // Export Excel
    const exportExcel = () => {
        const excelData = data.map((d) => ({
            "Nama Pegawai": d.pegawai?.name || "-",
            "Tanggal Keluar": d.tanggal_keluar,
            "Jenis Keberhentian": d.jenis_keberhentian,
            "Alasan": d.alasan || "-",
            "User Approval": d.user_approval || "-",
            "Status": d.status || "-",
            "Note Approver": d.note_approver || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pegawai Keluar");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, `Data_Pegawai_Keluar_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    // Date Filters
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "\n      border px-3 py-2 rounded-md w-40 text-left bg-white text-gray-900 hover:border-blue-500\n      dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:border-blue-400", children: value || "Pilih tanggal" }));
    // Fetch Data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const userCompany = localStorage.getItem("company_id");
            const res = await api.get("/pegawai-keluar", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    dashboard_type: dashboardType,
                    company_id: dashboardType === "superadmin"
                        ? selectedCompany || undefined
                        : userCompany,
                },
            });
            const result = res.data.data ?? res.data ?? [];
            setData(result);
        }
        catch (err) {
            console.error("Error fetching pegawai keluar:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const key = status || "default";
    const badgeClasses = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        default: "bg-gray-100 text-gray-700",
    };
    const fetchCompanies = async () => {
        if (dashboardType !== "superadmin") {
            setCompanies([]);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = Array.isArray(res.data.data) ? res.data.data : [];
            setCompanies(result);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
            setCompanies([]);
        }
    };
    useEffect(() => {
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, [selectedCompany]);
    // Edit
    const handleEdit = (row) => {
        navigate(`/edit-pegawai-keluar/${row.id}`);
    };
    // Delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus permanen!",
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
                await api.delete(`/pegawai-keluar/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(data.filter((d) => d.id !== id));
                Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            }
            catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
            }
        }
    };
    // Approve
    const handleApprove = async (row) => {
        const { value: formValues } = await Swal.fire({
            title: "Approval Pegawai Keluar",
            width: "450px",
            html: `
        <div style="text-align: left; padding: 5px 0;">
          <label style="font-weight: 600;">Status</label>
          <select id="swal-status"
            style="
              width: 100%;
              margin-top: 6px;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              outline: none;
              font-size: 14px;
            ">
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style="text-align: left; margin-top: 15px;">
          <label style="font-weight: 600;">Catatan</label>
          <textarea id="swal-note"
            style="
              width: 100%;
              margin-top: 6px;
              padding: 10px;
              height: 120px;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              outline: none;
              font-size: 14px;
              resize: none;
            "
          ></textarea>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            focusConfirm: false,
            preConfirm: () => {
                const status = document.getElementById("swal-status")?.value;
                const note = document.getElementById("swal-note")?.value;
                if (!status) {
                    Swal.showValidationMessage("Status harus dipilih!");
                    return false;
                }
                return { status, note };
            },
        });
        if (!formValues)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.put(`/pegawai-keluar/${row.id}/approve`, {
                status: formValues.status,
                note_approver: formValues.note,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Status berhasil diperbarui.", "success");
            fetchData();
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
        }
    };
    // Table Columns (UPDATED)
    const columns = [
        { header: "No", accessor: "id", cell: (_, index) => index + 1, width: "60px" },
        { header: "Nama Pegawai", accessor: "pegawai", cell: (row) => row.pegawai?.name || "-" },
        { header: "Tanggal Keluar", accessor: "tanggal_keluar" },
        { header: "Jenis", accessor: "jenis_keberhentian" },
        { header: "Alasan", accessor: "alasan", cell: (row) => row.alasan || "-" },
        // NEW
        { header: "User Approval", accessor: "user_approval", cell: (row) => row.user_approval || "-" },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => {
                const status = row.status?.toLowerCase() || "default";
                const badgeClasses = {
                    pending: "bg-yellow-100 text-yellow-700",
                    approved: "bg-green-100 text-green-700",
                    rejected: "bg-red-100 text-red-700",
                    default: "bg-gray-100 text-gray-700",
                };
                return (_jsx("span", { className: `px-4 py-1 rounded-full text-xs font-semibold ${badgeClasses[status]}`, children: (row.status || "-").toUpperCase() }));
            },
        },
        { header: "Note Approver", accessor: "note_approver", cell: (row) => row.note_approver || "-" },
        {
            header: "File",
            accessor: "upload_file",
            cell: (row) => row.upload_file ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => window.open(row.upload_file, "_blank"), className: "bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center", children: _jsx(Eye, { size: 16 }) }), _jsx("button", { onClick: () => {
                            const link = document.createElement("a");
                            link.href = row.upload_file;
                            link.download = row.upload_file.split("/").pop() || "file.pdf";
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        }, className: "bg-green-600 hover:bg-green-700 text-white p-2 rounded flex items-center", children: _jsx(Download, { size: 16 }) })] })) : ("-"),
        },
        {
            header: "Actions",
            width: "150px",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [row.status === "pending" && (_jsx("button", { onClick: () => handleApprove(row), className: "bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded flex items-center justify-center", title: "Approve", children: _jsx(CheckCircle, { size: 18 }) })), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center", title: "Hapus", children: _jsx(Trash2, { size: 18 }) })] })),
        },
    ];
    // Filtering (Search + Date)
    const filteredData = data.filter((d) => {
        const name = (d.pegawai?.name ?? "").toLowerCase();
        const pegawaiMatch = name.includes(pegawaiSearch.toLowerCase());
        const searchMatch = name.includes(searchTerm.toLowerCase());
        const keluar = new Date(d.tanggal_keluar);
        const dateMatch = (!startDate || keluar >= startDate) &&
            (!endDate || keluar <= endDate);
        // FIX: gunakan d.company_id
        const companyMatch = !selectedCompany || String(d.company_id) === selectedCompany;
        return pegawaiMatch && dateMatch && companyMatch;
    });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Pegawai Keluar", description: "Daftar Pegawai Keluar" }), _jsx(PageHeader, { pageTitle: "Pegawai Keluar", titleClass: "text-[32px] dark:text-white", rightContent: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: exportExcel, className: "bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl", children: "\uD83D\uDCC4 Export" }), _jsx("button", { onClick: () => navigate("/add-pegawai-keluar"), className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl", children: "+ Tambah" })] }) }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: loading ? (_jsx("p", { children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 mb-4", children: _jsxs("div", { className: "flex flex-wrap justify-between gap-6 items-center", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cari Pegawai" }), _jsx("div", { className: "border px-3 py-2 rounded-lg w-72 h-[39px] bg-white dark:bg-gray-700 dark:text-white flex items-center", children: _jsx("input", { type: "text", placeholder: "Cari nama pegawai...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value), className: "w-full bg-transparent focus:outline-none text-gray-900 dark:text-white" }) })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Company" }), _jsxs("select", { className: "border px-3 py-2 rounded-lg w-72 bg-white dark:bg-gray-700 dark:text-white", value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg h-[42px]", children: "Reset" })] })] }) }), _jsx("div", { className: "\n                          overflow-x-auto\n                          [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                          dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                          [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                          dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                          dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n                          dark:[&_thead]:bg-gray-800\n                          dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n                          dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n                          [&_tr]:transition-colors\n                        ", children: _jsx(DataTable, { columns: columns, data: filteredData, disableSearch: true }) })] })) }) }), _jsx("style", { children: `
          .datatable-no-search .rdt_Search input {
          display: none !important;
        }
        ` })] }));
}
