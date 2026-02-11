import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
const ProtectedRoute = ({ allowedRoles, children }) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const userRole = localStorage.getItem("dashboard_type");
    const token = localStorage.getItem("token");
    useEffect(() => {
        const validateToken = async () => {
            // Jika tidak ada token atau role, langsung redirect
            if (!token || !userRole) {
                //console.log("No token or role found");
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }
            // Jika role tidak sesuai, langsung redirect
            if (!allowedRoles.includes(userRole)) {
                //console.log("Role not allowed:", userRole);
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }
            try {
                // Validasi token ke backend
                const response = await api.get("/profile");
                //console.log("Token valid:", response.data);
                setIsAuthenticated(true);
            }
            catch (error) {
                //console.error("Token validation failed:", error);
                // Token tidak valid, hapus data dan redirect ke login
                localStorage.removeItem("token");
                localStorage.removeItem("dashboard_type");
                localStorage.removeItem("user");
                localStorage.removeItem("face_registered");
                setIsAuthenticated(false);
            }
            finally {
                setIsValidating(false);
            }
        };
        validateToken();
    }, [token, userRole, allowedRoles]);
    // Tampilkan loading saat validasi
    if (isValidating) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600 dark:text-gray-400", children: "Memvalidasi sesi..." })] }) }));
    }
    // Jika tidak terautentikasi, redirect ke login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
