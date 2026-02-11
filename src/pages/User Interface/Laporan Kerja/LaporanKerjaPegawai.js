import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
export default function LaporanKerjaPegawai() {
    const navigate = useNavigate();
    const [laporan, setLaporan] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [search, setSearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.id;
    // ================= FETCH =================
    const fetchLaporan = async () => {
        const res = await api.get(`/laporan-kerja/by-pegawai/${pegawai_id}`);
        setLaporan(res.data.data ?? []);
    };
    useEffect(() => {
        fetchLaporan();
    }, []);
    // ================= FILTER =================
    const filteredLaporan = laporan.filter((l) => {
        const tanggal = new Date(l.tanggal_laporan);
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        const matchSearch = !search ||
            l.informasi_umum.toLowerCase().includes(search.toLowerCase());
        return matchFrom && matchTo && matchSearch;
    });
    // ================= DELETE =================
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus laporan?",
            text: "Laporan tidak bisa dikembalikan",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        await api.delete(`/laporan-kerja/${id}`);
        setLaporan((prev) => prev.filter((l) => l.id !== id));
        Swal.fire("Terhapus", "Laporan kerja berhasil dihapus", "success");
    };
    const handleViewFile = (url) => {
        if (!url) {
            Swal.fire("File tidak ditemukan", "", "warning");
            return;
        }
        window.open(url, "_blank");
    };
    // ================= UI =================
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Laporan Kerja" }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: [_jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" })] }), _jsx("div", { className: "flex gap-3 items-center mt-3", children: _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Cari judul laporan...", className: "w-full border rounded-lg px-3 py-2 text-sm bg-gray-50" }) })] }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-laporan-kerja-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md", children: "+ Laporan" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b", children: [_jsx("p", { className: "\n                  font-semibold text-gray-800\n                  text-base sm:text-lg md:text-xl\n                ", children: "Daftar Laporan Kerja" }), _jsx("p", { className: "text-xs text-gray-500", children: "Riwayat laporan kerja pegawai" })] }), _jsxs("div", { className: "divide-y", children: [filteredLaporan.map((l) => (_jsxs("div", { onClick: () => navigate(`/laporan-kerja/${l.id}`), className: "\n                px-4 py-4 flex justify-between gap-4\n                hover:bg-gray-50 cursor-pointer\n              ", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "\n                  font-semibold text-gray-800\n                  text-base sm:text-lg md:text-xl\n                ", children: "Laporan" }), _jsx("p", { className: "\n                  mt-1 text-gray-700\n                  text-sm sm:text-base md:text-lg\n                  line-clamp-2\n                ", children: l.informasi_umum })] }), _jsx("div", { className: "\n                text-gray-500 whitespace-nowrap\n                text-xs sm:text-sm md:text-base\n              ", children: new Date(l.tanggal_laporan).toLocaleDateString("id-ID") })] }, l.id))), filteredLaporan.length === 0 && (_jsx("div", { className: "p-6 text-center text-gray-400", children: "Tidak ada laporan" }))] })] })] }), _jsx(BottomNav, {})] }));
}
