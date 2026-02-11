import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function EditCompany() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        alamat: "",
        telepon: "",
        email: "",
        website: "",
    });
    const [loading, setLoading] = useState(true);
    const fetchCompany = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/companies/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm(res.data.data);
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Tidak bisa memuat data perusahaan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompany();
    }, []);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.put(`/companies/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Data perusahaan berhasil diperbarui.", "success");
            navigate("/company");
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan saat update perusahaan.", "error");
        }
    };
    if (loading)
        return _jsx("p", { children: "Loading..." });
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-5 bg-white dark:bg-gray-800 rounded-xl shadow", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 dark:text-white", children: "Edit Perusahaan" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Nama" }), _jsx("input", { type: "text", name: "name", value: form.name, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Alamat" }), _jsx("textarea", { name: "alamat", value: form.alamat, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Telepon" }), _jsx("input", { type: "text", name: "telepon", value: form.telepon, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Email" }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Website" }), _jsx("input", { type: "text", name: "website", value: form.website, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg", children: "Simpan Perubahan" })] })] }));
}
