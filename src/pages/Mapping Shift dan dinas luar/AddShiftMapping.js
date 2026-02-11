import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import Label from "../../components/form/Label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AddShiftMapping() {
    const navigate = useNavigate();
    const { id } = useParams();
    const pegawai_id = id;
    const [form, setForm] = useState({
        pegawai_id: pegawai_id || "",
        company_id: "",
        shift_id: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        toleransi_telat: 0,
    });
    const [tanggalMulai, setTanggalMulai] = useState(null);
    const [tanggalAkhir, setTanggalAkhir] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [mapping, setMapping] = useState([]);
    const [pegawai, setPegawai] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        shift_id: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        toleransi_telat: "",
    });
    const formatTime = (time) => {
        if (!time)
            return "-";
        return time.slice(0, 5).replace(":", ".");
    };
    // FETCH DATA
    useEffect(() => {
        if (!pegawai_id)
            return;
        fetchShifts();
        fetchPegawai();
        fetchShiftMapping();
    }, [pegawai_id]);
    useEffect(() => {
        if (pegawai?.company_id) {
            setForm((prev) => ({
                ...prev,
                company_id: form.company_id,
            }));
        }
    }, [pegawai]);
    const fetchShifts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/shifts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShifts(res.data.data || []);
        }
        catch {
            setShifts([]);
        }
    };
    const fetchPegawai = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/pegawais/${pegawai_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPegawai(res.data?.data ?? res.data ?? null);
        }
        catch {
            setPegawai(null);
        }
    };
    const fetchShiftMapping = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/shift-mapping?pegawai_id=${pegawai_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMapping(res.data.data || []);
        }
        catch {
            setMapping([]);
        }
    };
    // EDIT
    const openEdit = async (item) => {
        const shiftOptions = shifts
            .map((s) => `<option value="${s.id}" ${s.id === item.shift.id ? "selected" : ""}>
            ${s.nama} (${s.jam_masuk} - ${s.jam_pulang})
          </option>`)
            .join("");
        const { value } = await Swal.fire({
            title: "Request Perubahan Shift",
            html: `
        <div style="display:flex; flex-direction:column; gap:14px; text-align:left">

          <!-- SHIFT BARU -->
          <div>
            <label style="font-size:13px; font-weight:600; margin-bottom:6px; display:block">
              Shift Baru
            </label>
            <select id="shiftId"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:12px;
                border:1px solid #d1d5db;
                outline:none;
                font-size:14px;
              ">
              ${shiftOptions}
            </select>
          </div>

          <!-- TANGGAL MULAI -->
          <div>
            <label style="font-size:13px; font-weight:600; margin-bottom:6px; display:block">
              Tanggal Mulai
            </label>
            <input id="tglMulai" type="date"
              value="${item.tanggal_mulai}"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:12px;
                border:1px solid #d1d5db;
                outline:none;
                font-size:14px;
              "/>
          </div>

          <!-- TANGGAL AKHIR -->
          <div>
            <label style="font-size:13px; font-weight:600; margin-bottom:6px; display:block">
              Tanggal Akhir
            </label>
            <input id="tglAkhir" type="date"
              value="${item.tanggal_selesai}"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:12px;
                border:1px solid #d1d5db;
                outline:none;
                font-size:14px;
              "/>
          </div>

          <!-- TOLERANSI -->
          <div>
            <label style="font-size:13px; font-weight:600; margin-bottom:6px; display:block">
              Toleransi Telat (Menit)
            </label>
            <input id="toleransi"
              type="number"
              min="0"
              value="${item.toleransi_telat ?? 0}"
              style="
                width:100%;
                padding:12px 14px;
                border-radius:12px;
                border:1px solid #d1d5db;
                outline:none;
                font-size:14px;
              "
            />
          </div>


        </div>
      `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Kirim Request",
            cancelButtonText: "Cancel",
            buttonsStyling: true,
            customClass: {
                confirmButton: "swal-confirm-btn",
                cancelButton: "swal-cancel-btn",
            },
            preConfirm: () => {
                const shift_id = document.getElementById("shiftId").value;
                const tanggal_mulai = document.getElementById("tglMulai").value;
                const tanggal_selesai = document.getElementById("tglAkhir").value;
                const toleransi_telat = Number(document.getElementById("toleransi").value);
                if (!shift_id || !tanggal_mulai || !tanggal_selesai) {
                    Swal.showValidationMessage("Semua field wajib diisi");
                    return;
                }
                return {
                    shift_id,
                    tanggal_mulai,
                    tanggal_selesai,
                    toleransi_telat,
                };
            },
        });
        if (!value)
            return;
        try {
            await api.put(`/shift-mapping/${item.id}`, value);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Shift berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            fetchShiftMapping();
        }
        catch {
            Swal.fire("Gagal", "Tidak dapat update shift", "error");
        }
    };
    // VALIDATION
    const validate = () => {
        const newErr = {
            shift_id: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
            toleransi_telat: "",
        };
        let valid = true;
        if (!form.shift_id) {
            newErr.shift_id = "Pilih shift";
            valid = false;
        }
        if (!tanggalMulai) {
            newErr.tanggal_mulai = "Tanggal mulai wajib diisi";
            valid = false;
        }
        if (!tanggalAkhir) {
            newErr.tanggal_selesai = "Tanggal akhir wajib diisi";
            valid = false;
        }
        if (form.toleransi_telat < 0) {
            newErr.toleransi_telat = "Toleransi tidak boleh negatif";
            valid = false;
        }
        setErrors(newErr);
        return valid;
    };
    // SUBMIT
    const handleSubmit = async () => {
        if (!validate())
            return;
        // CEK TANGGAL SUDAH PERNAH ADA
        const newDate = tanggalMulai?.toLocaleDateString("en-CA");
        const isDuplicate = mapping.some((m) => m.tanggal_mulai === newDate);
        if (isDuplicate) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal sudah ditambahkan",
                text: "Shift pada tanggal ini sudah ada.",
            });
            return;
        }
        // SUBMIT
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await api.post("/shift-mapping", {
                pegawai_id: form.pegawai_id,
                shift_id: form.shift_id,
                tanggal_mulai: newDate,
                tanggal_selesai: tanggalAkhir?.toLocaleDateString("en-CA"),
                toleransi_telat: form.toleransi_telat,
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Shift pegawai berhasil ditambahkan.",
            });
            fetchShiftMapping();
        }
        catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan shift mapping.",
            });
        }
        finally {
            setLoading(false);
        }
    };
    // DELETE
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Hapus?",
            text: "Yakin ingin menghapus shift ini?",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/shift-mapping/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchShiftMapping();
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Shift berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });
        }
        catch {
            Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
        }
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Shift Pegawai", description: "Shift Mapping" }), _jsx(PageHeader, { pageTitle: "Tambah Shift", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/pegawai"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4", children: [_jsx(ComponentCard, { title: "Form Input Shift Pegawai", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Shift" }), _jsxs("select", { name: "shift_id", value: form.shift_id, onChange: (e) => setForm({ ...form, shift_id: e.target.value }), className: "w-full p-2 rounded border border-gray-300 bg-white text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Shift --" }), shifts.map((s) => (_jsxs("option", { value: s.id, children: [s.nama, " (", s.jam_masuk, " - ", s.jam_pulang, ")"] }, s.id)))] }), errors.shift_id && (_jsx("p", { className: "text-red-500 text-sm", children: errors.shift_id }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: tanggalMulai, onChange: (date) => setTanggalMulai(date), dateFormat: "yyyy-MM-dd", className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700" }), errors.tanggal_mulai && (_jsx("p", { className: "text-red-500 text-sm", children: errors.tanggal_mulai }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: tanggalAkhir, onChange: (date) => setTanggalAkhir(date), dateFormat: "yyyy-MM-dd", className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700" }), errors.tanggal_selesai && (_jsx("p", { className: "text-red-500 text-sm", children: errors.tanggal_selesai }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Toleransi Telat (Menit)" }), _jsx("input", { type: "number", min: 0, value: form.toleransi_telat, onChange: (e) => setForm({
                                                ...form,
                                                toleransi_telat: Number(e.target.value),
                                            }), placeholder: "Contoh: 10", className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700" }), errors.toleransi_telat && (_jsx("p", { className: "text-red-500 text-sm", children: errors.toleransi_telat }))] }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-xl", children: loading ? "Menyimpan..." : "Submit" })] }) }), _jsx(ComponentCard, { title: _jsxs("div", { className: "w-full text-center", children: ["Jadwal Shift ", pegawai?.name || ""] }), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-200 dark:bg-gray-800 text-left text-gray-800 dark:text-gray-200", children: [_jsx("th", { className: "p-3", children: "No" }), _jsx("th", { className: "p-3", children: "Tanggal" }), _jsx("th", { className: "p-3", children: "Shift" }), _jsx("th", { className: "p-3", children: "Jam Masuk" }), _jsx("th", { className: "p-3", children: "Jam Keluar" }), _jsx("th", { className: "p-3", children: "Toleransi" }), _jsx("th", { className: "p-3", children: "Actions" })] }) }), _jsxs("tbody", { children: [mapping.map((m, i) => (_jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700 \n                               hover:bg-gray-100 dark:hover:bg-gray-600\n                               text-gray-800 dark:text-gray-200", children: [_jsx("td", { className: "p-3", children: i + 1 }), _jsx("td", { className: "p-3", children: m.tanggal_mulai }), _jsx("td", { className: "p-3", children: m.shift.nama }), _jsx("td", { className: "p-3", children: formatTime(m.shift.jam_masuk) }), _jsx("td", { className: "p-3", children: formatTime(m.shift.jam_pulang) }), _jsx("td", { className: "p-3", children: m.toleransi_telat === 0
                                                            ? "Tidak ada"
                                                            : `${m.toleransi_telat} menit` }), _jsxs("td", { className: "p-3 flex gap-3", children: [_jsx("span", { onClick: () => openEdit(m), className: "cursor-pointer text-blue-500 hover:text-blue-700", children: "\u270F\uFE0F" }), _jsx("span", { onClick: () => handleDelete(m.id), className: "cursor-pointer text-red-500 hover:text-red-700", children: _jsx(Trash2, { size: 18 }) })] })] }, m.id))), mapping.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center p-4 text-gray-500", children: "Tidak ada data shift." }) }))] })] }) }) })] })] }));
}
