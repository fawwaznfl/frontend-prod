import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
export default function ResetPasswordForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !passwordConfirmation) {
            Swal.fire("Error", "Password wajib diisi!", "error");
            return;
        }
        if (password !== passwordConfirmation) {
            Swal.fire("Error", "Password tidak sama!", "error");
            return;
        }
        try {
            await api.post("/reset-password", { email, password, password_confirmation: passwordConfirmation });
            Swal.fire("Sukses", "Password berhasil diubah!", "success");
            navigate("/");
        }
        catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
        }
    };
    return (_jsx("div", { className: "flex flex-col flex-1", children: _jsx("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: _jsxs("div", { children: [_jsx("div", { className: "mb-5 sm:mb-8", children: _jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "Masukan Password Baru" }) }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsxs(Label, { children: ["Password Baru ", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { placeholder: "Password Baru", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), className: "pr-10" }), _jsx("button", { type: "button", className: "absolute right-3 top-[68%] -translate-y-1/2 text-gray-500", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "relative", children: [_jsxs(Label, { children: ["Konfirmasi Password ", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { placeholder: "Konfirmasi Password", type: showPasswordConfirmation ? "text" : "password", value: passwordConfirmation, onChange: (e) => setPasswordConfirmation(e.target.value), className: "pr-10" }), _jsx("button", { type: "button", className: "absolute right-3 top-[68%] -translate-y-1/2 text-gray-500", onClick: () => setShowPasswordConfirmation(!showPasswordConfirmation), children: showPasswordConfirmation ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), _jsx("div", { children: _jsx(Button, { type: "submit", className: "w-full", size: "sm", children: "Ubah Password" }) })] }) })] }) }) }));
}
