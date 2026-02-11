import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import salaryIcon from "../../../icons/salary.png";
import refundIcon from "../../../icons/refund.png";
import kasbonIcon from "../../../icons/kasbon.png";
import { Bell, Grid } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import PegawaiSidebar from "../../../components/common/PegawaiSidebar";
import passportIcon from "../../../icons/passport.png";
import absenIcon from "../../../icons/qr.png";
import lemburIcon from "../../../icons/overtime.png";
import cutiIcon from "../../../icons/wifi.png";
import assignIcon from "../../../icons/assign.png";
import historylemburIcon from "../../../icons/suitcase.png";
import otherIcon from "../../../icons/other.png";
import meetingIcon from "../../../icons/meeting.png";
import Swal from "sweetalert2";
export default function PegawaiHome() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.id;
    const lokasiName = user.nama_lokasi || "-";
    // hitung total keuangan
    const [totalKasbon, setTotalKasbon] = useState(0);
    const [totalReimbursement, setTotalReimbursement] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const buildImageUrl = (path) => {
        if (!path)
            return "";
        if (path.startsWith("http"))
            return path;
        const base = STORAGE_URL?.replace(/\/$/, "");
        const cleanPath = path.replace(/^\//, "");
        return `${base}/${cleanPath}`;
    };
    const [shiftTime, setShiftTime] = useState("Loading...");
    const [openSidebar, setOpenSidebar] = useState(false);
    const [notifCount, setNotifCount] = useState(3);
    const [berita, setBerita] = useState([]);
    // CEK FACE REGISTRATION SAAT PERTAMA LOAD
    useEffect(() => {
        const checkFaceRegistration = async () => {
            try {
                const res = await api.get(`/face/check/${pegawai_id}`);
                if (!res.data.data.registered) {
                    Swal.fire({
                        icon: "warning",
                        title: "Face Recognition Belum Terdaftar",
                        text: "Untuk keamanan absensi, silakan daftarkan wajah Anda terlebih dahulu",
                        confirmButtonText: "Daftar Sekarang",
                        confirmButtonColor: "#4f46e5",
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/face-recog-regis/${pegawai_id}`);
                        }
                    });
                }
            }
            catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Face Service Tidak Tersedia",
                    text: "Layanan verifikasi wajah sedang bermasalah. Silakan hubungi admin.",
                    confirmButtonColor: "#dc2626",
                });
            }
        };
        checkFaceRegistration();
    }, []);
    // === GET SHIFT TODAY ===
    const fetchShiftToday = async () => {
        try {
            const res = await api.get(`/shift-mapping/today/${pegawai_id}`);
            if (res.data.data?.shift) {
                const shift = res.data.data.shift;
                setShiftTime(`${shift.jam_masuk} - ${shift.jam_pulang}`);
            }
            else {
                setShiftTime("Belum Ada Shift");
            }
        }
        catch {
            setShiftTime("Belum Ada Shift");
        }
    };
    const fetchTotalKasbon = async () => {
        try {
            const res = await api.get("/kasbon");
            const data = res.data.data || [];
            const total = data
                .filter((it) => ["pending", "approve"].includes(it.status))
                .reduce((sum, it) => {
                return sum + Number(it.nominal || 0);
            }, 0);
            setTotalKasbon(total);
        }
        catch (err) {
            console.error("Gagal hitung kasbon", err);
            setTotalKasbon(0);
        }
    };
    const fetchTotalReimbursement = async () => {
        try {
            const res = await api.get("/reimbursement");
            const data = res.data.data || [];
            const total = data
                .filter((it) => ["pending", "approve"].includes(it.status?.toLowerCase()))
                .reduce((sum, it) => {
                return sum + Number(it.terpakai || 0);
            }, 0);
            setTotalReimbursement(total);
        }
        catch (err) {
            console.error("Gagal hitung reimbursement", err);
            setTotalReimbursement(0);
        }
    };
    const formatRupiah = (value) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    const fetchBerita = async () => {
        try {
            const res = await api.get("/berita", {
                params: {
                    company_id: user.company_id,
                },
            });
            setBerita(res.data.data || []);
        }
        catch (err) {
            console.error("Gagal ambil berita", err);
        }
    };
    useEffect(() => {
        fetchShiftToday();
        fetchTotalKasbon();
        fetchTotalReimbursement();
        fetchBerita();
    }, []);
    //console.log("USER LS:", user);
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 pb-28", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-[32px] shadow-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shadow-md", children: user.foto_karyawan ? (_jsx("img", { src: buildImageUrl(user.foto_karyawan), onError: (e) => {
                                            e.currentTarget.src = "/default-avatar.jpg";
                                        }, className: "w-full h-full object-cover" })) : (_jsx(User, { className: "w-8 h-8 opacity-90" })) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: user?.name }), _jsx("p", { className: "text-sm opacity-90", children: user?.nama_divisi })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate("/notification"), className: "relative", children: [_jsx(Bell, { className: "w-6 h-6" }), notifCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" }))] }), _jsx("button", { onClick: () => setOpenSidebar(true), children: _jsx(Grid, { className: "w-6 h-6" }) })] })] }) }), _jsxs("div", { className: "mx-5 -mt-5 bg-white p-5 rounded-3xl shadow-lg", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Cabang" }), _jsx("p", { className: "text-xs md:text-sm font-semibold text-gray-900 mt-1", children: lokasiName })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Jam Kerja" }), _jsx("p", { className: "font-semibold text-gray-800 text-sm md:text-lg", children: shiftTime })] })] }), _jsx("div", { className: "my-4 border-t border-gray-200" }), _jsx("div", { className: "grid grid-cols-3 text-center", children: [
                            { img: salaryIcon, label: "Payroll", link: "/payroll-pegawai" },
                            { img: refundIcon, label: "Reimbursement", value: formatRupiah(totalReimbursement), link: "/reimbursement-pegawai", },
                            { img: kasbonIcon, label: "Kasbon", value: formatRupiah(totalKasbon), link: "/kasbon-pegawai", },
                        ].map((item, i) => (_jsxs("div", { onClick: () => item.link && navigate(item.link), className: "flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition", children: [_jsx("img", { src: item.img, className: "w-10 h-10", alt: "" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: item.label }), _jsx("p", { className: "text-sm text-green-600", children: item.value })] }, i))) })] }), _jsxs("div", { className: "px-5 mt-8", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-4 text-lg", children: "Layanan" }), _jsx("div", { className: "grid grid-cols-4 gap-4 text-center", children: [
                            { label: "Absensi", img: absenIcon, link: `/shift-mapping/self/${pegawai_id}` },
                            { label: "Cuti & Izin", img: cutiIcon, link: "/cuti-izin" },
                            { label: "Dinas Luar", img: passportIcon, link: `/dinas-luar/self/${pegawai_id}` },
                            { label: "Lembur", img: lemburIcon, link: `/absensi-lembur/pegawai/${pegawai_id}` },
                            { label: "Rapat", img: meetingIcon, link: "/rapat-pegawai" },
                            { label: "Penugasan", img: assignIcon, link: "/penugasan-pegawai" },
                            { label: "History Lembur", img: historylemburIcon, link: `/history-lembur/${pegawai_id}` },
                            { label: "Other", img: otherIcon, link: "/other" },
                        ].map((m, i) => (_jsxs("div", { onClick: () => m.link && navigate(m.link), className: "flex flex-col items-center gap-2 cursor-pointer", children: [_jsx("div", { className: "w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center hover:shadow-lg transition-all active:scale-95", children: _jsx("img", { src: m.img, alt: m.label, className: "w-7 h-7" }) }), _jsx("p", { className: "text-xs font-medium text-gray-700", children: m.label })] }, i))) })] }), _jsxs("div", { className: "px-5 mt-10", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "font-semibold text-gray-800 text-lg", children: "Berita" }), _jsx("button", { onClick: () => navigate("/berita/pegawai"), className: "text-indigo-600 text-sm font-medium", children: "Lihat Semua" })] }), _jsx("div", { className: "flex gap-4 overflow-x-auto no-scrollbar pb-2", children: berita.map((b) => (_jsxs("div", { onClick: () => navigate(`/berita/${b.id}`), className: "min-w-[220px] h-32 rounded-xl shadow-md overflow-hidden cursor-pointer relative group", children: [_jsx("img", { src: buildImageUrl(b.gambar), alt: b.judul, className: "w-full h-full object-cover group-hover:scale-105 transition" }), _jsx("div", { className: "absolute inset-0 bg-black/40 flex items-end p-3", children: _jsx("p", { className: "text-white text-sm font-semibold line-clamp-2", children: b.judul }) })] }, b.id))) })] }), _jsx(BottomNav, {}), _jsx(PegawaiSidebar, { open: openSidebar, onClose: () => setOpenSidebar(false) })] }));
}
