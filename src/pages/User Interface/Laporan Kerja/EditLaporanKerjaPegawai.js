import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import BottomNav from "../../../components/common/BottomNav";
export default function EditLaporanKerjaPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [informasiUmum, setInformasiUmum] = useState("");
    const [pekerjaanDilaksanakan, setPekerjaanDilaksanakan] = useState("");
    const [pekerjaanBelumSelesai, setPekerjaanBelumSelesai] = useState("");
    const [catatan, setCatatan] = useState("");
    // ================= FETCH DETAIL =================
    const fetchDetail = async () => {
        try {
            const res = await api.get(`/laporan-kerja/${id}`);
            const data = res.data.data; // ⬅️ PAKAI INI (SESUAI API KAMU)
            setInformasiUmum(data.informasi_umum ?? "");
            setPekerjaanDilaksanakan(data.pekerjaan_yang_dilaksanakan ?? "");
            setPekerjaanBelumSelesai(data.pekerjaan_belum_selesai ?? "");
            setCatatan(data.catatan ?? "");
        }
        catch (err) {
            Swal.fire("Error", "Gagal memuat data laporan", "error");
            navigate(-1);
        }
    };
    const [form, setForm] = useState({
        informasi_umum: "",
        pekerjaan_yang_dilaksanakan: "",
        pekerjaan_belum_selesai: "",
        catatan: "",
    });
    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);
    // ================= UPDATE =================
    const handleSubmit = async () => {
        if (!informasiUmum || !pekerjaanDilaksanakan) {
            Swal.fire("Oops", "Field wajib belum diisi", "warning");
            return;
        }
        try {
            setLoading(true);
            await api.put(`/laporan-kerja/${id}`, {
                informasi_umum: informasiUmum,
                pekerjaan_yang_dilaksanakan: pekerjaanDilaksanakan,
                pekerjaan_belum_selesai: pekerjaanBelumSelesai || null,
                catatan: catatan || null,
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Laporan berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate(-1);
        }
        catch (err) {
            Swal.fire("Gagal", "Tidak bisa memperbarui laporan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    // ================= UI =================
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-8 rounded-b-[32px] pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "p-2 mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Edit Laporan Kerja" })] }) }), _jsxs("div", { className: "px-5 mt-6 space-y-4", children: [_jsx(FormSection, { title: "Informasi Umum", children: _jsx("textarea", { rows: 3, value: informasiUmum, onChange: (e) => setInformasiUmum(e.target.value), className: "w-full border rounded-xl px-4 py-3" }) }), _jsx(FormSection, { title: "Pekerjaan yang Dilaksanakan", children: _jsx("textarea", { rows: 4, value: pekerjaanDilaksanakan, onChange: (e) => setPekerjaanDilaksanakan(e.target.value), className: "w-full border rounded-xl px-4 py-3" }) }), _jsx(FormSection, { title: "Pekerjaan Belum Selesai", children: _jsx("textarea", { rows: 4, value: pekerjaanBelumSelesai, onChange: (e) => setPekerjaanBelumSelesai(e.target.value), className: "w-full border rounded-xl px-4 py-3" }) }), _jsx(FormSection, { title: "Catatan", children: _jsx("textarea", { rows: 3, value: catatan, onChange: (e) => setCatatan(e.target.value), className: "w-full border rounded-xl px-4 py-3" }) })] }), _jsx("div", { className: "fixed bottom-20 left-0 right-0 px-5", children: _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-lg disabled:opacity-60", children: loading ? "Menyimpan..." : "Simpan Perubahan" }) }), _jsx(BottomNav, {})] }));
}
/* ================= KOMPONEN KECIL ================= */
function FormSection({ title, children, }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm border", children: [_jsx("p", { className: "text-sm sm:text-base font-semibold text-gray-800 mb-2", children: title }), children] }));
}
