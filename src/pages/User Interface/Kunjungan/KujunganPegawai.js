import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { ArrowLeft, Search, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
export default function KunjunganPegawai() {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // ================= FETCH =================
    const fetchKunjungan = async () => {
        try {
            const res = await api.get("/kunjungan");
            setItems(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch kunjungan", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchKunjungan();
    }, []);
    // ================= FILTER =================
    const filtered = items.filter((it) => {
        const tgl = new Date(it.created_at);
        const matchFrom = !fromDate || tgl >= fromDate;
        const matchTo = !toDate || tgl <= toDate;
        return matchFrom && matchTo;
    });
    const formatTanggal = (date) => new Date(date).toLocaleString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const statusBadge = (status) => {
        const map = {
            berlangsung: "bg-blue-100 text-blue-700",
            selesai: "bg-green-100 text-green-700",
            batal: "bg-red-100 text-red-700",
        };
        return (_jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-600"}`, children: status }));
    };
    const previewImage = (url) => {
        Swal.fire({
            imageUrl: url,
            imageAlt: "Lampiran",
            showConfirmButton: false,
            showCloseButton: true,
            background: "#fff",
        });
    };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin?",
            text: "Data kunjungan akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            await api.delete(`/kunjungan/${id}`);
            setItems((prev) => prev.filter((i) => i.id !== id));
            Swal.fire("Berhasil", "Data kunjungan dihapus", "success");
        }
        catch (err) {
            Swal.fire("Gagal", "Tidak bisa menghapus data", "error");
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Kunjungan" }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx("button", { onClick: () => {
                                            setFromDate(null);
                                            setToDate(null);
                                        }, className: "w-11 h-11 rounded-lg bg-indigo-50 border flex items-center justify-center", children: _jsx(Search, { className: "w-5 h-5 text-indigo-600" }) })] }) }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-kunjungan-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md", children: "+ Visit In" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Riwayat Kunjungan" }), _jsx("p", { className: "text-xs text-gray-400", children: "Data visit in & visit out" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: "No" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Visit In" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Visit Out" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Status" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Actions" })] }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-10 text-center text-gray-400", children: "Loading..." }) })) : filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-10 text-center text-gray-400", children: "Tidak ada data kunjungan" }) })) : (filtered.map((it, idx) => (_jsxs("tr", { className: "border-t align-top", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "font-medium text-gray-800", children: formatTanggal(it.created_at) }), it.keterangan && (_jsxs("p", { className: "text-xs text-gray-600", children: ["Keterangan: ", it.keterangan] })), _jsxs("div", { className: "flex gap-3 text-xs pt-1", children: [it.upload_foto && (_jsx("button", { onClick: () => previewImage(`${import.meta.env.VITE_API_BASE_URL}/storage/${it.upload_foto}`), className: "text-blue-600", children: "\uD83D\uDCCE Lampiran" })), it.lokasi_masuk && (_jsx("a", { href: `https://www.google.com/maps?q=${it.lokasi_masuk}`, target: "_blank", rel: "noopener noreferrer", className: "text-green-600", children: "\uD83D\uDCCD Lokasi" }))] })] }) }), _jsx("td", { className: "px-4 py-3", children: it.foto_keluar ? (
                                                        // ================= SUDAH VISIT OUT =================
                                                        _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "font-medium text-gray-800", children: formatTanggal(it.updated_at) }), it.keterangan_keluar && (_jsxs("p", { className: "text-xs text-gray-600", children: ["Keterangan: ", it.keterangan_keluar] })), _jsxs("div", { className: "flex gap-3 text-xs pt-1", children: [it.foto_keluar && (_jsx("button", { onClick: () => previewImage(`${import.meta.env.VITE_API_BASE_URL}/storage/${it.foto_keluar}`), className: "text-blue-600", children: "\uD83D\uDCCE Lampiran" })), it.lokasi_keluar && (_jsx("a", { href: `https://www.google.com/maps?q=${it.lokasi_keluar}`, target: "_blank", rel: "noopener noreferrer", className: "text-green-600", children: "\uD83D\uDCCD Lokasi" }))] })] })) : (
                                                        // ================= BELUM VISIT OUT =================
                                                        _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-xs text-gray-400", children: "Belum Visit Out" }), _jsx("button", { onClick: () => navigate(`/kunjungan-pegawai/visit-out/${it.id}`), className: "\n                                bg-orange-600 hover:bg-orange-700\n                                text-white text-xs px-4 py-2\n                                rounded-full shadow\n                                self-start\n                                ", children: "Visit Out" })] })) }), _jsx("td", { className: "px-4 py-3", children: statusBadge(it.status) }), _jsx("td", { className: "px-4 py-3", children: _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: () => handleDelete(it.id), className: "px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200", children: "\uD83D\uDDD1\uFE0F Hapus" }) }) })] }, it.id)))) })] }) })] })] }), _jsx(BottomNav, {})] }));
}
