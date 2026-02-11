import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
export default function HistoryLemburPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.dashboard_type === "pegawai" ? user.id : Number(id);
    const [absen, setAbsen] = useState([]);
    const [pegawai, setPegawai] = useState(null);
    const formatTime = (time) => time ? time.slice(0, 5).replace(":", ".") : "-";
    const formatStatus = (status) => {
        switch (status) {
            case "menunggu":
                return "text-green-600";
            case "disetujui":
                return "text-yellow-600";
            case "ditolak":
                return "text-blue-600";
        }
    };
    // ================= FETCH =================
    const fetchPegawai = async () => {
        if (user.dashboard_type === "pegawai") {
            setPegawai(user);
        }
        else {
            const res = await api.get(`/pegawai/${pegawai_id}`);
            setPegawai(res.data.data);
        }
    };
    const fetchHistoryAbsen = async () => {
        const url = user.dashboard_type === "pegawai"
            ? `/lembur/by-pegawai/${user.id}`
            : `/lembur/by-pegawai/${pegawai_id}`;
        const res = await api.get(url);
        setAbsen(res.data.data ?? []);
    };
    useEffect(() => {
        fetchPegawai();
        fetchHistoryAbsen();
    }, [pegawai_id]);
    const renderStatusBadge = (status) => {
        const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize";
        switch (status) {
            case "menunggu":
                return _jsx("span", { className: `${base} bg-yellow-100 text-yellow-700`, children: "Menunggu" });
            case "disetujui":
                return _jsx("span", { className: `${base} bg-blue-100 text-blue-700`, children: "disetujui" });
            case "ditolak":
                return _jsx("span", { className: `${base} bg-red-100 text-red-700`, children: "ditolak" });
            case "sudah_masuk":
                return (_jsx("span", { className: `${base} bg-purple-100 text-purple-700`, children: "Sudah Masuk" }));
            case "sudah_pulang":
                return (_jsx("span", { className: `${base} bg-green-100 text-green-700`, children: "Sudah Pulang" }));
            default:
                return (_jsx("span", { className: `${base} bg-gray-100 text-gray-600`, children: status.replace("_", " ") }));
        }
    };
    const filteredAbsen = absen.filter((a) => {
        const tanggal = new Date(a.tanggal_lembur);
        const matchFrom = !fromDate || tanggal >= fromDate;
        const matchTo = !toDate || tanggal <= toDate;
        return matchFrom && matchTo;
    });
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2 opacity-90", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsxs("h1", { className: "text-lg font-semibold", children: ["History Lembur ", pegawai?.name || "", " "] }) }), _jsx("button", { className: "p-2 opacity-90", children: _jsx(Grid, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsx("div", { className: "bg-white p-4 rounded-2xl shadow-lg border", children: _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(DatePicker, { selected: fromDate, onChange: (date) => setFromDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Dari Tanggal", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" }), _jsx(DatePicker, { selected: toDate, onChange: (date) => setToDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Sampai", className: "flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50" })] }) }) })] }), _jsx("div", { className: "px-5 mt-5", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border overflow-hidden", children: [_jsx("div", { className: "px-4 py-3 border-b", children: _jsx("p", { className: "text-sm font-medium text-gray-800", children: "History Lembur" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3", children: "No" }), _jsx("th", { className: "p-3", children: "Tanggal" }), _jsx("th", { className: "p-3", children: "Jam Masuk" }), _jsx("th", { className: "p-3", children: "Jam Pulang" }), _jsx("th", { className: "p-3", children: "Status" })] }) }), _jsxs("tbody", { children: [filteredAbsen.map((a, i) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-3 text-center", children: i + 1 }), _jsx("td", { className: "p-3 text-center", children: a.tanggal_lembur }), _jsx("td", { className: "p-3 text-center", children: formatTime(a.jam_mulai) }), _jsx("td", { className: "p-3 text-center", children: formatTime(a.jam_selesai) }), _jsx("td", { className: "p-3 text-center", children: renderStatusBadge(a.status) })] }, a.id))), filteredAbsen.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center p-6 text-gray-400", children: "Tidak ada history absen" }) }))] })] }) })] }) }), _jsx(BottomNav, {})] }));
}
