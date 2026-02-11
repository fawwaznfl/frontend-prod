import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import api from "../../api/axios";
export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        no_telp: "",
        company_id: "",
        password: "",
        password_confirmation: "",
    });
    // FETCH COMPANIES 
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get("/v1/public/companies");
                setCompanies(res.data.data);
            }
            catch (err) {
                console.error("Gagal load company", err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memuat Company",
                    text: "Tidak bisa mengambil data company.",
                });
            }
        };
        fetchCompanies();
    }, []);
    // HANDLE CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await api.post("/register", formData);
            Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil!",
                text: "Akun kamu berhasil dibuat. Silakan login.",
                confirmButtonColor: "#2563eb",
                confirmButtonText: "Oke",
            }).then(() => navigate("/"));
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
            Swal.fire({
                icon: "error",
                title: "Gagal Registrasi",
                text: errorMessage,
                confirmButtonColor: "#dc2626",
            });
            setMessage(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    // USER INTERFACE
    return (_jsx("div", { className: "flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar", children: _jsx("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: _jsxs("div", { children: [_jsx("div", { className: "mb-5 sm:mb-8", children: _jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "Register" }) }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsxs(Label, { children: ["Nama Lengkap", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "text", name: "name", placeholder: "Masukan Nama Kamu", value: formData.name, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Username", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "text", name: "username", placeholder: "Masukan Username", value: formData.username, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Email", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "email", name: "email", placeholder: "Masukan Email Kamu", value: formData.email, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Nomor Telepon", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "text", name: "no_telp", placeholder: "Masukan Nomor Telepon Kamu", value: formData.no_telp, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Company", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsxs("select", { name: "company_id", value: formData.company_id, onChange: handleChange, className: "w-full px-3 py-2 border rounded-lg text-sm\n                             focus:border-brand-500 focus:ring-brand-500\n                             dark:bg-gray-800 dark:border-gray-700 dark:text-white", required: true, children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((company) => (_jsx("option", { value: company.id, children: company.name }, company.id)))] })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Password", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { placeholder: "Masukan password", type: showPassword ? "text" : "password", name: "password", value: formData.password, onChange: handleChange, required: true }), _jsx("span", { onClick: () => setShowPassword(!showPassword), className: "absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2", children: showPassword ? (_jsx(EyeIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) : (_jsx(EyeCloseIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) })] })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["Konfirmasi Password", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx("div", { className: "relative", children: _jsx(Input, { placeholder: "Ulangi Password", type: showPassword ? "text" : "password", name: "password_confirmation", value: formData.password_confirmation, onChange: handleChange, required: true }) })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600", children: loading ? "Mendaftar..." : "Register" }) }), message && (_jsx("p", { className: "text-center text-sm mt-3 text-gray-700 dark:text-gray-300", children: message }))] }) }), _jsx("div", { className: "mt-5", children: _jsxs("p", { className: "text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start", children: ["Sudah Punya Akun?", " ", _jsx(Link, { to: "/", className: "text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "Masuk" })] }) })] }) }) }));
}
