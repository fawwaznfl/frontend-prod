import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
export default function DetailPenugasan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        fetchDetail();
    }, []);
    const fetchDetail = async () => {
        try {
            const res = await api.get(`/penugasan/${id}`);
            setData(res.data.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const formatTanggal = (date) => new Date(date)
        .toLocaleString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
        .replace("pukul", "")
        .trim();
    if (loading) {
        return _jsx("div", { className: "p-5 text-center text-gray-400", children: "Memuat..." });
    }
    if (!data) {
        return _jsx("div", { className: "p-5 text-center text-red-500", children: "Data tidak ditemukan" });
    }
    const renderActivityBadge = (status) => {
        if (status === "pending")
            return "bg-yellow-100 text-yellow-700";
        if (status === "process")
            return "bg-blue-100 text-blue-700";
        return "bg-green-100 text-green-700";
    };
    const handleMulaiPekerjaan = async () => {
        const isPending = data.status === "pending";
        const result = await Swal.fire({
            title: isPending ? "Mulai pekerjaan?" : "Selesaikan pekerjaan?",
            text: isPending
                ? "Status akan berubah menjadi Dalam Proses"
                : "Status akan berubah menjadi Selesai",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isPending ? "Ya, mulai" : "Ya, selesaikan",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });
        if (!result.isConfirmed)
            return;
        try {
            await api.put(`/penugasan/${id}`, {
                status: isPending ? "process" : "finish",
            });
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: isPending
                    ? "Pekerjaan telah dimulai"
                    : "Pekerjaan telah diselesaikan",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/penugasan-pegawai", {
                state: { tab: isPending ? "proses" : "selesai" },
            });
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat memproses pekerjaan",
            });
        }
    };
    const ActivityItem = ({ label, status, date, }) => (_jsxs("div", { className: "flex items-start gap-3", children: [data.pegawai?.foto_karyawan ? (_jsx("img", { src: `${API_URL}/storage/${data.pegawai.foto_karyawan}`, className: "w-9 h-9 md:w-10 md:h-10 rounded-full object-cover" })) : (_jsx("div", { className: "w-9 h-9 md:w-10 md:h-10 bg-gray-200 rounded-full shrink-0" })), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-sm md:text-base", children: data.pegawai?.name }), _jsx("p", { className: "text-[11px] md:text-xs text-gray-400", children: formatTanggal(date) }), _jsx("p", { className: "text-xs md:text-sm text-gray-500 mt-1", children: label })] }), _jsx("span", { className: `self-start whitespace-nowrap text-[10px] md:text-xs px-3 py-1 rounded-full font-semibold ${renderActivityBadge(status)}`, children: status.toUpperCase() })] }));
    // USER INTERFACE
    return (_jsxs("div", { className: "h-screen bg-gray-50 flex flex-col", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow sticky top-0 z-20", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/penugasan-pegawai"), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Penugasan Kerja" })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto pb-28", children: [_jsxs("div", { className: "bg-white m-4 rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("p", { className: "text-center text-base md:text-lg font-semibold tracking-wide text-gray-800", children: data.nomor_penugasan }), _jsxs("div", { className: "flex justify-between text-xs md:text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Tanggal" }), _jsx("span", { className: "font-medium", children: formatTanggal(data.created_at) })] }), _jsxs("div", { className: "flex justify-between text-xs md:text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Nama Pegawai" }), _jsx("span", { className: "font-medium", children: data.pegawai?.name })] }), _jsxs("div", { className: "flex justify-between items-center text-xs md:text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Status" }), _jsx("span", { className: `px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold
                ${data.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : data.status === "process"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-green-100 text-green-700"}`, children: data.status.toUpperCase() })] })] }), _jsxs("div", { className: "bg-white m-4 rounded-2xl p-4 shadow-sm", children: [_jsx("p", { className: "text-sm md:text-base text-gray-800 leading-relaxed font-bold text-center", children: data.judul_pekerjaan }), _jsx("p", { className: "text-sm md:text-base text-gray-800 leading-relaxed", children: data.rincian_pekerjaan || "-" })] }), _jsxs("div", { className: "bg-white m-4 rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("p", { className: "font-semibold text-sm md:text-base text-gray-800", children: "Aktivitas" }), _jsx(ActivityItem, { label: "Tugas ditugaskan", status: "pending", date: data.created_at }), data.status !== "pending" && (_jsx(ActivityItem, { label: "Pekerjaan dimulai", status: "process", date: data.updated_at })), data.status === "finish" && (_jsx(ActivityItem, { label: "Pekerjaan diselesaikan", status: "finish", date: data.updated_at }))] })] }), data.status !== "finish" && (_jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white p-3 md:p-4 shadow-lg", children: _jsx("button", { onClick: handleMulaiPekerjaan, className: "w-full bg-indigo-600 text-white py-3 rounded-xl text-base md:text-lg font-semibold", children: data.status === "pending"
                        ? "Mulai Pekerjaan"
                        : "Selesaikan Pekerjaan" }) }))] }));
}
