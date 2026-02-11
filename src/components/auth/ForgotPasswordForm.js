import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Label from "../form/Label";
import { useNavigate } from "react-router-dom";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            Swal.fire("Error", "Email wajib diisi!", "error");
            return;
        }
        try {
            await api.post("/forgot-password", { email });
            // kalau sukses, langsung arahkan ke reset password
            navigate("/reset-password", { state: { email } });
        }
        catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
        }
    };
    return (_jsx("div", { className: "flex flex-col flex-1", children: _jsx("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: _jsxs("div", { children: [_jsx("div", { className: "mb-5 sm:mb-8", children: _jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "Lupa Password" }) }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs(Label, { children: ["Email ", _jsx("span", { className: "text-error-500", children: "*" }), " "] }), _jsx(Input, { placeholder: "Masukan Email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsx("div", { children: _jsx(Button, { type: "submit", className: "w-full", size: "sm", children: "Lanjut" }) })] }) })] }) }) }));
}
