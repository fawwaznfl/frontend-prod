import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
export default function LaporanKinerjaPegawai() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("list");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pegawai, setPegawai] = useState(null);
    /* ================= DUMMY DATA ================= */
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            const pegawaiLogin = {
                id: parsedUser.id,
                name: parsedUser.name,
                foto_karyawan: parsedUser.foto_karyawan,
            };
            setPegawai(pegawaiLogin);
            setData([
                {
                    id: 1,
                    judul_pekerjaan: "Telat Presensi Masuk",
                    nilai: -10,
                    kategori: "Punishment",
                    catatan: "Datang terlambat 15 menit",
                    tanggal: "2025-12-30",
                    pegawai: pegawaiLogin,
                },
                {
                    id: 2,
                    judul_pekerjaan: "Menyelesaikan Penugasan Kerja",
                    nilai: 20,
                    kategori: "Reward",
                    catatan: "Tugas selesai tepat waktu",
                    tanggal: "2025-12-23",
                    pegawai: pegawaiLogin,
                },
            ]);
            setLoading(false);
        }
    }, []);
    /* ================= HELPER ================= */
    const formatTanggal = (date) => new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const totalSkor = data.reduce((sum, item) => sum + (item.nilai || 0), 0);
    /* ================= UI ================= */
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Laporan Kinerja" })] }) }), _jsx("div", { className: "bg-white mt-3 mx-4 rounded-2xl shadow-sm", children: _jsx("div", { className: "flex text-sm font-medium", children: [
                        { label: "List Penilaian", value: "list" },
                        { label: "Data Penilaian", value: "data" },
                    ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.value), className: `flex-1 py-3 relative ${activeTab === tab.value
                            ? "text-indigo-600"
                            : "text-gray-400"}`, children: [tab.label, activeTab === tab.value && (_jsx("span", { className: "absolute bottom-0 left-6 right-6 h-[3px] bg-indigo-600 rounded-full" }))] }, tab.value))) }) }), _jsxs("div", { className: "p-4 space-y-4", children: [pegawai && (_jsxs("div", { className: "flex flex-col items-center text-center mb-6", children: [pegawai.foto_karyawan ? (_jsx("img", { src: pegawai.foto_karyawan, alt: pegawai.name, className: "w-20 h-20 rounded-full object-cover border-4 border-white shadow" })) : (_jsx("div", { className: "w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(Star, { size: 40, className: "text-gray-400" }) })), _jsx("h2", { className: "mt-4 font-bold text-lg text-gray-900", children: pegawai.name }), _jsxs("p", { className: `mt-1 font-semibold ${totalSkor >= 0 ? "text-green-500" : "text-yellow-500"}`, children: ["SKOR : ", totalSkor] })] })), activeTab === "list" && (_jsx("div", { className: "divide-y bg-white rounded-2xl shadow-sm", children: data.map((item) => (_jsxs("div", { className: "py-4 px-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: item.judul_pekerjaan }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: formatTanggal(item.tanggal) })] }), _jsx("span", { className: `min-w-[52px] text-center px-3 py-1 rounded-lg text-white font-semibold text-sm ${(item.nilai || 0) > 0 ? "bg-blue-500" : "bg-red-500"}`, children: (item.nilai || 0) > 0 ? `+${item.nilai}` : item.nilai })] }, item.id))) })), activeTab === "data" &&
                        (loading ? (_jsx("div", { className: "text-center text-gray-400 mt-10 text-sm", children: "Memuat data..." })) : (data.map((item) => (_jsx("div", { className: "bg-white rounded-2xl p-4 shadow-sm flex gap-3", children: _jsx("div", { className: "flex-1", children: _jsx("p", { className: "font-bold text-gray-900", children: item.judul_pekerjaan }) }) }, item.id)))))] }), _jsx(BottomNav, {})] }));
}
