import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import api from "../../../api/axios";
import { Trash2, CalendarPlus, Fingerprint, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
export default function JadwalShiftPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const normalizeDate = (date) => date.slice(0, 10);
    const [absenStatusMap, setAbsenStatusMap] = useState({});
    const pegawai_id = user.dashboard_type === "pegawai" ? user.id : Number(id);
    const [mapping, setMapping] = useState([]);
    const [pegawai, setPegawai] = useState(null);
    const [absenLoaded, setAbsenLoaded] = useState(false);
    // State untuk menyimpan data gabungan
    const [scheduleRows, setScheduleRows] = useState([]);
    const isAlpha = (tanggal) => {
        const today = new Date().toISOString().slice(0, 10);
        const status = absenStatusMap[tanggal];
        // HARI SUDAH LEWAT & TIDAK PERNAH ABSEN
        if (tanggal < today && (!status || status === "belum_masuk")) {
            return true;
        }
        return false;
    };
    const formatTime = (time) => {
        if (!time)
            return "-";
        return time.slice(0, 5).replace(":", ".");
    };
    // HELPER IS TODAY
    const isToday = (date) => {
        const today = new Date().toISOString().slice(0, 10);
        return date === today;
    };
    // FETCH DATA PEGAWAI
    const fetchPegawai = async () => {
        try {
            if (user.dashboard_type === "pegawai") {
                setPegawai(user);
            }
            else {
                const res = await api.get(`/pegawai/${pegawai_id}`);
                setPegawai(res.data.data);
            }
        }
        catch (err) {
            console.error("Err fetchPegawai:", err);
        }
    };
    // FETCH SHIFT MAPPING
    const fetchShiftMapping = async () => {
        try {
            let url = user.dashboard_type === "pegawai"
                ? `/shift-mapping/self/${user.id}`
                : `/shift-mapping/pegawai/${pegawai_id}`;
            const res = await api.get(url);
            const data = res.data.data ?? [];
            // Filter out data yang shift-nya null
            const validData = data.filter((item) => item.shift !== null);
            setMapping(validData);
        }
        catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                Swal.fire("Forbidden", "Anda tidak memiliki izin.", "error");
            }
        }
    };
    // Generate tanggal dari hari ini + 8 hari ke depan
    const generateScheduleRows = () => {
        const rows = [];
        const today = new Date();
        const daysToShow = 8;
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().slice(0, 10);
            // Cari apakah tanggal ini sudah ada shift mapping
            const existingMapping = mapping.find((m) => normalizeDate(m.tanggal_mulai) === dateStr);
            rows.push({
                tanggal: dateStr,
                mapping: existingMapping,
            });
        }
        setScheduleRows(rows);
    };
    // REQUEST SHIFT (untuk tanggal yang belum ada shift ATAU yang sudah ada)
    const openRequestShiftPopup = async (row) => {
        try {
            const res = await api.get("/shifts");
            const shifts = res.data.data || [];
            const shiftOptions = shifts
                .map((s) => `<option value="${s.id}" ${row.mapping?.shift.id === s.id ? "selected" : ""}>
              ${s.nama} (${s.jam_masuk} - ${s.jam_pulang})
            </option>`)
                .join("");
            const { value: formValues } = await Swal.fire({
                title: row.mapping ? "Request Perubahan Shift" : "Request Shift Baru",
                html: `
          <label class="block mb-1 font-medium">Tanggal</label>
          <input type="date" id="tanggal" class="swal2-input"
            value="${row.tanggal}" readonly />

          <label class="block mb-1 font-medium mt-3">Shift ${row.mapping ? "Baru" : ""}</label>
          <select id="shift" class="swal2-input">
            <option value="">-- Pilih Shift --</option>
            ${shiftOptions}
          </select>
        `,
                showCancelButton: true,
                confirmButtonText: "Kirim Request",
                preConfirm: () => {
                    const tanggal = document.getElementById("tanggal").value;
                    const shift = document.getElementById("shift").value;
                    if (!tanggal || !shift) {
                        Swal.showValidationMessage("Tanggal dan Shift wajib diisi!");
                        return;
                    }
                    return { tanggal, shift };
                },
            });
            if (!formValues)
                return;
            // Gunakan endpoint request-new untuk shift baru
            if (!row.mapping) {
                await api.post(`/shift-mapping/request-new`, {
                    shift_id: formValues.shift,
                    tanggal_mulai: formValues.tanggal,
                    tanggal_selesai: formValues.tanggal,
                });
            }
            else {
                // Request update untuk shift yang sudah ada 
                await api.post(`/shift-mapping/request/${row.mapping.id}`, {
                    shift_id: formValues.shift,
                    tanggal_mulai: formValues.tanggal,
                    tanggal_selesai: formValues.tanggal,
                });
            }
            Swal.fire("Berhasil!", "Request shift berhasil dikirim.", "success");
            fetchShiftMapping();
        }
        catch (error) {
            console.error("Error request shift:", error);
            Swal.fire("Gagal!", error.response?.data?.message || "Terjadi kesalahan.", "error");
        }
    };
    const fetchAbsenStatus = async () => {
        try {
            const res = await api.get(`/absensi/by-pegawai/${pegawai_id}`);
            const map = {};
            res.data.data.forEach((a) => {
                map[a.tanggal] = a.status_absen;
            });
            setAbsenStatusMap(map);
            setAbsenLoaded(true);
        }
        catch (err) {
            console.error("Gagal fetch status absen");
            setAbsenLoaded(true);
        }
    };
    // ADMIN  APPROVE REQUEST
    const handleApprove = async (mappingId) => {
        const ask = await Swal.fire({
            icon: "question",
            title: "Approve Request?",
            showCancelButton: true,
            confirmButtonText: "Approve",
        });
        if (!ask.isConfirmed)
            return;
        try {
            await api.post(`/shift-mapping/approve/${mappingId}`, {
                approved_by: user.id,
            });
            Swal.fire("Berhasil!", "Request telah di-approve", "success");
            fetchShiftMapping();
        }
        catch (err) {
            Swal.fire("Gagal!", "Tidak bisa approve request", "error");
        }
    };
    // ADMIN  REJECT REQUEST
    const handleReject = async (mappingId) => {
        const ask = await Swal.fire({
            icon: "warning",
            title: "Reject Request?",
            showCancelButton: true,
            confirmButtonText: "Reject",
        });
        if (!ask.isConfirmed)
            return;
        try {
            await api.post(`/shift-mapping/reject/${mappingId}`, {
                approved_by: user.id,
            });
            Swal.fire("Ditolak", "Request telah ditolak", "success");
            fetchShiftMapping();
        }
        catch (err) {
            Swal.fire("Gagal!", "Tidak bisa reject request", "error");
        }
    };
    // DELETE SHIFT
    const handleDelete = async (mappingId) => {
        const ask = await Swal.fire({
            icon: "warning",
            title: "Hapus?",
            text: "Yakin ingin menghapus jadwal shift ini?",
            showCancelButton: true,
            confirmButtonText: "Hapus",
        });
        if (!ask.isConfirmed)
            return;
        try {
            await api.delete(`/shift-mapping/${mappingId}`);
            fetchShiftMapping();
        }
        catch {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
        }
    };
    const isPastDate = (tanggal) => {
        const today = new Date().toISOString().slice(0, 10);
        return tanggal < today;
    };
    const isAbsenSelesai = (tanggal) => {
        return absenStatusMap[tanggal] === "sudah_pulang";
    };
    const canDoFingerprint = (tanggal, mapping) => {
        // Jika belum ada mapping atau status masih pending, tidak boleh absen
        if (!mapping || mapping.status === "pending" || mapping.status === "rejected") {
            return false;
        }
        const today = new Date().toISOString().slice(0, 10);
        // SUDAH PULANG TIDAK BOLEH
        if (absenStatusMap[tanggal] === "sudah_pulang")
            return false;
        // Hari ini boleh
        if (tanggal === today)
            return true;
        // Kemarin & sudah masuk tapi belum pulang boleh
        if (tanggal < today && absenStatusMap[tanggal] === "sudah_masuk") {
            return true;
        }
        return false;
    };
    useEffect(() => {
        console.log("ABSEN MAP:", absenStatusMap);
        mapping.forEach((m) => {
            console.log(m.tanggal_mulai, normalizeDate(m.tanggal_mulai), absenStatusMap[normalizeDate(m.tanggal_mulai)]);
        });
    }, [absenLoaded]);
    // Generate schedule rows setelah mapping berubah
    useEffect(() => {
        if (absenLoaded) {
            generateScheduleRows();
        }
    }, [mapping, absenLoaded]);
    // LOAD DATA
    useEffect(() => {
        fetchPegawai();
        fetchShiftMapping();
        fetchAbsenStatus();
    }, [pegawai_id]);
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Jadwal Shift Pegawai", description: "Daftar Jadwal Shift" }), _jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-12 rounded-b-[32px] shadow pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition", children: _jsx("span", { className: "text-lg font-semibold", children: "\u2190" }) }), _jsx("h1", { className: "flex-1 text-center text-lg font-semibold tracking-wide", children: "Jadwal Shift Pegawai" }), _jsx("div", { className: "w-9" })] }) }), _jsx("div", { className: "-mt-8 px-4", children: _jsx(ComponentCard, { title: _jsxs("div", { className: "w-full text-center font-semibold", children: ["Jadwal Shift ", pegawai?.name || ""] }), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500 text-left", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3", children: "No" }), _jsx("th", { className: "p-3", children: "Tanggal" }), _jsx("th", { className: "p-3", children: "Shift" }), _jsx("th", { className: "p-3", children: "Masuk" }), _jsx("th", { className: "p-3", children: "Pulang" }), _jsx("th", { className: "p-3", children: "Status" }), _jsx("th", { className: "p-3", children: "Aksi" })] }) }), _jsxs("tbody", { children: [absenLoaded &&
                                            scheduleRows
                                                .filter((row) => !isAlpha(row.tanggal))
                                                .map((row, i) => (_jsxs("tr", { className: `border-b ${!row.mapping ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`, children: [_jsx("td", { className: "p-3", children: i + 1 }), _jsx("td", { className: "p-3", children: row.tanggal }), _jsx("td", { className: "p-3", children: row.mapping?.shift?.nama || "-" }), _jsx("td", { className: "p-3", children: row.mapping?.shift?.jam_masuk ? formatTime(row.mapping.shift.jam_masuk) : "-" }), _jsx("td", { className: "p-3", children: row.mapping?.shift?.jam_pulang ? formatTime(row.mapping.shift.jam_pulang) : "-" }), _jsx("td", { className: "p-3", children: !row.mapping ? (_jsx("span", { className: "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full", children: "Belum Ada Shift" })) : row.mapping.requested_by ? (_jsxs(_Fragment, { children: [row.mapping.status === "pending" && (_jsx("span", { className: "px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full", children: "Pending" })), row.mapping.status === "approved" && (_jsx("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full", children: "Approved" })), row.mapping.status === "rejected" && (_jsx("span", { className: "px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full", children: "Rejected" }))] })) : (_jsx("span", { className: "text-gray-400 text-xs", children: "-" })) }), _jsxs("td", { className: "p-3 flex gap-3", children: [!isPastDate(row.tanggal) &&
                                                                !isAbsenSelesai(row.tanggal) && (_jsx(CalendarPlus, { size: 18, className: "text-indigo-600 cursor-pointer", onClick: () => openRequestShiftPopup(row) })), canDoFingerprint(row.tanggal, row.mapping) ? (_jsx(Fingerprint, { size: 18, className: "text-green-600 cursor-pointer", onClick: () => navigate(`/absensi/pegawai/${pegawai_id}?tanggal=${row.tanggal}`) })) : (_jsx(Fingerprint, { size: 18, className: "text-gray-300" })), user.dashboard_type !== "pegawai" &&
                                                                row.mapping &&
                                                                row.mapping.status === "pending" && (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18, className: "text-green-600 cursor-pointer", onClick: () => handleApprove(row.mapping.id) }), _jsx(XCircle, { size: 18, className: "text-red-600 cursor-pointer", onClick: () => handleReject(row.mapping.id) })] })), user.dashboard_type !== "pegawai" && row.mapping && (_jsx(Trash2, { size: 18, className: "text-red-600 cursor-pointer", onClick: () => handleDelete(row.mapping.id) }))] })] }, row.tanggal))), scheduleRows.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center p-6 text-gray-400", children: "Tidak ada jadwal shift" }) }))] })] }) }) }) })] }));
}
