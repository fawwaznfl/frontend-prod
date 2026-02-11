import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Grid, FileDown } from "lucide-react";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
export default function PenggajianPegawai() {
    const navigate = useNavigate();
    const pegawai = JSON.parse(localStorage.getItem("pegawai") || "{}");
    const pegawaiId = pegawai.id;
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const formatRupiah = (value) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    // ================= FETCH =================
    const fetchPenggajian = async () => {
        try {
            const res = await api.get("/penggajian"); // 🔥 HAPUS params
            setItems(res.data || []);
        }
        catch (err) {
            console.error("Error fetch penggajian", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPenggajian();
    }, []);
    // ================= FILTER =================
    const filtered = items.filter((it) => {
        const tanggal = new Date(it.tanggal);
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        return matchFrom && matchTo;
    });
    const renderStatus = (status) => {
        const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize";
        if (status === "approved") {
            return (_jsx("span", { className: `${base} bg-green-100 text-green-700`, children: "Approved" }));
        }
        return (_jsx("span", { className: `${base} bg-yellow-100 text-yellow-700`, children: "Pending" }));
    };
    const downloadPdf = async (id) => {
        const res = await api.get(`/penggajian/${id}/pdf`, {
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `slip-gaji-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
    };
    const downloadPdfSlip = async (id) => {
        const res = await api.get(`/penggajian/${id}/pdf-slip`, {
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        window.open(url);
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 rounded-md mr-2", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Data Penggajian Karyawan" }) }), _jsx(Grid, { className: "w-5 h-5 opacity-80" })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg", children: _jsxs("div", { className: "flex gap-3", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Mulai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Selesai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" })] }) }) }), _jsx("div", { className: "px-5 mt-5", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-100", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Daftar Penggajian Karyawan" }), _jsx("p", { className: "text-xs text-gray-400", children: "Riwayat Penggajian Karyawan" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-center", children: [_jsx("thead", { className: "bg-white text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "No" }), _jsx("th", { className: "px-4 py-3", children: "Nomor Gaji" }), _jsx("th", { className: "px-4 py-3", children: "Nama" }), _jsx("th", { className: "px-4 py-3", children: "Jabatan" }), _jsx("th", { className: "px-4 py-3", children: "Bulan" }), _jsx("th", { className: "px-4 py-3", children: "Grand Total" }), _jsx("th", { className: "px-4 py-3", children: "Detail Perpajakan" }), _jsx("th", { className: "px-4 py-3", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 13, className: "text-center px-6 py-10 text-gray-400 text-sm", children: "Tidak ada data Penggajian" }) })) : (filtered.map((it, idx) => {
                                            const total = Number(it.total);
                                            const terpakai = Number(it.terpakai ?? 0);
                                            const sisa = Number(it.total) - Number(it.terpakai ?? 0);
                                            return (_jsxs("tr", { className: "border-t border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsx("td", { className: "px-4 py-3", children: it.nomor_gaji }), _jsx("td", { className: "px-4 py-3", children: it.pegawai?.name }), _jsx("td", { className: "px-4 py-3", children: it.pegawai?.divisi?.nama ?? "-" }), _jsx("td", { className: "px-4 py-3", children: it.bulan }), _jsx("td", { className: "px-4 py-3", children: formatRupiah(it.gaji_diterima) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("button", { onClick: () => downloadPdf(it.id), className: "\n                      inline-flex items-center gap-2\n                      px-3 py-1.5\n                      rounded-lg\n                      bg-red-50 text-red-600\n                      font-semibold text-xs\n                      hover:bg-red-100 hover:text-red-700\n                      transition-all duration-200\n                    ", children: [_jsx(FileDown, { className: "w-4 h-4" }), "Download PDF"] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("button", { onClick: () => downloadPdfSlip(it.id), className: "\n                      inline-flex items-center gap-2\n                      px-3 py-1.5\n                      rounded-lg\n                      bg-red-50 text-red-600\n                      font-semibold text-xs\n                      hover:bg-red-100 hover:text-red-700\n                      transition-all duration-200\n                    ", children: [_jsx(FileDown, { className: "w-4 h-4" }), "Download PDF"] }) })] }, idx));
                                        })) })] }) })] }) }), _jsx(BottomNav, {})] }));
}
