import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PageMeta from "../../components/common/PageMeta";
import DashboardHeader from "../../components/common/Dashboard/DashboardHeader";
import HrisMetrics from "../../components/common/Dashboard/HrisMetrics";
import HrisMetricsTriple from "../../components/common/Dashboard/HrisMetricsTriple";
import HrisMetricsDouble from "../../components/common/Dashboard/HrisMetricsDouble";
import AttendanceCalendar from "../../components/common/Dashboard/AttendanceCalendar";
export default function Home() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Absensi", description: "" }), _jsx(DashboardHeader, {}), _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "col-span-12 space-y-6 xl:col-span-7", children: _jsx(HrisMetrics, {}) }), _jsx("div", { className: "col-span-12 space-y-6 xl:col-span-7", children: _jsx(HrisMetricsTriple, {}) }), _jsx("div", { className: "col-span-12 space-y-6 xl:col-span-7", children: _jsx(HrisMetricsDouble, {}) }), _jsx("div", { className: "col-span-12 space-y-6 xl:col-span-7", children: _jsx(AttendanceCalendar, {}) })] })] }));
}
