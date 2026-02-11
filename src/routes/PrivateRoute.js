import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (!token || !user) {
        return _jsx(Navigate, { to: "/signin", replace: true });
    }
    return _jsx(Outlet, {});
}
