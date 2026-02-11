import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GroupIcon, } from "../../../icons";
import { CheckCircle, XCircle, CalendarOff, Clock, Calendar, HeartPulse, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
export default function HrisMetrics() {
    const [totalPegawai, setTotalPegawai] = useState(0);
    const [totalLembur, setTotalLembur] = useState(0);
    const [totalAlfa, setTotalAlfa] = useState(0);
    const [totalLibur, setTotalLibur] = useState(0);
    const [bulan, setBulan] = useState("");
    const [totalCuti, setTotalCuti] = useState(0);
    const [totalSakit, setTotalSakit] = useState(0);
    const [totalIzin, setTotalIzin] = useState(0);
    const [totalTelat, setTotalTelat] = useState(0);
    const [totalHadir, setTotalHadir] = useState(0);
    useEffect(() => {
        api.get("/dashboard/metrics")
            .then(res => {
            setTotalPegawai(res.data.total_pegawai);
            setTotalHadir(res.data.hadir_bulan_ini);
            setTotalAlfa(res.data.alfa_bulan_ini);
            setTotalLibur(res.data.libur_bulan_ini);
            setTotalLembur(res.data.lembur_bulan_ini);
            setTotalCuti(res.data.cuti_bulan_ini);
            setTotalSakit(res.data.sakit_bulan_ini);
            setTotalIzin(res.data.izin_bulan_ini);
            setTotalTelat(res.data.telat_bulan_ini);
            setBulan(res.data.bulan);
        })
            .catch(() => {
            setTotalPegawai(0);
            setTotalLembur(0);
            setTotalCuti(0);
            setTotalSakit(0);
            setTotalIzin(0);
            setTotalTelat(0);
            setTotalAlfa(0);
            setTotalLibur(0);
        });
    }, []);
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 md:gap-6", children: [_jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-blue-100", children: _jsx(GroupIcon, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Total Pegawai" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalPegawai })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-green-100", children: _jsx(CheckCircle, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Masuk" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalHadir })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-red-100", children: _jsx(XCircle, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Alfa" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalAlfa })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-slate-100", children: _jsx(CalendarOff, { className: "h-6 w-6 text-slate-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Libur" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalLibur })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-purple-100", children: _jsx(Clock, { className: "h-6 w-6 text-purple-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Lembur" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalLembur })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-blue-100", children: _jsx(Calendar, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Cuti" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalCuti })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-rose-100", children: _jsx(HeartPulse, { className: "h-6 w-6 text-rose-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Sakit" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalSakit })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-amber-100", children: _jsx(FileText, { className: "h-6 w-6 text-amber-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap", children: "Izin" }), _jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: totalIzin })] })] }) })] }));
}
