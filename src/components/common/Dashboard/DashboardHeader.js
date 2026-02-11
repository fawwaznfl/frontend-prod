import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CalendarDays, Clock } from "lucide-react";
import { useEffect, useState } from "react";
export default function DashboardHeader() {
    const [time, setTime] = useState(new Date());
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
    return (_jsx("div", { className: "\n        mb-6 rounded-2xl bg-white p-6\n        shadow-sm transition-all duration-300\n        hover:-translate-y-1 hover:shadow-lg\n        dark:bg-gray-900 dark:shadow-gray-800/50\n      ", children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-800 dark:text-white", children: ["Dashboard Kehadiran \u2013 ", currentMonthYear] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-md", children: [_jsx(CalendarDays, { size: 18 }), formattedDate] }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-sky-400 hover:shadow-md", children: [_jsx(Clock, { size: 18 }), formattedTime] })] })] }) }));
}
