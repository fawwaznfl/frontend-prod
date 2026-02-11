import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    return (_jsxs("div", { className: "min-h-screen xl:flex", children: [_jsxs("div", { children: [_jsx(AppSidebar, {}), _jsx(Backdrop, {})] }), _jsxs("div", { className: `flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${isMobileOpen ? "ml-0" : ""}`, children: [_jsx(AppHeader, {}), _jsx("div", { className: "p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6", children: _jsx(Outlet, {}) })] })] }));
};
const AppLayout = () => {
    return (_jsx(SidebarProvider, { children: _jsx(LayoutContent, {}) }));
};
export default AppLayout;
