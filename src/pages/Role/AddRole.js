import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
export default function AddRole() {
    const navigate = useNavigate();
    const dashboardType = localStorage.getItem("dashboard_type");
    const userCompanyId = localStorage.getItem("company_id");
    const [role, setRole] = useState({
        nama: "",
        company_id: "",
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        nama: "",
        company_id: "",
    });
    // FETCH COMPANIES
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setCompanies(data);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
            setCompanies([]);
        }
    };
    useEffect(() => {
        fetchCompanies();
        // Jika admin, set company_id otomatis & sembunyikan dropdown
        if (dashboardType === "admin") {
            setRole((prev) => ({
                ...prev,
                company_id: userCompanyId || "",
            }));
        }
    }, []);
    // VALIDASI
    const validate = () => {
        const newErrors = { nama: "", company_id: "" };
        let isValid = true;
        if (!role.nama.trim()) {
            newErrors.nama = "Nama role wajib diisi";
            isValid = false;
        }
        // VALIDASI UNTUK COMPANY (HANYA SUPERADMIN)
        if (dashboardType === "superadmin" && !role.company_id) {
            newErrors.company_id = "Pilih company";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    const handleChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await api.post("/roles", role, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Role berhasil ditambahkan.",
                confirmButtonColor: "#3085d6",
            }).then(() => navigate("/role"));
        }
        catch (err) {
            console.error("Error adding role:", err);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menambahkan role.",
                confirmButtonColor: "#d33",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Add-Role", description: "Add Role" }), _jsx(PageHeader, { pageTitle: "Tambah Role", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/role"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { title: "Form Tambah Role", className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "space-y-4", children: [dashboardType === "superadmin" && (_jsxs("div", { children: [_jsx(Label, { children: "Company" }), _jsxs("select", { name: "company_id", value: role.company_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.company_id && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.company_id }))] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "nama", children: "Nama Role" }), _jsx(Input, { id: "nama", name: "nama", type: "text", placeholder: "Contoh: Admin, HR, Manager", value: role.nama, onChange: handleChange, className: errors.nama ? "border-red-500" : "" }), errors.nama && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nama }))] }), _jsx("div", { className: "flex justify-end mt-4", children: _jsx("button", { onClick: handleSubmit, disabled: loading, className: `${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium px-6 py-2 rounded-xl`, children: loading ? "Menyimpan..." : "Save" }) })] }) }) })] }));
}
