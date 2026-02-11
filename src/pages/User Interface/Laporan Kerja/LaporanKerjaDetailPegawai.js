import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import Swal from "sweetalert2";
import { Trash2, Edit } from "lucide-react";
export default function LaporanKerjaDetailPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const fetchDetail = async () => {
        try {
            const res = await api.get(`/laporan-kerja/${id}`);
            setData(res.data.data ?? res.data);
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Hapus laporan?",
            text: "Laporan yang dihapus tidak bisa dikembalikan",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed)
            return;
        try {
            await api.delete(`/laporan-kerja/${id}`);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Laporan berhasil dihapus",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate(-1);
        }
        catch (err) {
            Swal.fire("Gagal", "Tidak bisa menghapus laporan", "error");
        }
    };
    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);
    if (!data) {
        return _jsx("div", { className: "p-6 text-center", children: "Loading..." });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-8 rounded-b-[32px] pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "flex-1 text-center text-lg font-semibold", children: "Detail Laporan" })] }) }), _jsxs("div", { className: "px-5 mt-6 space-y-4", children: [_jsx(Section, { title: "Informasi Umum", children: data.informasi_umum }), _jsx(Section, { title: "Pekerjaan yang Dilaksanakan", children: data.pekerjaan_yang_dilaksanakan }), _jsx(Section, { title: "Catatan", children: data.catatan || "-" }), _jsx(Section, { title: "Pekerjaan Belum Selesai", children: data.pekerjaan_belum_selesai || "-" })] }), _jsx("div", { className: "fixed bottom-20 left-0 right-0 px-5", children: _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => navigate(`/edit-laporan-kerja/${id}`), className: "flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-full shadow-lg", children: [_jsx(Edit, { className: "w-4 h-4" }), "Edit"] }), _jsxs("button", { onClick: handleDelete, className: "flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-full shadow-lg", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Hapus"] })] }) }), _jsx(BottomNav, {})] }));
}
/* ================= COMPONENT KECIL ================= */
function Section({ title, children, }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm border", children: [_jsx("p", { className: "text-sm sm:text-base font-semibold text-gray-800 mb-2", children: title }), _jsx("p", { className: "text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line", children: children })] }));
}
