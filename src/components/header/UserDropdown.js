import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const name = user?.name || "User";
    const email = user?.email || "-";
    const avatar = user?.foto_karyawan
        ? user.foto_karyawan
        : "/default.jpg";
    function toggleDropdown() {
        setIsOpen(!isOpen);
    }
    function closeDropdown() {
        setIsOpen(false);
    }
    const handleLogout = () => {
        Swal.fire({
            title: "Yakin ingin logout?",
            text: "Kamu akan keluar dari dashboard.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, logout!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("dashboard_type");
                Swal.fire({
                    icon: "success",
                    title: "Berhasil logout",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            }
        });
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: toggleDropdown, className: "flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300", children: [_jsx("span", { className: "overflow-hidden rounded-full h-11 w-11", children: _jsx("img", { src: avatar, alt: "User", className: "object-cover w-full h-full" }) }), _jsx("span", { className: "font-medium text-theme-sm", children: name }), _jsx("svg", { className: `ml-1 fill-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`, width: "20", height: "20", viewBox: "0 0 24 24", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 15.25C11.802 15.25 11.604 15.175 11.46 15.025L6.46 10.025C6.169 9.734 6.169 9.262 6.46 8.971C6.751 8.68 7.223 8.68 7.514 8.971L12 13.457L16.486 8.971C16.777 8.68 17.249 8.68 17.54 8.971C17.831 9.262 17.831 9.734 17.54 10.025L12.54 15.025C12.396 15.175 12.198 15.25 12 15.25Z" }) })] }), _jsxs(Dropdown, { isOpen: isOpen, onClose: closeDropdown, className: "absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark", children: [_jsxs("div", { children: [_jsx("span", { className: "block font-medium text-gray-700 text-theme-sm dark:text-gray-400", children: name }), _jsx("span", { className: "mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400", children: email })] }), _jsx("ul", { className: "flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800", children: _jsx("li", { children: _jsxs(DropdownItem, { onItemClick: closeDropdown, tag: "a", to: "/profile", className: "flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5", children: [_jsx("svg", { className: "fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300", width: "24", height: "24", viewBox: "0 0 24 24", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" }) }), "Edit Profile"] }) }) }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5", children: [_jsx("svg", { className: "fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300", width: "24", height: "24", viewBox: "0 0 24 24", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.1 19.25C14.69 19.25 14.35 18.91 14.35 18.5V14.25H12.85V18.5C12.85 19.74 13.86 20.75 15.1 20.75H18.5C19.74 20.75 20.75 19.74 20.75 18.5V5.5C20.75 4.25 19.74 3.25 18.5 3.25H15.1C13.86 3.25 12.85 4.25 12.85 5.5V9.75H14.35V5.5C14.35 5.08 14.69 4.75 15.1 4.75H18.5C18.91 4.75 19.25 5.08 19.25 5.5V18.5C19.25 18.91 18.91 19.25 18.5 19.25H15.1ZM3.25 12C3.25 12.21 3.34 12.41 3.49 12.55L8.09 17.16C8.39 17.45 8.86 17.45 9.16 17.16C9.45 16.86 9.45 16.39 9.16 16.1L5.81 12.75H16C16.41 12.75 16.75 12.41 16.75 12C16.75 11.58 16.41 11.25 16 11.25H5.81L9.16 7.91C9.45 7.61 9.45 7.14 9.16 6.84C8.86 6.55 8.39 6.55 8.09 6.84L3.52 11.42C3.36 11.56 3.25 11.77 3.25 12Z" }) }), "Sign out"] })] })] }));
}
