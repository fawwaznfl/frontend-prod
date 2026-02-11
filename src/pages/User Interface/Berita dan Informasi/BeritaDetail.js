import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function BeritaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [berita, setBerita] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    const fetchDetail = async () => {
        try {
            const res = await api.get(`/berita/${id}`);
            setBerita(res.data.data);
        }
        catch (err) {
            console.error("Gagal ambil detail berita", err);
        }
    };
    useEffect(() => {
        fetchDetail();
    }, [id]);
    if (!berita) {
        return _jsx("p", { className: "p-5 text-center", children: "Memuat..." });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-3", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold", children: "Detail Berita" })] }) }), _jsxs("div", { className: "p-5", children: [berita.gambar && (_jsx("img", { src: `${STORAGE_URL}/${berita.gambar}`, alt: berita.judul, className: "w-full h-56 object-cover rounded-2xl shadow-md" })), _jsx("h2", { className: "text-xl font-bold mt-4", children: berita.judul }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(berita.tanggal_publikasi).toLocaleDateString("id-ID") }), _jsx("div", { className: "mt-4 text-gray-700 leading-relaxed whitespace-pre-line", children: berita.isi_konten })] })] }));
}
