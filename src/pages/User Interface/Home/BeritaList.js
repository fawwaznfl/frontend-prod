import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function BeritaList() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchBerita = async () => {
        try {
            const res = await api.get("/berita", {
                params: { company_id: user.company_id },
            });
            setBerita(res.data.data || []);
        }
        catch (err) {
            console.error("Gagal ambil berita", err);
        }
        finally {
            setLoading(false);
        }
    };
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    useEffect(() => {
        fetchBerita();
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 pb-6", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-3", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold", children: "Semua Berita" })] }) }), _jsx("div", { className: "p-5", children: loading ? (_jsx("p", { className: "text-center text-gray-500", children: "Memuat berita..." })) : berita.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "Belum ada berita" })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: berita.map((b) => (_jsxs("div", { onClick: () => navigate(`/berita/${b.id}`), className: "bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition", children: [b.gambar && (_jsx("img", { src: `${STORAGE_URL}/${b.gambar}`, alt: b.judul, className: "w-full h-40 object-cover" })), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-gray-800 line-clamp-2", children: b.judul }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(b.tanggal_publikasi).toLocaleDateString("id-ID") }), _jsx("p", { className: "text-sm text-gray-600 mt-2 line-clamp-3", children: b.isi })] })] }, b.id))) })) })] }));
}
