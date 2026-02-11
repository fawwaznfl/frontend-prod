import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
const PublicRoute = ({ children }) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("dashboard_type");
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsValidating(false);
                return;
            }
            try {
                // Cek apakah token masih valid
                await api.get("/profile");
                console.log("User already authenticated");
                setIsAuthenticated(true);
            }
            catch (error) {
                console.error("Token invalid:", error);
                // Token tidak valid, bersihkan localStorage
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
        checkAuth();
    }, [token]);
    if (isValidating) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    // Jika sudah login, redirect ke dashboard sesuai role
    if (isAuthenticated && userRole) {
        console.log("Redirecting to dashboard, role:", userRole);
        if (userRole === "pegawai") {
            return _jsx(Navigate, { to: "/home-pegawai", replace: true });
        }
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default PublicRoute;
