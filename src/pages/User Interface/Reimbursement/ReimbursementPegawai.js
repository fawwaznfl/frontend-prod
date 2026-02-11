import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Trash2, Eye } from "lucide-react";
import api from "../../../api/axios";
import { ArrowLeft, Search, Grid, } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
export default function ReimbursementPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [query, setQuery] = useState("");
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const formatRupiah = (value) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    // ================= FETCH =================
    const fetchReimbursementPegawai = async () => {
        try {
            const res = await api.get(`/reimbursement`);
            setItems(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch reimbursements pegawai", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReimbursementPegawai();
    }, []);
    // ================= FILTER =================
    const filtered = items.filter((it) => {
        const tanggal = new Date(it.tanggal);
        const matchQuery = query === "" ||
            it.event?.toLowerCase().includes(query.toLowerCase()) ||
            it.kategori?.nama?.toLowerCase().includes(query.toLowerCase());
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        return matchQuery && matchFrom && matchTo;
    });
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data reimbursement akan dihapus dan tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/reimbursement/${id}`);
                    setItems(items.filter((item) => item.id !== id));
                    Swal.fire({
                        icon: "success",
                        title: "Terhapus!",
                        text: "Reimbursement berhasil dihapus.",
                        timer: 1300,
                        showConfirmButton: false,
                    });
                }
                catch (err) {
                    console.error("Error delete reimbursement:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Terjadi error saat menghapus data",
                    });
                }
            }
        });
    };
    const renderStatus = (status) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize";
        const normalizedStatus = status?.toLowerCase().trim();
        switch (normalizedStatus) {
            case "approved":
            case "approve":
                return (_jsx("span", { className: `${baseClass} bg-green-100 text-green-700`, children: "Approved" }));
            case "rejected":
            case "reject":
                return (_jsx("span", { className: `${baseClass} bg-red-100 text-red-700`, children: "Rejected" }));
            case "pending":
            default:
                return (_jsx("span", { className: `${baseClass} bg-yellow-100 text-yellow-700`, children: "Pending" }));
        }
    };
    const renderMetode = (metode) => {
        if (metode === "transfer") {
            return (_jsx("span", { className: "mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700", children: "Transfer" }));
        }
        return (_jsx("span", { className: "mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700", children: "Cash" }));
    };
    // User Interface
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 rounded-md mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Reimbursement" }) }), _jsx("button", { className: "p-2 rounded-md opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border border-gray-100", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Mulai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 w-full" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Selesai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 w-full" }), _jsx("button", { onClick: () => setQuery(""), className: "w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-sm", children: _jsx(Search, { className: "w-5 h-5 text-indigo-600" }) })] }) }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("button", { onClick: () => navigate("/add-reimbursement-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 transition active:scale-95", children: "+ Tambah" }), _jsx("div", { className: "text-xs text-gray-500" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-100", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Daftar Reimbursement" }), _jsx("p", { className: "text-xs text-gray-400", children: "Riwayat pengajuan reimbursement" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-white text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "No" }), _jsx("th", { className: "px-4 py-3", children: "Tanggal" }), _jsx("th", { className: "px-4 py-3", children: "Event" }), _jsx("th", { className: "px-4 py-3", children: "Kategori" }), _jsx("th", { className: "px-4 py-3", children: "Status" }), _jsx("th", { className: "px-4 py-3", children: "Terpakai" }), _jsx("th", { className: "px-4 py-3", children: "Total" }), _jsx("th", { className: "px-4 py-3", children: "Sisa" }), _jsx("th", { className: "px-4 py-3", children: "Metode" }), _jsx("th", { className: "px-4 py-3", children: "File" }), _jsx("th", { className: "px-4 py-3", children: "Aksi" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 13, className: "text-center px-6 py-10 text-gray-400 text-sm", children: "Tidak ada data reimbursement" }) })) : (filtered.map((it, idx) => {
                                                const total = Number(it.total);
                                                const terpakai = Number(it.terpakai ?? 0);
                                                const sisa = Number(it.total) - Number(it.terpakai ?? 0);
                                                return (_jsxs("tr", { className: "border-t border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsx("td", { className: "px-4 py-3", children: it.tanggal }), _jsx("td", { className: "px-4 py-3", children: it.event }), _jsx("td", { className: "px-4 py-3", children: it.kategori?.nama }), _jsx("td", { className: "px-4 py-3", children: renderStatus(it.status) }), _jsx("td", { className: "px-4 py-3", children: formatRupiah(terpakai) }), _jsx("td", { className: "px-4 py-3", children: formatRupiah(total) }), _jsx("td", { className: "px-4 py-3", children: formatRupiah(sisa) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [renderMetode(it.metode_reim), it.metode_reim === "transfer" && it.no_rekening && (_jsx("span", { className: "text-xs text-gray-500", children: it.no_rekening }))] }) }), _jsx("td", { className: "px-4 py-3", children: it.file ? (_jsx("button", { onClick: () => window.open(`${BASE_URL}/storage/${it.file}`, "_blank"), className: "text-indigo-600 hover:text-indigo-800 transition", children: _jsx(Eye, { className: "w-4 h-4" }) })) : ("-") }), _jsx("td", { className: "px-4 py-3", children: (() => {
                                                                const status = it.status?.toLowerCase();
                                                                // ================= APPROVED =================
                                                                if (status === "approve" || status === "approved") {
                                                                    return (_jsx("span", { className: "text-xs text-green-600 font-medium", children: "Data sudah disetujui" }));
                                                                }
                                                                // ================= REJECTED =================
                                                                if (status === "reject" || status === "rejected") {
                                                                    return (_jsx("span", { className: "text-xs text-red-600 font-medium", children: "Reimbursement ditolak" }));
                                                                }
                                                                // ================= PENDING =================
                                                                return (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate(`/edit-reimbursement-pegawai/${it.id}`), className: "text-blue-600", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(it.id), className: "text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }));
                                                            })() })] }, idx));
                                            })) })] }) })] })] }), _jsx(BottomNav, {})] }));
}
