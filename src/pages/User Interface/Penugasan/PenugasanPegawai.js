import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Briefcase } from "lucide-react";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
export default function PenugasanPegawai() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("baru");
    const [penugasan, setPenugasan] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
        fetchPenugasan();
    }, []);
    const fetchPenugasan = async () => {
        try {
            const res = await api.get("/penugasan");
            setPenugasan(res.data.data);
        }
        catch (error) {
            console.error("Gagal mengambil penugasan:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const formatTanggal = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const filteredData = penugasan.filter((item) => {
        if (activeTab === "baru")
            return item.status === "pending";
        if (activeTab === "proses")
            return item.status === "process";
        if (activeTab === "selesai")
            return item.status === "finish";
        return false;
    });
    const renderStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (_jsx("span", { className: "text-[10px] md:text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full", children: "Baru" }));
            case "process":
                return (_jsx("span", { className: "text-[10px] md:text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full", children: "Proses" }));
            case "finish":
                return (_jsx("span", { className: "text-[10px] md:text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full", children: "Selesai" }));
            default:
                return null;
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Penugasan Kerja" })] }) }), _jsx("div", { className: "bg-white mt-3 mx-4 rounded-2xl shadow-sm", children: _jsx("div", { className: "flex text-sm font-medium", children: [
                        { label: "Pekerjaan Baru", value: "baru" },
                        { label: "Dalam Proses", value: "proses" },
                        { label: "Pekerjaan Selesai", value: "selesai" },
                    ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.value), className: `flex-1 py-3 text-center relative transition
                ${activeTab === tab.value
                            ? "text-indigo-600"
                            : "text-gray-400"}`, children: [tab.label, activeTab === tab.value && (_jsx("span", { className: "absolute bottom-0 left-6 right-6 h-[3px] bg-indigo-600 rounded-full" }))] }, tab.value))) }) }), _jsx("div", { className: "p-4 space-y-4", children: loading ? (_jsx("div", { className: "text-center text-gray-400 mt-10 text-sm", children: "Memuat penugasan..." })) : filteredData.length === 0 ? (_jsx("div", { className: "text-center text-gray-400 mt-10 text-sm", children: "Tidak ada penugasan" })) : (filteredData.map((item) => (_jsxs("div", { onClick: () => navigate(`/penugasan/${item.id}`), className: "bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 cursor-pointer active:scale-[0.98] transition", children: [item.pegawai?.foto_karyawan ? (_jsx("img", { src: `${API_URL}/storage/${item.pegawai.foto_karyawan}`, alt: "Foto Pegawai", className: "w-11 h-11 rounded-xl object-cover shrink-0" })) : (_jsx("div", { className: "w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0", children: _jsx(Briefcase, { size: 20 }) })), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm md:text-base font-bold text-gray-900", children: item.pegawai?.name }), _jsx("p", { className: "text-xs md:text-sm text-gray-500 mt-0.5", children: formatTanggal(item.created_at) }), _jsx("p", { className: "mt-2 text-sm md:text-base text-gray-800 font-semibold leading-snug md:leading-relaxed", children: item.judul_pekerjaan })] }), renderStatusBadge(item.status)] }, item.id)))) }), _jsx(BottomNav, {})] }));
}
