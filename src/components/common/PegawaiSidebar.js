import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X, LogOut, User, Lock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function PegawaiSidebar({ open, onClose }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!open)
        return null;
    const menu = [
        { label: "Profil Saya", icon: User, link: "/my-profile-pegawai/:id" },
        { label: "Notifikasi", icon: Bell, link: "/notification" },
        { label: "Ubah Password", icon: Lock, link: "/change-password-pegawai" },
    ];
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Kamu akan keluar dari akun ini",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
        });
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire({
                title: "Berhasil Logout",
                text: "Sampai jumpa 👋",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { onClick: onClose, className: "fixed inset-0 bg-black/40 z-40" }), _jsxs("div", { className: "fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl rounded-l-3xl flex flex-col", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-bl-3xl", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden", children: user.foto_karyawan ? (_jsx("img", { src: user.foto_karyawan, className: "w-full h-full object-cover" })) : (_jsx(User, { className: "w-6 h-6" })) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold leading-tight", children: user.name || "Pegawai" }), _jsx("p", { className: "text-xs opacity-80", children: user.nama_lokasi || "" })] })] }), _jsx("button", { onClick: onClose, children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsx("div", { className: "flex-1 p-4 space-y-2", children: menu.map((m, i) => (_jsxs("button", { onClick: () => {
                                navigate(m.link);
                                onClose();
                            }, className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700", children: [_jsx(m.icon, { className: "w-5 h-5 text-indigo-600" }), _jsx("span", { className: "text-sm font-medium", children: m.label })] }, i))) }), _jsx("div", { className: "p-4 border-t", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition", children: [_jsx(LogOut, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-semibold", children: "Logout" })] }) })] })] }));
}
