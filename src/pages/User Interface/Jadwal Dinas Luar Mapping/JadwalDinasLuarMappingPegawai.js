import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import api from "../../../api/axios";
import { Trash2, CalendarPlus, Fingerprint } from "lucide-react";
import Swal from "sweetalert2";
export default function JadwalDinasLuarMappingPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.dashboard_type === "pegawai" ? user.id : Number(id);
    const [mapping, setMapping] = useState([]);
    const [pegawai, setPegawai] = useState(null);
    const [absenStatusMap, setAbsenStatusMap] = useState({});
    const formatTime = (time) => time ? time.slice(0, 5).replace(":", ".") : "-";
    const isToday = (date) => date === new Date().toISOString().slice(0, 10);
    const isShiftFinished = (tanggal, jamPulang) => new Date() > new Date(`${tanggal}T${jamPulang}`);
    const isAbsenSelesai = (tanggal) => absenStatusMap[tanggal] === "sudah_pulang";
    // ================= FETCH DATA =================
    const fetchPegawai = async () => {
        if (user.dashboard_type === "pegawai") {
            setPegawai(user);
        }
        else {
            const res = await api.get(`/pegawai/${pegawai_id}`);
            setPegawai(res.data.data);
        }
    };
    const fetchDinasLuarMapping = async () => {
        const url = user.dashboard_type === "pegawai"
            ? `/dinas-luar-mapping/self/${user.id}`
            : `/dinas-luar-mapping/pegawai/${pegawai_id}`;
        const res = await api.get(url);
        setMapping(res.data.data ?? []);
    };
    const fetchAbsenStatus = async () => {
        const res = await api.get(`/absensi/by-pegawai/${pegawai_id}`);
        const map = {};
        res.data.data.forEach((a) => (map[a.tanggal] = a.status_absen));
        setAbsenStatusMap(map);
    };
    // ================= EDIT SHIFT =================
    const handleEditShift = async (row) => {
        const res = await api.get("/shifts");
        const shifts = res.data.data || [];
        const options = shifts
            .map((s) => `<option value="${s.id}" ${s.id === row.shift.id ? "selected" : ""}>${s.nama} (${s.jam_masuk} - ${s.jam_pulang})</option>`)
            .join("");
        const { value } = await Swal.fire({
            title: "Edit Shift",
            html: `
        <label class="block mb-1">Tanggal</label>
        <input type="date" id="tanggal" class="swal2-input" value="${row.tanggal_mulai}" />
        <label class="block mt-2 mb-1">Shift</label>
        <select id="shift" class="swal2-input">${options}</select>
      `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            preConfirm: () => {
                const tanggal = document.getElementById("tanggal").value;
                const shift = document.getElementById("shift").value;
                if (!tanggal || !shift) {
                    Swal.showValidationMessage("Lengkapi data!");
                    return;
                }
                return { tanggal, shift };
            },
        });
        if (!value)
            return;
        await api.put(`/dinas-luar-mapping/${row.id}`, {
            tanggal_mulai: value.tanggal,
            tanggal_selesai: value.tanggal,
            shift_id: value.shift,
        });
        Swal.fire("Berhasil", "Jadwal diperbarui", "success");
        fetchDinasLuarMapping();
    };
    // ================= DELETE =================
    const handleDelete = async (id) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: "Hapus Jadwal?",
            showCancelButton: true,
            confirmButtonText: "Hapus",
        });
        if (!ok.isConfirmed)
            return;
        await api.delete(`/dinas-luar-mapping/${id}`);
        fetchDinasLuarMapping();
    };
    useEffect(() => {
        fetchPegawai();
        fetchDinasLuarMapping();
        fetchAbsenStatus();
    }, [pegawai_id]);
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Jadwal Dinas Luar", description: "Jadwal Dinas Luar Pegawai" }), _jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-12 rounded-b-[32px] shadow pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition", children: _jsx("span", { className: "text-xl font-semibold", children: "\u2190" }) }), _jsx("h1", { className: "flex-1 text-center text-xl font-semibold tracking-wide", children: "Jadwal Dinas Luar" }), _jsx("div", { className: "w-9" })] }) }), _jsx("div", { className: "-mt-8 px-4", children: _jsx(ComponentCard, { title: _jsxs("div", { className: "w-full text-center font-semibold", children: ["Jadwal Dinas Luar ", pegawai?.name || ""] }), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500 text-left", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3", children: "No" }), _jsx("th", { className: "p-3", children: "Tanggal" }), _jsx("th", { className: "p-3", children: "Shift" }), _jsx("th", { className: "p-3", children: "Masuk" }), _jsx("th", { className: "p-3", children: "Pulang" }), _jsx("th", { className: "p-3", children: "Aksi" })] }) }), _jsxs("tbody", { children: [mapping.map((m, i) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-3", children: i + 1 }), _jsx("td", { className: "p-3", children: m.tanggal_mulai }), _jsx("td", { className: "p-3", children: m.shift.nama }), _jsx("td", { className: "p-3", children: formatTime(m.shift.jam_masuk) }), _jsx("td", { className: "p-3", children: formatTime(m.shift.jam_pulang) }), _jsxs("td", { className: "p-3 flex gap-3", children: [isToday(m.tanggal_mulai) &&
                                                            !isShiftFinished(m.tanggal_mulai, m.shift.jam_pulang) ? (_jsx(Fingerprint, { className: "text-green-600 cursor-pointer", onClick: () => navigate(`/absensi-dinas-luar/pegawai/${pegawai_id}`) })) : (_jsx(Fingerprint, { className: "text-gray-300" })), user.dashboard_type !== "pegawai" && (_jsxs(_Fragment, { children: [_jsx(CalendarPlus, { className: "text-indigo-600 cursor-pointer", onClick: () => handleEditShift(m) }), _jsx(Trash2, { className: "text-red-600 cursor-pointer", onClick: () => handleDelete(m.id) })] }))] })] }, m.id))), mapping.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center p-6 text-gray-400", children: "Tidak ada jadwal" }) }))] })] }) }) }) })] }));
}
