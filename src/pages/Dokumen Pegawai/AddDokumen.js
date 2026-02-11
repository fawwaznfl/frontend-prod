import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
export default function AddDokumen() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    useEffect(() => {
        if (user.dashboard_type === "admin") {
            setForm((prev) => ({
                ...prev,
                company_id: String(user.company_id),
            }));
        }
        if (user.dashboard_type === "pegawai") {
            setForm((prev) => ({
                ...prev,
                company_id: String(user.company_id),
                pegawai_id: String(user.id),
            }));
        }
    }, []);
    const [form, setForm] = useState({
        company_id: "",
        pegawai_id: "",
        nama_dokumen: "",
        keterangan: "",
        file: null,
    });
    const [pegawais, setPegawais] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        company_id: "",
        pegawai_id: "",
        nama_dokumen: "",
        file: "",
    });
    // ===============================
    // FETCH COMPANIES
    // ===============================
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(Array.isArray(res.data.data) ? res.data.data : []);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
        }
    };
    // ===============================
    // FETCH PEGAWAI
    // ===============================
    const fetchPegawais = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/pegawais", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = res.data.map((p) => ({
                id: p.id,
                name: p.name,
                company_id: p.company_id,
            }));
            setPegawais(mapped);
        }
        catch (err) {
            console.error("Error fetching pegawai:", err);
        }
    };
    useEffect(() => {
        fetchCompanies();
        fetchPegawais();
    }, []);
    // ===============================
    // HANDLE CHANGE
    // ===============================
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file" && files) {
            setForm({ ...form, file: files[0] });
            return;
        }
        // reset pegawai jika company berubah
        if (name === "company_id") {
            setForm({ ...form, company_id: value, pegawai_id: "" });
            return;
        }
        setForm({ ...form, [name]: value });
    };
    const handleRemoveFile = () => setForm({ ...form, file: null });
    // ===============================
    // VALIDATION
    // ===============================
    const validate = () => {
        const newErrors = {
            company_id: "",
            pegawai_id: "",
            nama_dokumen: "",
            file: "",
        };
        let isValid = true;
        if (!form.company_id) {
            newErrors.company_id = "Pilih company";
            isValid = false;
        }
        if (!form.pegawai_id) {
            newErrors.pegawai_id = "Pilih pegawai";
            isValid = false;
        }
        if (!form.nama_dokumen) {
            newErrors.nama_dokumen = "Nama dokumen wajib diisi";
            isValid = false;
        }
        if (!form.file) {
            newErrors.file = "File wajib diunggah";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    // ===============================
    // SUBMIT
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("company_id", form.company_id);
            formData.append("pegawai_id", form.pegawai_id);
            formData.append("nama_dokumen", form.nama_dokumen);
            formData.append("keterangan", form.keterangan);
            if (form.file)
                formData.append("file", form.file);
            await api.post("/dokumen-pegawai", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Berhasil!", "Dokumen berhasil ditambahkan.", "success")
                .then(() => navigate("/dokumen-pegawai"));
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const filteredPegawai = pegawais.filter((p) => {
        if (user.dashboard_type === "superadmin") {
            return String(p.company_id) === String(form.company_id);
        }
        if (user.dashboard_type === "admin") {
            return String(p.company_id) === String(user.company_id);
        }
        if (user.dashboard_type === "pegawai") {
            return p.id === user.id;
        }
        return false;
    });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Dokumen Pegawai", description: "Add dokumen pegawai" }), _jsx(PageHeader, { pageTitle: "Tambah Dokumen Pegawai", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/dokumen-pegawai"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { title: "Form Dokumen Pegawai", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [user.dashboard_type === "superadmin" && (_jsxs("div", { children: [_jsx(Label, { children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.company_id && (_jsx("p", { className: "text-red-500", children: errors.company_id }))] })), _jsxs("div", { children: [_jsx(Label, { children: "Pegawai" }), _jsxs("select", { name: "pegawai_id", value: form.pegawai_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded", children: [_jsx("option", { value: "", children: "-- Pilih Pegawai --" }), filteredPegawai.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }), errors.pegawai_id && _jsx("p", { className: "text-red-500", children: errors.pegawai_id })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nama Dokumen" }), _jsx(Input, { name: "nama_dokumen", value: form.nama_dokumen, onChange: handleChange, placeholder: "Masukkan nama dokumen" }), errors.nama_dokumen && _jsx("p", { className: "text-red-500", children: errors.nama_dokumen })] }), _jsxs("div", { children: [_jsx(Label, { children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, className: "border px-3 py-2 rounded w-full", placeholder: "Opsional" })] }), _jsxs("div", { children: [_jsx(Label, { children: "File Dokumen" }), _jsx("div", { className: "border-2 border-dashed rounded p-4 relative flex flex-col items-center justify-center cursor-pointer", children: !form.file ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-gray-500", children: "Klik untuk pilih file" }), _jsx("input", { type: "file", name: "file", onChange: handleChange, className: "absolute inset-0 opacity-0 cursor-pointer" })] })) : (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("span", { children: form.file.name }), _jsx("button", { type: "button", className: "text-red-500", onClick: handleRemoveFile, children: "\u2716" })] })) }), errors.file && _jsx("p", { className: "text-red-500", children: errors.file })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: `${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-xl`, children: loading ? "Menyimpan..." : "Save" }) })] }) }) })] }));
}
