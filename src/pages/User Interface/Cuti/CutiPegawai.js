import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { ArrowLeft, Search, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
export default function CutiPegawai() {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [query, setQuery] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // FETCH
    const fetchCutiPegawai = async () => {
        try {
            const res = await api.get("/cuti");
            setItems(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch cuti pegawai", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCutiPegawai();
    }, []);
    // FILTER
    const filtered = items.filter((it) => {
        const mulai = new Date(it.tanggal_mulai);
        const matchQuery = query === "" ||
            it.jenis_cuti?.toLowerCase().includes(query.toLowerCase()) ||
            it.alasan?.toLowerCase().includes(query.toLowerCase());
        const matchFrom = !fromDate || mulai >= fromDate;
        const matchTo = !toDate || mulai <= toDate;
        return matchQuery && matchFrom && matchTo;
    });
    // ================= DELETE =================
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Pengajuan cuti akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/cuti/${id}`);
                    setItems(items.filter((item) => item.id !== id));
                    Swal.fire({
                        icon: "success",
                        title: "Terhapus",
                        text: "Pengajuan cuti berhasil dihapus",
                        timer: 1300,
                        showConfirmButton: false,
                    });
                }
                catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Tidak bisa menghapus data",
                    });
                }
            }
        });
    };
    // ================= STATUS BADGE =================
    const renderStatus = (status) => {
        const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize";
        switch (status) {
            case "disetujui":
                return (_jsx("span", { className: `${base} bg-green-100 text-green-700`, children: "Disetujui" }));
            case "ditolak":
                return (_jsx("span", { className: `${base} bg-red-100 text-red-700`, children: "Ditolak" }));
            default:
                return (_jsx("span", { className: `${base} bg-yellow-100 text-yellow-700`, children: "Menunggu" }));
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Cuti Pegawai" }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx("button", { onClick: () => setQuery(""), className: "w-11 h-11 rounded-lg bg-indigo-50 border flex items-center justify-center", children: _jsx(Search, { className: "w-5 h-5 text-indigo-600" }) })] }) }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-cuti-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md", children: "+ Ajukan Cuti" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Riwayat Pengajuan Cuti" }), _jsx("p", { className: "text-xs text-gray-400", children: "Daftar cuti yang pernah diajukan" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: "No" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Tanggal" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Jenis" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Alasan" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Status" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Foto" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Catatan" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Aksi" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center px-6 py-10 text-gray-400", children: "Tidak ada data cuti" }) })) : (filtered.map((it, idx) => {
                                                const status = it.status?.toLowerCase();
                                                const canEdit = status === "menunggu" || status === "ditolak";
                                                return (_jsxs("tr", { className: "border-t hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsxs("td", { className: "px-4 py-3", children: [it.tanggal_mulai, " \u2013 ", it.tanggal_selesai] }), _jsx("td", { className: "px-4 py-3 font-medium", children: it.jenis_cuti }), _jsx("td", { className: "px-4 py-3", children: it.alasan }), _jsx("td", { className: "px-4 py-3", children: renderStatus(it.status) }), _jsx("td", { className: "px-4 py-3", children: it.foto ? (_jsx("img", { src: `${STORAGE_URL}/${it.foto}`, alt: "Foto Cuti", className: "w-12 h-12 object-cover rounded-lg border", onClick: () => Swal.fire({
                                                                    imageUrl: `${STORAGE_URL}/${it.foto}`,
                                                                    showConfirmButton: false,
                                                                }) })) : (_jsx("span", { className: "text-xs text-gray-400", children: "-" })) }), _jsx("td", { className: "px-4 py-3", children: it.catatan ? (_jsx("span", { className: "text-xs text-gray-700", children: it.catatan })) : (_jsx("span", { className: "text-xs text-gray-400", children: "-" })) }), _jsx("td", { className: "px-4 py-3", children: canEdit ? (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate(`/edit-cuti-pegawai/${it.id}`), className: "text-blue-600 hover:text-blue-800", title: "Edit", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(it.id), className: "text-red-600 hover:text-red-800", title: "Hapus", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "Tidak bisa diubah" })) })] }, it.id));
                                            })) })] }) })] })] }), _jsx(BottomNav, {})] }));
}
