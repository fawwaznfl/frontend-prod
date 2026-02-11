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
import { CheckCircle, XCircle, Download, Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
export default function Reimbursements() {
    const { searchTerm } = useSearch();
    const navigate = useNavigate();
    const [reims, setReims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const dashboardType = localStorage.getItem("dashboard_type");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [pegawaiSearch, setPegawaiSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const formatRupiah = (value) => {
        if (!value)
            return "Rp0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value));
    };
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-lg w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200", children: value || "Pilih tanggal" }));
    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies");
            setCompanies(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch companies", err);
        }
    };
    const fetchReims = async () => {
        try {
            const res = await api.get("/reimbursement");
            setReims(res.data.data);
        }
        catch (err) {
            console.error("Error fetch reimbursements", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReims();
        if (localStorage.getItem("dashboard_type") === "superadmin") {
            fetchCompanies();
        }
    }, []);
    const handleEdit = (row) => navigate(`/edit-reimbursement/${row.id}`);
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin hapus?",
            text: "Data reimbursement akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
        });
        if (!result.isConfirmed)
            return;
        try {
            await api.delete(`/reimbursement/${id}`);
            setReims(reims.filter((r) => r.id !== id));
            Swal.fire("Berhasil", "Data berhasil dihapus", "success");
        }
        catch {
            Swal.fire("Gagal", "Tidak dapat menghapus data", "error");
        }
    };
    const handleReject = async (id) => {
        const ok = await Swal.fire({
            title: "Tolak Reimbursement?",
            text: "Tidak bisa dibatalkan setelah ditolak.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Tolak",
        });
        if (!ok.isConfirmed)
            return;
        try {
            await api.put(`/reimbursement/${id}/reject`);
            fetchReims();
            Swal.fire("Ditolak", "Reimbursement berhasil ditolak", "success");
        }
        catch {
            Swal.fire("Gagal", "Tidak dapat reject reimbursement", "error");
        }
    };
    const handleApprove = async (id) => {
        const { value: file } = await Swal.fire({
            title: "Upload Bukti Approved (Opsional)",
            html: `
        <input type="file" id="buktiFile" class="swal2-file" />
        <small style="color:gray;">
          Boleh dikosongkan. (jpg, png, pdf | max 2MB)
        </small>
      `,
            confirmButtonText: "Submit",
            showCancelButton: true,
            preConfirm: () => {
                const input = document.getElementById("buktiFile");
                const file = input?.files?.[0];
                if (!file)
                    return null;
                const allowed = ["image/jpeg", "image/png", "application/pdf"];
                if (!allowed.includes(file.type)) {
                    Swal.showValidationMessage("Format harus JPG, PNG, atau PDF");
                    return false;
                }
                if (file.size > 2 * 1024 * 1024) {
                    Swal.showValidationMessage("Ukuran file maksimal 2MB");
                    return false;
                }
                return file;
            },
        });
        if (file === undefined)
            return;
        Swal.fire({
            title: "Memproses...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
        try {
            const formData = new FormData();
            if (file) {
                formData.append("approved_file", file);
            }
            await api.post(`/reimbursement/${id}/approve`, formData);
            Swal.close();
            fetchReims();
            Swal.fire("Berhasil!", "Reimbursement telah di-approve.", "success");
        }
        catch {
            Swal.close();
            Swal.fire("Gagal", "Approve reimbursement gagal.", "error");
        }
    };
    const renderMetode = (row) => {
        if (row.metode_reim === "transfer") {
            return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-300", children: "Transfer" }), row.no_rekening && (_jsx("span", { className: "text-xs text-gray-500", children: row.no_rekening }))] }));
        }
        return (_jsx("span", { className: "inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-300", children: "Cash" }));
    };
    const columns = [
        { header: "No", accessor: "id", cell: (_, i) => i + 1, width: "60px" },
        { header: "Tanggal", accessor: "tanggal" },
        {
            header: "Nama",
            accessor: "pegawai",
            cell: (row) => row.pegawai?.name ?? "-",
        },
        { header: "Event", accessor: "event" },
        {
            header: "Kategori",
            accessor: "kategori",
            cell: (row) => row.kategori?.nama ?? "-",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => {
                const status = row.status.toLowerCase();
                const style = status === "pending"
                    ? // PENDING
                        "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-600/30 dark:text-yellow-300 dark:border-yellow-500"
                    : status === "approve"
                        ? // APPROVE
                            "bg-green-100 text-green-800 border-green-300 dark:bg-green-600/30 dark:text-green-300 dark:border-green-500"
                        : status === "reject"
                            ? // REJECT
                                "bg-red-100 text-red-800 border-red-300 dark:bg-red-600/30 dark:text-red-300 dark:border-red-500"
                            : "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-600/30 dark:text-gray-300 dark:border-gray-500";
                return (_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold border ${style}`, children: status === "approve"
                        ? "Approved"
                        : status === "reject"
                            ? "Rejected"
                            : "Pending" }));
            },
        },
        { header: "Terpakai", accessor: "terpakai", cell: (row) => formatRupiah(row.terpakai), },
        { header: "Total", accessor: "total", cell: (row) => formatRupiah(row.total), },
        { header: "Sisa", accessor: "sisa", cell: (row) => formatRupiah(row.sisa), },
        {
            header: "Metode Reim",
            accessor: "metode_reim",
            cell: (row) => renderMetode(row),
        },
        {
            header: "File",
            accessor: "file",
            cell: (row) => {
                const files = [
                    row.file
                        ? {
                            url: row.file.startsWith("http")
                                ? row.file
                                : `${STORAGE_URL}/${row.file}`,
                            label: "Pengajuan",
                            color: "bg-blue-600 hover:bg-blue-700",
                            icon: _jsx(Eye, { size: 16 }),
                        }
                        : null,
                    row.approved_file
                        ? {
                            url: row.approved_file.startsWith("http")
                                ? row.approved_file
                                : `${STORAGE_URL}/${row.approved_file}`,
                            label: "Approved",
                            color: "bg-green-600 hover:bg-green-700",
                            icon: _jsx(Download, { size: 16 }),
                        }
                        : null,
                ].filter((f) => f !== null);
                if (files.length === 0)
                    return "-";
                return (_jsx("div", { className: "flex items-center gap-2", children: files.map((f, i) => (_jsx("button", { onClick: () => window.open(f.url, "_blank"), className: `${f.color} text-white p-2 rounded flex items-center gap-1`, title: f.label, children: f.icon }, i))) }));
            },
        },
        {
            header: "Actions",
            width: "150px",
            cell: (row) => (_jsxs("div", { className: "flex gap-2", children: [row.status === "pending" && (_jsx("button", { onClick: () => handleApprove(row.id), className: "bg-green-600 hover:bg-green-700 text-white p-2 rounded-full", children: _jsx(CheckCircle, { size: 18 }) })), row.status === "pending" && (_jsx("button", { onClick: () => handleReject(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-full", children: _jsx(XCircle, { size: 18 }) })), _jsx("button", { onClick: () => handleDelete(row.id), className: "bg-red-600 hover:bg-red-700 text-white p-2 rounded-full", children: _jsx(Trash2, { size: 16 }) })] })),
        },
    ];
    // ==================== FILTERING ====================
    const filteredReims = reims.filter((r) => {
        const nameMatch = r.pegawai?.name
            ?.toLowerCase()
            .includes(pegawaiSearch.toLowerCase());
        const companyMatch = !selectedCompany ||
            String(r.pegawai?.company_id) === String(selectedCompany);
        const tanggal = new Date(r.tanggal);
        const dateMatch = (!startDate || tanggal >= startDate) &&
            (!endDate || tanggal <= endDate);
        return nameMatch && companyMatch && dateMatch;
    });
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Reimbursements", description: "Daftar Reimbursements" }), _jsx(PageHeader, { pageTitle: "Reimbursements", rightContent: _jsx("button", { onClick: () => navigate("/add-reimbursement"), className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "+ Tambah" }) }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 p-0", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("div", { className: "datatable-no-search", children: [_jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border mb-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:justify-between gap-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "mb-1 dark:text-white", children: "Cari Pegawai" }), _jsx("input", { type: "text", placeholder: "Cari nama...", value: pegawaiSearch, onChange: (e) => setPegawaiSearch(e.target.value), className: "border px-3 py-2 rounded-lg w-full sm:w-64 dark:bg-gray-700 dark:text-white" })] }), dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "mb-1 dark:text-white", children: "Company" }), _jsxs("select", { className: "border px-3 py-2 rounded-lg w-64 dark:bg-gray-700 dark:text-white", value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), children: [_jsx("option", { value: "", children: "Semua Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 sm:items-end w-full md:w-auto", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "mb-1 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "mb-1 dark:text-white", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", customInput: _jsx(CustomInput, {}) })] }), _jsx("button", { onClick: () => {
                                                        setPegawaiSearch("");
                                                        setSelectedCompany("");
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                    }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto", children: "Reset" })] })] }) }), _jsx("div", { className: "\n                overflow-x-auto\n                [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n                dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100\n                [&_input]:bg-white [&_input]:text-gray-900 [&_input::placeholder]:text-gray-400\n                dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_input::placeholder]:text-gray-400\n                dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n                dark:[&_thead]:bg-gray-800\n                dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100\n                dark:[&_tr]:border-gray-700 dark:[&_td]:border-gray-700\n                [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: filteredReims, disableSearch: true }) })] })) }) })] }));
}
