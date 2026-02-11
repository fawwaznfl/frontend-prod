import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// --- IMPORT ---
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
export default function EditKasbon() {
    const navigate = useNavigate();
    const { id } = useParams(); // <-- ambil kasbon_id dari URL
    const [form, setForm] = useState({
        company_id: "",
        pegawai_id: "",
        nominal: "",
        keperluan: "",
        tanggal: "",
        metode_pengiriman: "cash",
        nomor_rekening: "",
    });
    const [pegawais, setPegawais] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        company_id: "",
        pegawai_id: "",
        nominal: "",
        keperluan: "",
        tanggal: "",
        metode_pengiriman: "",
        nomor_rekening: "",
    });
    // =====================================
    // FETCH EXISTING DATA
    // =====================================
    const fetchKasbon = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/kasbon/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.data;
            setForm({
                company_id: data.company_id?.toString() ?? "",
                pegawai_id: data.pegawai_id?.toString() ?? "",
                nominal: data.nominal?.toString() ?? "",
                keperluan: data.keperluan ?? "",
                tanggal: data.tanggal ?? "",
                metode_pengiriman: data.metode_pengiriman ?? "cash",
                nomor_rekening: data.nomor_rekening ?? "",
            });
        }
        catch (err) {
            console.error("Error fetching kasbon:", err);
            Swal.fire("Gagal", "Data kasbon tidak ditemukan!", "error").then(() => {
                navigate("/kasbon");
            });
        }
    };
    // =====================================
    // FETCH COMPANIES & PEGAWAI
    // =====================================
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
        fetchKasbon();
    }, []);
    // =====================================
    // HANDLE CHANGE
    // =====================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "company_id") {
            setForm({ ...form, company_id: value, pegawai_id: "" });
            return;
        }
        if (name === "metode_pengiriman") {
            setForm({
                ...form,
                metode_pengiriman: value,
                nomor_rekening: value === "cash" ? "" : form.nomor_rekening,
            });
            return;
        }
        if (name === "nominal") {
            const clean = value.replace(/[^\d]/g, "");
            setForm({
                ...form,
                nominal: clean,
            });
            return;
        }
        setForm({ ...form, [name]: value });
    };
    // =====================================
    // VALIDATION
    // =====================================
    const validate = () => {
        const newErrors = {
            company_id: "",
            pegawai_id: "",
            nominal: "",
            keperluan: "",
            tanggal: "",
            metode_pengiriman: "",
            nomor_rekening: "",
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
        if (!form.nominal) {
            newErrors.nominal = "Nominal wajib diisi";
            isValid = false;
        }
        if (!form.keperluan) {
            newErrors.keperluan = "Keperluan wajib diisi";
            isValid = false;
        }
        if (!form.tanggal) {
            newErrors.tanggal = "Tanggal wajib diisi";
            isValid = false;
        }
        if (!form.metode_pengiriman) {
            newErrors.metode_pengiriman = "Pilih metode pengiriman";
            isValid = false;
        }
        if (form.metode_pengiriman === "transfer" &&
            !form.nomor_rekening) {
            newErrors.nomor_rekening = "Nomor rekening wajib diisi";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    // =====================================
    // SUBMIT EDIT
    // =====================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await api.put(`/kasbon/${id}`, {
                ...form,
                nominal: Number(form.nominal),
            }, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire("Berhasil!", "Kasbon berhasil diperbarui.", "success").then(() => navigate("/kasbon"));
        }
        catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const filteredPegawai = pegawais.filter((p) => String(p.company_id) === String(form.company_id));
    const formatRupiah = (value) => {
        const num = Number(value || 0);
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
            .format(num)
            .replace("Rp", "Rp.");
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Kasbon Pegawai", description: "Edit kasbon pegawai" }), _jsx(PageHeader, { pageTitle: "Edit Kasbon Pegawai", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/kasbon"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-5 sm:space-y-6 mt-4", children: _jsx(ComponentCard, { title: "Edit Kasbon Pegawai", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.company_id && _jsx("p", { className: "text-red-500", children: errors.company_id })] }), _jsxs("div", { children: [_jsx(Label, { children: "Pegawai" }), _jsxs("select", { name: "pegawai_id", value: form.pegawai_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded", children: [_jsx("option", { value: "", children: "-- Pilih Pegawai --" }), filteredPegawai.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }), errors.pegawai_id && _jsx("p", { className: "text-red-500", children: errors.pegawai_id })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nominal" }), _jsx(Input, { type: "text", name: "nominal", value: formatRupiah(form.nominal), onChange: handleChange, placeholder: "Masukkan nominal kasbon" }), errors.nominal && _jsx("p", { className: "text-red-500", children: errors.nominal })] }), _jsxs("div", { children: [_jsx(Label, { children: "Keperluan" }), _jsx(Input, { name: "keperluan", value: form.keperluan, onChange: handleChange, placeholder: "Masukkan keperluan" }), errors.keperluan && _jsx("p", { className: "text-red-500", children: errors.keperluan })] }), _jsxs("div", { children: [_jsx(Label, { children: "Metode Pengiriman" }), _jsxs("select", { name: "metode_pengiriman", value: form.metode_pengiriman, onChange: handleChange, className: "w-full border px-3 py-2 rounded", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "transfer", children: "Transfer" })] }), errors.metode_pengiriman && (_jsx("p", { className: "text-red-500", children: errors.metode_pengiriman }))] }), form.metode_pengiriman === "transfer" && (_jsxs("div", { children: [_jsx(Label, { children: "Nomor Rekening" }), _jsx(Input, { name: "nomor_rekening", value: form.nomor_rekening, onChange: handleChange, placeholder: "Masukkan nomor rekening" }), errors.nomor_rekening && (_jsx("p", { className: "text-red-500", children: errors.nomor_rekening }))] })), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal" }), _jsx(Input, { type: "date", name: "tanggal", value: form.tanggal, onChange: handleChange }), errors.tanggal && _jsx("p", { className: "text-red-500", children: errors.tanggal })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: `${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-xl`, children: loading ? "Menyimpan..." : "Update" }) })] }) }) })] }));
}
