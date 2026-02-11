import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import BottomNav from "../../../components/common/BottomNav";
export default function EditKasbonPegawai() {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [form, setForm] = useState({
        company_id: "",
        pegawai_id: "",
        tanggal: "",
        nominal: "",
        keperluan: "",
        metode_pengiriman: "cash",
        nomor_rekening: "",
        status: "",
    });
    const [loading, setLoading] = useState(false);
    // =====================
    // FETCH DETAIL KASBON
    // =====================
    const fetchDetail = async () => {
        try {
            const res = await api.get(`/kasbon/${id}`);
            const d = res.data.data;
            // 🚫 Pegawai hanya boleh edit pending
            if (d.status !== "pending") {
                Swal.fire("Tidak bisa diedit", "Kasbon sudah diproses", "warning").then(() => navigate("/kasbon-pegawai"));
                return;
            }
            setForm({
                company_id: String(d.company_id),
                pegawai_id: String(d.pegawai_id),
                tanggal: d.tanggal || "",
                nominal: String(d.nominal || 0),
                keperluan: d.keperluan || "",
                metode_pengiriman: d.metode_pengiriman || "cash",
                nomor_rekening: d.nomor_rekening || "",
                status: d.status,
            });
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Data kasbon tidak ditemukan", "error")
                .then(() => navigate("/kasbon-pegawai"));
        }
    };
    useEffect(() => {
        fetchDetail();
    }, []);
    // =====================
    // HANDLE CHANGE
    // =====================
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "metode_pengiriman") {
            setForm((s) => ({
                ...s,
                metode_pengiriman: value,
                nomor_rekening: value === "cash" ? "" : s.nomor_rekening,
            }));
            return;
        }
        setForm((s) => ({ ...s, [name]: value }));
    };
    // =====================
    // SUBMIT UPDATE
    // =====================
    const handleSubmit = async () => {
        if (!form.tanggal || !form.nominal || !form.keperluan) {
            Swal.fire("Validasi", "Lengkapi semua field", "warning");
            return;
        }
        if (form.metode_pengiriman === "transfer" &&
            !form.nomor_rekening) {
            Swal.fire("Validasi", "Nomor rekening wajib diisi", "warning");
            return;
        }
        try {
            setLoading(true);
            await api.put(`/kasbon/${id}`, {
                company_id: form.company_id,
                pegawai_id: form.pegawai_id,
                tanggal: form.tanggal,
                nominal: Number(form.nominal),
                keperluan: form.keperluan,
                metode_pengiriman: form.metode_pengiriman,
                nomor_rekening: form.metode_pengiriman === "cash"
                    ? null
                    : form.nomor_rekening,
            });
            Swal.fire("Berhasil", "Kasbon berhasil diperbarui", "success").then(() => navigate("/kasbon-pegawai"));
        }
        catch (err) {
            console.error(err.response?.data);
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const formatRupiah = (value) => {
        if (!value)
            return "";
        const number = Math.floor(Number(value)); // buang desimal
        return new Intl.NumberFormat("id-ID").format(number);
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "w-full min-h-screen bg-[#F5F6FA] pb-28", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#4A4CFF] to-[#7A52FF] p-5 text-white text-center relative rounded-b-3xl", children: [_jsx(ChevronLeft, { className: "absolute left-5 top-5 cursor-pointer", size: 26, onClick: () => navigate("/kasbon-pegawai") }), _jsx("p", { className: "text-lg font-semibold", children: "Edit Kasbon" })] }), _jsxs("div", { className: "mx-4 mt-5 bg-white shadow-md rounded-3xl p-5 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, value: user?.name || "-", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Tanggal" }), _jsx("input", { type: "date", name: "tanggal", value: form.tanggal, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nominal" }), _jsx("input", { type: "text", name: "nominal", value: form.nominal ? `Rp. ${formatRupiah(form.nominal)}` : "", onChange: (e) => {
                                    const raw = e.target.value.replace(/\D/g, "");
                                    setForm((s) => ({ ...s, nominal: raw }));
                                }, className: "w-full border rounded-xl px-4 py-3", placeholder: "Masukkan nominal" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Keperluan" }), _jsx("textarea", { name: "keperluan", value: form.keperluan, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", placeholder: "Masukkan keperluan" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Metode Pengiriman" }), _jsxs("select", { name: "metode_pengiriman", value: form.metode_pengiriman, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "transfer", children: "Transfer" })] })] }), form.metode_pengiriman === "transfer" && (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nomor Rekening" }), _jsx("input", { type: "text", name: "nomor_rekening", value: form.nomor_rekening, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", placeholder: "Masukkan nomor rekening" })] })), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "w-full bg-blue-600 text-white py-3 rounded-xl mt-5 text-lg font-medium disabled:bg-blue-400", children: loading ? "Menyimpan..." : "Update" })] }), _jsx(BottomNav, {})] }));
}
