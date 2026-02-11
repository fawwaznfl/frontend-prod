import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function EditKontrak() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pegawaiList, setPegawaiList] = useState([]);
    const [form, setForm] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [file, setFile] = useState(null);
    const jenisKontrakOptions = ["PKWT", "PKWTT", "THL"];
    // Custom button untuk DatePicker
    const CustomInput = ({ value, onClick }) => (_jsx("button", { onClick: onClick, className: "border px-3 py-2 rounded-md w-40 bg-white text-left hover:border-blue-500", children: value || "Pilih tanggal" }));
    useEffect(() => {
        fetchKontrak();
        fetchPegawai();
    }, []);
    // Fetch data kontrak berdasarkan id
    const fetchKontrak = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/kontrak/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.data;
            setForm(data);
            setStartDate(new Date(data.tanggal_mulai));
            setEndDate(new Date(data.tanggal_selesai));
        }
        catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal mengambil data kontrak", "error");
        }
    };
    // Fetch semua pegawai untuk dropdown
    const fetchPegawai = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/pegawais", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = res.data.map((p) => ({
                id: p.id,
                name: p.name || "Unnamed",
            }));
            setPegawaiList(mapped);
        }
        catch (error) {
            console.error(error);
            setPegawaiList([]);
        }
    };
    // Handle input change
    const handleChange = (e) => {
        if (!form)
            return;
        const value = e.target.name === "pegawai_id" ? Number(e.target.value) : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };
    // Submit form
    const handleSubmit = async () => {
        if (!form)
            return;
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("pegawai_id", String(form.pegawai_id));
            formData.append("jenis_kontrak", form.jenis_kontrak); // harus sesuai backend
            formData.append("tanggal_mulai", startDate?.toISOString().split("T")[0] || "");
            formData.append("tanggal_selesai", endDate?.toISOString().split("T")[0] || "");
            formData.append("keterangan", form.keterangan ?? "");
            if (file)
                formData.append("file", file);
            // Laravel multipart PUT workaround
            formData.append("_method", "PUT");
            await api.post(`/kontrak/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Kontrak berhasil diperbarui.", "success");
            navigate("/kontrak");
        }
        catch (error) {
            console.error(error);
            Swal.fire("Gagal", error.response?.data?.message || "Terjadi kesalahan saat update kontrak.", "error");
        }
    };
    if (!form)
        return _jsx("p", { className: "text-center mt-10", children: "Loading..." });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Kontrak", description: "Form untuk mengedit data kontrak" }), _jsx(PageHeader, { pageTitle: "Edit Kontrak", titleClass: "text-[32px] dark:text-white" }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsxs(ComponentCard, { title: "Form Edit Kontrak", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nama Pegawai" }), _jsxs("select", { name: "pegawai_id", value: form.pegawai_id, onChange: handleChange, className: "border px-3 py-2 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none", children: [_jsx("option", { value: "", children: "-- Pilih Pegawai --" }), pegawaiList.map((p) => (_jsx("option", { value: p.id, className: "text-gray-900 dark:text-white", children: p.name }, p.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Jenis Kontrak" }), _jsxs("select", { name: "jenis_kontrak", value: form.jenis_kontrak, onChange: handleChange, className: "border px-3 py-2 rounded-md w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700", children: [_jsx("option", { value: "", children: "-- Pilih Jenis Kontrak --" }), jenisKontrakOptions.map((option) => (_jsx("option", { value: option, children: option }, option)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Selesai" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", showMonthDropdown: true, showYearDropdown: true, dropdownMode: "select", customInput: _jsx(CustomInput, {}) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan || "", onChange: handleChange, className: "border px-3 py-2 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "File Kontrak" }), form.file_path && (_jsx("div", { className: "mb-2", children: _jsx("a", { href: form.file_path, target: "_blank", className: "text-blue-600 underline", children: "\uD83D\uDCC4 Lihat File Lama" }) })), _jsx("input", { type: "file", onChange: (e) => setFile(e.target.files?.[0] || null), className: "border px-3 py-2 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white" })] })] }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { onClick: () => navigate("/kontrak"), className: "bg-gray-500 text-white px-5 py-2 rounded-lg", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg", children: "Simpan Perubahan" })] })] }) })] }));
}
