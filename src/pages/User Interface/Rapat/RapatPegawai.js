import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, MapPin } from "lucide-react";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
export default function RapatPegawai() {
    const navigate = useNavigate();
    const [rapats, setRapats] = useState([]);
    const [loading, setLoading] = useState(true);
    // FORMAT TANGGAL + HARI
    const formatTanggalLengkap = (tanggal) => new Date(tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    // FORMAT JENIS PERTEMUAN
    const formatJenisPertemuan = (jenis) => `Pertemuan ${jenis.charAt(0).toUpperCase()}${jenis.slice(1)}`;
    // FETCH RAPAT (BACKEND SUDAH FILTER BERDASARKAN PEGAWAI LOGIN)
    useEffect(() => {
        const fetchRapat = async () => {
            try {
                const res = await api.get("/rapat");
                // kalau pakai ApiFormatter
                setRapats(res.data.data ?? res.data);
            }
            catch (error) {
                console.error("Gagal mengambil data rapat pegawai", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRapat();
    }, []);
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Rapat Kerja" })] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [loading && (_jsx("p", { className: "text-center text-gray-500 text-sm", children: "Memuat data rapat..." })), !loading && rapats.length === 0 && (_jsxs("div", { className: "text-center text-gray-500 mt-10", children: [_jsx("p", { className: "font-medium", children: "Belum ada rapat" }), _jsx("p", { className: "text-sm", children: "Rapat yang kamu ikuti akan muncul di sini" })] })), !loading &&
                        rapats.map((rapat) => (_jsxs("div", { onClick: () => navigate(`/pegawai/rapat/${rapat.id}`), className: "bg-white rounded-2xl shadow-sm border p-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900", children: rapat.nama_pertemuan }), _jsx("p", { className: "text-sm text-gray-500", children: formatTanggalLengkap(rapat.tanggal_rapat) })] }), _jsxs("span", { className: "text-sm text-gray-700", children: [rapat.waktu_mulai, " s/d ", rapat.waktu_selesai] })] }), _jsx("div", { className: "mt-3 flex items-center gap-2 text-sm text-gray-600", children: rapat.jenis_pertemuan === "online" ? (_jsxs(_Fragment, { children: [_jsx(Video, { size: 16, className: "text-blue-500" }), _jsx("span", { children: formatJenisPertemuan(rapat.jenis_pertemuan) })] })) : (_jsxs(_Fragment, { children: [_jsx(MapPin, { size: 16, className: "text-green-500" }), _jsx("span", { children: formatJenisPertemuan(rapat.jenis_pertemuan) })] })) })] }, rapat.id)))] }), _jsx(BottomNav, {})] }));
}
