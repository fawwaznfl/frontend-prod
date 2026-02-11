import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { ArrowLeft, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
export default function InventoryPegawai() {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // ================= FETCH =================
    const fetchInventory = async () => {
        try {
            const res = await api.get("/inventory");
            setItems(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch inventory", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInventory();
    }, []);
    // ================= FILTER =================
    const filtered = items.filter((it) => {
        const tanggal = new Date(it.tanggal_terima);
        const matchQuery = query === "" ||
            it.nama_barang?.toLowerCase().includes(query.toLowerCase()) ||
            it.kode_barang?.toLowerCase().includes(query.toLowerCase()) ||
            it.kategori?.toLowerCase().includes(query.toLowerCase());
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        return matchQuery && matchFrom && matchTo;
    });
    // ================= DELETE =================
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data inventory akan dihapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/inventory/${id}`);
                    setItems(items.filter((item) => item.id !== id));
                    Swal.fire({
                        icon: "success",
                        title: "Terhapus",
                        text: "Inventory berhasil dihapus",
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
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Inventory Pegawai" }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" })] }) }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-inventory-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md", children: "+ Tambah Inventory" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Daftar Inventory" }), _jsx("p", { className: "text-xs text-gray-400", children: "Barang yang dimiliki pegawai" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: "No" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Tanggal" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Nama Barang" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Kode" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Stok" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Satuan" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Keterangan" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Lokasi" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Divisi" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Aksi" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 10, className: "text-center px-6 py-10 text-gray-400", children: "Tidak ada data inventory" }) })) : (filtered.map((it, idx) => (_jsxs("tr", { className: "border-t hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsx("td", { className: "px-4 py-3", children: new Date(it.created_at).toLocaleDateString("id-ID") }), _jsx("td", { className: "px-4 py-3 font-medium", children: it.nama_barang }), _jsx("td", { className: "px-4 py-3", children: it.kode_barang }), _jsx("td", { className: "px-4 py-3", children: it.stok ?? "-" }), _jsx("td", { className: "px-4 py-3", children: it.satuan ?? "-" }), _jsx("td", { className: "px-4 py-3 text-xs", children: it.keterangan ?? "-" }), _jsx("td", { className: "px-4 py-3 text-xs", children: it.lokasi?.nama_lokasi ?? "-" }), _jsx("td", { className: "px-4 py-3 text-xs", children: it.divisi?.nama ?? "-" }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate(`/edit-inventory-pegawai/${it.id}`), className: "text-blue-600", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(it.id), className: "text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, it.id)))) })] }) })] })] }), _jsx(BottomNav, {})] }));
}
