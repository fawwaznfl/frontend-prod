import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import api from "../../api/axios";
import { setAuthData } from "../../../src/api/auth";
export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/login", formData);
            const { pegawai, token } = res.data;
            // Gunakan helper function untuk set auth data
            setAuthData(token, pegawai);
            // ✅ CEK FACE RECOGNITION UNTUK PEGAWAI
            if (pegawai.dashboard_type === "pegawai") {
                try {
                    const faceRes = await api.get(`/face/check/${pegawai.id}`);
                    const isRegistered = faceRes.data?.data?.registered;
                    // Simpan status face registration
                    localStorage.setItem("face_registered", String(isRegistered));
                    await Swal.fire({
                        icon: "success",
                        title: "Login Berhasil!",
                        text: `Selamat datang, ${pegawai.name}`,
                        confirmButtonColor: "#2563eb",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    navigate("/home-pegawai");
                }
                catch (error) {
                    console.error("Error checking face:", error);
                    // Jika error cek face, tetap lanjut ke home
                    navigate("/home-pegawai");
                }
            }
            // ADMIN & SUPERADMIN
            else {
                await Swal.fire({
                    icon: "success",
                    title: "Login Berhasil!",
                    text: `Selamat datang, ${pegawai.name}`,
                    confirmButtonColor: "#2563eb",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/dashboard");
            }
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal Login",
                text: error.response?.data?.message || "Email atau password salah.",
                confirmButtonColor: "#dc2626",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar", children: _jsxs("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: [_jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "Login" }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsxs(Label, { children: ["Email", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "email", name: "email", placeholder: "Masukan Email Kamu", value: formData.email, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Password", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { type: showPassword ? "text" : "password", name: "password", placeholder: "Masukan Password", value: formData.password, onChange: handleChange, required: true }), _jsx("span", { onClick: () => setShowPassword(!showPassword), className: "absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2", children: showPassword ? (_jsx(EyeIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) : (_jsx(EyeCloseIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) })] }), _jsx("div", { className: "mt-2 text-right", children: _jsx(Link, { to: "/forgot-password", className: "text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "Lupa Password?" }) })] }), _jsx("button", { type: "submit", disabled: loading, className: "flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Memproses..." : "Login" })] }) }), _jsxs("p", { className: "mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start", children: ["Belum punya akun?", " ", _jsx(Link, { to: "/signup", className: "text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "Daftar" })] })] }) }));
}
