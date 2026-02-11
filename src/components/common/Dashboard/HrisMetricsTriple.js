import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ClockAlert, LogOut, Banknote } from "lucide-react";
import api from "../../../api/axios";
export default function HrisMetrics() {
    const [time, setTime] = useState(new Date());
    const [totalTelat, setTotalTelat] = useState(0);
    const [totalPulang, setTotalPulang] = useState(0);
    const [totalPayrollBulanIni, setTotalPayroll] = useState(0);
    const [bulan, setBulan] = useState("");
    useEffect(() => {
        api.get("/dashboard/metrics")
            .then(res => {
            setTotalTelat(res.data.telat_bulan_ini);
            setTotalPulang(res.data.pulang_bulan_ini);
            setTotalPayroll(res.data.payroll_bulan_ini);
        })
            .catch(() => {
            setTotalTelat(0);
            setTotalPulang(0);
            setTotalPayroll(0);
        });
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const formattedDate = time.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const formattedTime = time.toLocaleTimeString("en-GB");
    const currentMonthYear = time.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });
    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0, // biar gak ada .00
        }).format(value);
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6", children: [_jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("div", { className: "flex items-center justify-center rounded-full bg-yellow-100 h-10 w-10 md:h-16 md:w-16", children: _jsx(ClockAlert, { className: "h-5 w-5 md:h-8 md:w-8 text-yellow-600" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: " font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-lg truncate", children: "Izin Telat" }), _jsx("p", { className: " mt-0.5 md:mt-1 font-bold text-gray-900 dark:text-white text-xl md:text-3xl", children: totalTelat })] })] }) }), _jsx("div", { className: " rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]\n              transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n              dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("div", { className: "flex items-center justify-center rounded-full bg-orange-100 h-10 w-10 md:h-16 md:w-16", children: _jsx(LogOut, { className: "h-5 w-5 md:h-8 md:w-8 text-orange-600" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: " font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-lg truncate", children: "Izin Pulang Cepat" }), _jsx("p", { className: " mt-0.5 md:mt-1 font-bold text-gray-900 dark:text-white text-xl md:text-3xl", children: totalPulang })] })] }) }), _jsx("div", { className: "col-span-2 md:col-span-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 md:px-6 md:py-5\n            dark:border-gray-800 dark:bg-white/[0.03]\n            transition-all duration-300 ease-out\n            hover:-translate-y-1 hover:shadow-lg hover:border-blue-300\n            dark:hover:border-blue-500 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("div", { className: "flex items-center justify-center rounded-full bg-emerald-100 h-10 w-10 md:h-16 md:w-16", children: _jsx(Banknote, { className: "h-5 w-5 md:h-8 md:w-8 text-emerald-600" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-lg", children: ["Payroll ", currentMonthYear] }), _jsx("p", { className: "mt-0.5 md:mt-1 font-bold text-gray-900 dark:text-white text-xl md:text-3xl", children: formatRupiah(totalPayrollBulanIni) })] })] }) })] }));
}
