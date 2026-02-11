import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../../api/axios";
import { useEffect, useState } from "react";
export default function AttendanceCalendar() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        Promise.all([
            api.get("/calendar/birthdays", { params: { year: 2026 } }),
            api.get("/calendar/sakit", { params: { year: 2026 } }),
            api.get("/calendar/cuti", { params: { year: 2026 } }),
            api.get("/calendar/izin", { params: { year: 2026 } }),
            api.get("/calendar/telat", { params: { year: 2026 } }),
            api.get("/calendar/pulang", { params: { year: 2026 } }),
        ]).then(([birthdayRes, sakitRes, cutiRes, izinRes, telatRes, pulangRes]) => {
            setEvents([
                ...birthdayRes.data,
                ...sakitRes.data,
                ...cutiRes.data,
                ...izinRes.data,
                ...telatRes.data,
                ...pulangRes.data,
            ]);
        });
    }, []);
    // USER INTERFACE
    return (_jsxs("div", { className: "rounded-2xl bg-white p-6 shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700\n                overflow-hidden", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-blue-600", children: "Kalender Kehadiran \u2013 January 2026" }), _jsxs("div", { className: "flex flex-wrap gap-2 text-xs font-semibold", children: [_jsx("span", { className: "rounded-md bg-pink-500 px-2 py-1 text-white", children: "Ulang Tahun" }), _jsx("span", { className: "rounded-md bg-yellow-500 px-2 py-1 text-white", children: "Sakit" }), _jsx("span", { className: "rounded-md bg-blue-500 px-2 py-1 text-white", children: "Cuti" }), _jsx("span", { className: "rounded-md bg-cyan-500 px-2 py-1 text-white", children: "Izin" }), _jsx("span", { className: "rounded-md bg-green-500 px-2 py-1 text-white", children: "Izin Telat" }), _jsx("span", { className: "rounded-md bg-amber-400 px-2 py-1 text-white", children: "Izin Pulang Cepat" })] })] }), _jsx(FullCalendar, { plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ], initialView: "dayGridMonth", initialDate: "2026-01-01", height: "auto", events: events, headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }, dayMaxEvents: true, eventDisplay: "block" })] }));
}
