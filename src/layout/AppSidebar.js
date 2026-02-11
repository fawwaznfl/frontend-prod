import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSidebarMenu, othersMenu } from "../data/sidebarMenu";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useLayoutEffect } from "react";
const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});
    // Ambil role user dan cast ke union type
    const roleFromStorage = localStorage.getItem("dashboard_type");
    const role = roleFromStorage === "superadmin" ? "superadmin" : "admin";
    const navItems = getSidebarMenu(role);
    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);
    // Set submenu terbuka sesuai route
    useEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            const el = subMenuRefs.current[key];
            if (el) {
                setTimeout(() => {
                    const height = el.scrollHeight;
                    setSubMenuHeight((prev) => ({ ...prev, [key]: height }));
                }, 100); // beri delay kecil biar DOM ready
            }
        }
    }, [openSubmenu]);
    // Set tinggi submenu untuk animasi
    useLayoutEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            const el = subMenuRefs.current[key];
            if (el) {
                console.log("Submenu element:", el, "scrollHeight:", el.scrollHeight);
                const height = el.scrollHeight;
                requestAnimationFrame(() => {
                    setSubMenuHeight((prev) => ({ ...prev, [key]: height }));
                });
            }
        }
    }, [openSubmenu]);
    const handleSubmenuToggle = (index, menuType) => {
        console.log("Toggle submenu:", index, menuType);
        setOpenSubmenu((prev) => prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index });
    };
    const renderMenuItems = (items, menuType) => (_jsx("ul", { className: "flex flex-col gap-4", children: items.map((nav, index) => (_jsxs("li", { children: [nav.subItems ? (_jsxs("button", { onClick: () => handleSubmenuToggle(index, menuType), className: `menu-item group cursor-pointer ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"} ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`, children: [_jsx("span", { className: `menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && _jsx("span", { className: "menu-item-text", children: nav.name }), (isExpanded || isHovered || isMobileOpen) && (_jsx(ChevronDownIcon, { className: `ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}` }))] })) : (_jsxs(Link, { to: nav.path || "#", className: `menu-item group ${isActive(nav.path || "#") ? "menu-item-active" : "menu-item-inactive"}`, children: [_jsx("span", { className: `menu-item-icon-size ${isActive(nav.path || "#") ? "menu-item-icon-active" : "menu-item-icon-inactive"}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && _jsx("span", { className: "menu-item-text", children: nav.name })] })), nav.subItems && (isExpanded || isHovered || isMobileOpen) && (_jsx("div", { ref: (el) => {
                        subMenuRefs.current[`${menuType}-${index}`] = el;
                        return;
                    }, className: "overflow-hidden transition-[max-height] duration-300 ease-in-out", style: {
                        maxHeight: openSubmenu?.type === menuType && openSubmenu?.index === index
                            ? `${subMenuHeight[`${menuType}-${index}`] || 500}px`
                            : "0px",
                    }, children: _jsx("ul", { className: "mt-2 space-y-1 ml-9 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg", children: nav.subItems.map((subItem) => (_jsx("li", { children: _jsxs(Link, { to: subItem.path, className: `menu-dropdown-item ${isActive(subItem.path)
                                    ? "menu-dropdown-item-active"
                                    : "menu-dropdown-item-inactive"}`, children: [subItem.name, (subItem.new || subItem.pro) && (_jsx("span", { className: `ml-auto ${isActive(subItem.path)
                                            ? "menu-dropdown-badge-active"
                                            : "menu-dropdown-badge-inactive"}`, children: subItem.new ? "new" : "pro" }))] }) }, subItem.name))) }) }))] }, nav.name))) }));
    return (_jsxs("aside", { className: `fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`, onMouseEnter: () => !isExpanded && setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("div", { className: `py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`, children: _jsx(Link, { to: "/", children: isExpanded || isHovered || isMobileOpen ? (_jsxs(_Fragment, { children: [_jsx("img", { className: "dark:hidden", src: "/images/logo/logo_baru.png", alt: "Logo", width: 250, height: 40 }), _jsx("img", { className: "hidden dark:block", src: "/images/logo/logo_baru_dark.png", alt: "Logo", width: 250, height: 40 })] })) : (_jsx("img", { src: "/images/logo/logo_icon.png", alt: "Logo", width: 65, height: 65 })) }) }), _jsx("div", { className: "flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar", children: _jsx("nav", { className: "mb-6", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: `mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`, children: isExpanded || isHovered || isMobileOpen ? "Menu" : _jsx(HorizontaLDots, { className: "size-6" }) }), renderMenuItems(navItems, "main")] }), _jsxs("div", { children: [_jsx("h2", { className: `mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`, children: isExpanded || isHovered || isMobileOpen ? "Others" : _jsx(HorizontaLDots, {}) }), renderMenuItems(othersMenu, "others")] })] }) }) })] }));
};
export default AppSidebar;
