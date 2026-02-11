import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
import { ArrowLeft, Search, Grid } from "lucide-react";
export default function KasbonPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [query, setQuery] = useState("");
    const formatRupiah = (value) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    // FETCH KASBON
    const fetchKasbon = async () => {
        try {
            const res = await api.get("/kasbon");
            setItems(res.data.data || []);
        }
        catch (err) {
            console.error("Error fetch kasbon", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchKasbon();
    }, []);
    // FILTER
    const filtered = items.filter((it) => {
        const tanggal = new Date(it.tanggal);
        const matchQuery = query === "" ||
            it.keperluan?.toLowerCase().includes(query.toLowerCase()) ||
            it.pegawai?.nama?.toLowerCase().includes(query.toLowerCase());
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        return matchQuery && matchFrom && matchTo;
    });
    // DELETE KASBON
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Hapus Kasbon?",
            text: "Data kasbon ini tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/kasbon/${id}`);
                    setItems(items.filter((item) => item.id !== id));
                    Swal.fire({
                        icon: "success",
                        title: "Terhapus!",
                        text: "Kasbon berhasil dihapus.",
                        timer: 1300,
                        showConfirmButton: false,
                    });
                }
                catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Terjadi error saat menghapus kasbon.",
                    });
                }
            }
        });
    };
    const statusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "approve":
                return "bg-green-100 text-green-700 border border-green-200";
            case "reject":
                return "bg-red-100 text-red-700 border border-red-200";
            case "paid":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            default:
                return "bg-gray-100 text-gray-600 border border-gray-200";
        }
    };
    const metodeBadge = (metode) => {
        return metode === "transfer"
            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
            : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    };
    const handleBayar = async (id) => {
        let metode = "cash";
        let file = null;
        const { isConfirmed } = await Swal.fire({
            title: "Pembayaran Kasbon",
            html: `
        <div class="text-left space-y-3">
          <label class="text-sm font-medium">Metode Pembayaran</label>
          <select id="metode" class="swal-input-rounded">
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>

          <div id="transfer-info" style="display:none; font-size:13px;">
            <p><strong>Rekening Tujuan:</strong></p>
            <p>Bank Mandiri</p>
            <p><strong>0111599920372</strong></p>

            <input 
              type="file" 
              id="bukti" 
              class="swal-file-rounded mt-2"
              accept="image/*,application/pdf"
            />
          </div>
        </div>
      `,
            customClass: {
                popup: "swal-popup-rounded",
            },
            didOpen: () => {
                const metodeSelect = document.getElementById("metode");
                const transferInfo = document.getElementById("transfer-info");
                metodeSelect.addEventListener("change", () => {
                    metode = metodeSelect.value;
                    transferInfo.style.display = metode === "transfer" ? "block" : "none";
                });
            },
            preConfirm: () => {
                const metodeSelect = document.getElementById("metode");
                const buktiInput = document.getElementById("bukti");
                metode = metodeSelect.value;
                if (metode === "transfer") {
                    if (!buktiInput.files || buktiInput.files.length === 0) {
                        Swal.showValidationMessage("Bukti transfer wajib diupload");
                        return false;
                    }
                    file = buktiInput.files[0];
                }
                return true;
            },
            showCancelButton: true,
            confirmButtonText: "Konfirmasi Bayar",
        });
        if (!isConfirmed)
            return;
        try {
            const formData = new FormData();
            formData.append("status", "paid");
            formData.append("metode_pembayaran", metode);
            if (file) {
                formData.append("file_approve", file);
            }
            await api.post(`/kasbon/${id}/bayar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Berhasil", "Kasbon berhasil dibayar", "success");
            fetchKasbon();
        }
        catch (err) {
            Swal.fire("Gagal", "Pembayaran gagal diproses", "error");
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 rounded-md mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Kasbon" }) }), _jsx("button", { className: "p-2 rounded-md opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border border-gray-100", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Mulai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Tanggal Selesai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx("button", { onClick: () => setQuery(""), className: "w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-sm", children: _jsx(Search, { className: "w-5 h-5 text-indigo-600" }) })] }) }) })] }), _jsxs("div", { className: "px-5 mt-5", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsx("button", { onClick: () => navigate("/add-kasbon-pegawai"), className: "bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 transition active:scale-95", children: "+ Tambah" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-100", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: "Daftar Kasbon" }), _jsx("p", { className: "text-xs text-gray-400", children: "Riwayat pengajuan kasbon" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-white text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: "No" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Tanggal" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Total" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Keperluan" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Status" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Metode Transfer" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Bukti Transfer" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Aksi" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 12, className: "text-center px-6 py-10 text-gray-400 text-sm", children: "Tidak ada data kasbon" }) })) : (filtered.map((it, idx) => (_jsxs("tr", { className: "border-t border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: idx + 1 }), _jsx("td", { className: "px-4 py-3", children: it.tanggal }), _jsx("td", { className: "px-4 py-3", children: formatRupiah(Number(it.nominal || 0)) }), _jsx("td", { className: "px-4 py-3", children: it.keperluan }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${statusBadge(it.status)}`, children: it.status }) }), _jsx("td", { className: "px-4 py-3", children: it.metode_pengiriman === "transfer" ? (_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: `inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${metodeBadge(it.metode_pengiriman)}`, children: it.metode_pengiriman }), _jsx("div", { className: "text-xs text-gray-500", children: it.nomor_rekening || "-" })] })) : (_jsx("span", { className: `inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${metodeBadge(it.metode_pengiriman)}`, children: it.metode_pengiriman })) }), _jsx("td", { className: "px-4 py-3", children: it.file_approve ? (_jsx("button", { onClick: () => window.open(`${STORAGE_URL}/${it.file_approve}`, "_blank"), className: "text-indigo-600 hover:text-indigo-800 transition", children: _jsx(Eye, { className: "w-4 h-4" }) })) : ("-") }), _jsxs("td", { className: "px-4 py-3", children: [it.status === "pending" && (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate(`/edit-kasbon-pegawai/${it.id}`), className: "text-blue-600 hover:text-blue-800", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(it.id), className: "text-red-600 hover:text-red-800", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })), it.status === "approve" && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs text-green-600 font-medium", children: "\u2714 Data sudah disetujui" }), _jsx("button", { onClick: () => handleBayar(it.id), className: "px-3 py-1 text-xs font-medium rounded-full bg-green-600 text-white", children: "Bayar" })] })), it.status === "paid" && (_jsx("p", { className: "text-xs text-blue-600 font-medium", children: "\u2714 Sudah dibayar" }))] })] }, idx)))) })] }) })] })] }), _jsx(BottomNav, {})] }));
}
