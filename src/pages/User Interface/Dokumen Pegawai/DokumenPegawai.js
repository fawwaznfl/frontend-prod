import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Grid, Trash2, Edit, Eye } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
export default function DokumenPegawai() {
    const navigate = useNavigate();
    const [dokumen, setDokumen] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [search, setSearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.id;
    // ================= FETCH =================
    const fetchDokumen = async () => {
        const res = await api.get(`/dokumen-pegawai/by-pegawai/${pegawai_id}`);
        setDokumen(res.data.data ?? []);
    };
    useEffect(() => {
        fetchDokumen();
    }, []);
    // ================= FILTER =================
    const filteredDokumen = dokumen.filter((d) => {
        const tanggal = new Date(d.tanggal_upload);
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        const matchSearch = !search ||
            d.nama_dokumen.toLowerCase().includes(search.toLowerCase());
        return matchFrom && matchTo && matchSearch;
    });
    // ================= DELETE =================
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus dokumen?",
            text: "Dokumen tidak bisa dikembalikan",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        await api.delete(`/dokumen-pegawai/${id}`);
        setDokumen((prev) => prev.filter((d) => d.id !== id));
        Swal.fire("Terhapus", "Dokumen berhasil dihapus", "success");
    };
    const handleViewFile = (url) => {
        if (!url) {
            Swal.fire("File tidak ditemukan", "", "warning");
            return;
        }
        window.open(url, "_blank");
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Dokumen Pegawai" }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: [_jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" })] }), _jsx("div", { className: "flex gap-3 items-center mt-3", children: _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Cari nama dokumen...", className: "w-full border rounded-lg px-3 py-2 text-sm bg-gray-50" }) })] }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-dokumen-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md", children: "+ Dokumen" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Daftar Dokumen" }), _jsx("p", { className: "text-xs text-gray-400", children: "Daftar Dokumen yang pernah diupload" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 text-center", children: "No" }), _jsx("th", { className: "p-3 text-center", children: "Dokumen" }), _jsx("th", { className: "p-3 text-center", children: "Tanggal" }), _jsx("th", { className: "p-3 text-center", children: "Aksi" })] }) }), _jsxs("tbody", { children: [filteredDokumen.map((d, i) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-3 text-center", children: i + 1 }), _jsx("td", { className: "p-3 text-center font-medium", children: d.nama_dokumen }), _jsx("td", { className: "p-3 text-center", children: new Date(d.tanggal_upload).toLocaleDateString("id-ID") }), _jsx("td", { className: "p-3 text-center", children: _jsxs("div", { className: "flex justify-center gap-3", children: [d.file_url && (_jsx("button", { onClick: () => handleViewFile(d.file_url), className: "text-emerald-600", children: _jsx(Eye, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => navigate(`/edit-dokumen-pegawai/${d.id}`), className: "text-blue-600", title: "Edit", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(d.id), className: "text-red-600", title: "Hapus", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, d.id))), filteredDokumen.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center p-6 text-gray-400", children: "Tidak ada dokumen" }) }))] })] }) })] })] }), _jsx(BottomNav, {})] }));
}
