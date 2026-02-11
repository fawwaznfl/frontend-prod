import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: 0,
        nama: "",
        guard_name: "web",
    });
    const [loading, setLoading] = useState(true);
    const fetchRole = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/roles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm({ ...res.data.data, guard_name: "web" });
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Tidak bisa memuat data role", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRole();
    }, [id]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.put(`/roles/${id}`, { nama: form.nama }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil", "Role berhasil diperbarui", "success");
            navigate("/role");
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan saat update role", "error");
        }
    };
    if (loading)
        return _jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Role", description: "Edit Role" }), _jsx(PageHeader, { pageTitle: "Edit Role", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/role"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { title: "Form Edit Role", className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Nama Role" }), _jsx("input", { type: "text", name: "nama", value: form.nama, onChange: handleChange, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white", placeholder: "Masukkan nama role" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium dark:text-gray-200", children: "Guard Name" }), _jsx("input", { type: "text", name: "guard_name", value: form.guard_name, readOnly: true, className: "w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed" })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl", children: "Simpan Perubahan" })] }) }) })] }));
}
