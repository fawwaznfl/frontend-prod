import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wallet, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
export default function HrisMetricsDouble() {
    const [time, setTime] = useState(new Date());
    const [totalKasbon, setTotalKasbon] = useState(0);
    const [totalReimbursement, setTotalReimbursement] = useState(0);
    useEffect(() => {
        api.get("/dashboard/metrics")
            .then(res => {
            setTotalKasbon(res.data.kasbon_bulan_ini ?? 0);
            setTotalReimbursement(res.data.reimbursement_bulan_ini ?? 0);
        })
            .catch(() => {
            setTotalKasbon(0);
            setTotalReimbursement(0);
        });
    }, []);
    const formatRupiah = (value) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const currentMonthYear = time.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4 md:gap-6", children: [_jsx("div", { className: "\n          group\n          rounded-2xl border border-gray-200 bg-white\n          px-4 py-3 md:px-6 md:py-5\n          dark:border-gray-800 dark:bg-white/[0.03]\n\n          transition-all duration-300 ease-out\n          hover:-translate-y-1\n          hover:shadow-lg\n          hover:border-green-300\n          dark:hover:border-green-500\n          cursor-pointer\n        ", children: _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("div", { className: "\n              flex items-center justify-center rounded-full\n              bg-green-100\n              h-10 w-10 md:h-16 md:w-16\n\n              transition-transform duration-300\n              group-hover:scale-110\n            ", children: _jsx(Wallet, { className: "h-5 w-5 md:h-8 md:w-8 text-green-600" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-lg truncate", children: ["Kasbon ", currentMonthYear] }), _jsx("p", { className: " font-bold text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl lg:text-3xl", children: formatRupiah(totalKasbon) })] })] }) }), _jsx("div", { className: "\n          group\n          rounded-2xl border border-gray-200 bg-white\n          px-4 py-3 md:px-6 md:py-5\n          dark:border-gray-800 dark:bg-white/[0.03]\n\n          transition-all duration-300 ease-out\n          hover:-translate-y-1\n          hover:shadow-lg\n          hover:border-purple-300\n          dark:hover:border-purple-500\n          cursor-pointer\n        ", children: _jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [_jsx("div", { className: "\n              flex items-center justify-center rounded-full\n              bg-purple-100\n              h-10 w-10 md:h-16 md:w-16\n\n              transition-transform duration-300\n              group-hover:scale-110\n            ", children: _jsx(Receipt, { className: "h-5 w-5 md:h-8 md:w-8 text-purple-600" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-lg truncate", children: ["Reimbursement ", currentMonthYear] }), _jsx("p", { className: "font-bold text-gray-900 dark:text-white text-xl md:text-3xl", children: formatRupiah(totalReimbursement) })] })] }) })] }));
}
