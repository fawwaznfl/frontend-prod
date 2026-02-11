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
export default function AddReimbursement() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dashboardType = user.dashboard_type;
    const userCompanyId = user.company_id;
    const [form, setForm] = useState({
        company_id: dashboardType === "admin" ? String(userCompanyId) : "",
        pegawai_id: "",
        kategori_reimbursement_id: "",
        tanggal: "",
        event: "",
        metode_reim: "cash",
        no_rekening: "",
        jumlah: "",
        terpakai: "",
        total: "",
        sisa: "",
        status: "pending",
        file: null,
    });
    const [pegawais, setPegawais] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const formatRupiah = (value) => {
        if (!value)
            return "Rp0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value));
    };
    const [errors, setErrors] = useState({
        company_id: "",
        pegawai_id: "",
        kategori_reimbursement_id: "",
        tanggal: "",
        event: "",
        file: "",
    });
    // ============================
    // FETCH DATA
    // ============================
    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies");
            setCompanies(res.data.data ?? []);
        }
        catch (err) {
            console.error("fetchCompanies", err);
            setCompanies([]);
        }
    };
    const fetchPegawais = async () => {
        try {
            const res = await api.get("/pegawais");
            const payload = Array.isArray(res.data) ? res.data : res.data.data ?? [];
            const mapped = payload.map((p) => ({
                id: p.id,
                name: p.name ?? "-",
                company_id: p.company_id ?? null,
            }));
            if (dashboardType === "superadmin") {
                setPegawais(mapped);
            }
            else {
                setPegawais(mapped.filter((p) => String(p.company_id) === String(userCompanyId)));
            }
        }
        catch (err) {
            console.error("fetchPegawais", err);
            setPegawais([]);
        }
    };
    const fetchKategori = async () => {
        try {
            // Using the confirmed correct endpoint:
            const res = await api.get("/kategori-reimbursement");
            const data = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
            setKategori(data);
        }
        catch (err) {
            console.error("fetchKategori", err);
            setKategori([]);
        }
    };
    useEffect(() => {
        setFetching(true);
        Promise.all([fetchCompanies(), fetchPegawais(), fetchKategori()]).finally(() => setFetching(false));
    }, []);
    // FILTER PEGAWAI BERDASARKAN COMPANY YANG DIPILIH
    const filteredPegawai = dashboardType === "admin"
        ? pegawais
        : pegawais.filter((p) => String(p.company_id) === String(form.company_id));
    // ============================
    // HANDLE INPUT
    // ============================
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const files = e.target.files;
        if (name === "metode_reim") {
            setForm((s) => ({
                ...s,
                metode_reim: value,
                no_rekening: value === "transfer" ? s.no_rekening : "", // reset kalau bukan transfer
            }));
            return;
        }
        // FILE
        if (name === "file") {
            if (files && files[0]) {
                setForm((s) => ({ ...s, file: files[0] }));
            }
            return;
        }
        // RESET pegawai saat company berubah
        if (name === "company_id") {
            setForm((s) => ({ ...s, company_id: value, pegawai_id: "" }));
            return;
        }
        // KATEGORI dipilih -> isi jumlah/total/sisa otomatis
        if (name === "kategori_reimbursement_id") {
            const found = kategori.find((k) => String(k.id) === value);
            if (found) {
                const terpakaiNum = Number(form.terpakai || 0);
                const totalCalc = Math.max(found.jumlah - terpakaiNum, 0);
                setForm((s) => ({
                    ...s,
                    kategori_reimbursement_id: value,
                    jumlah: String(found.jumlah),
                    // keep terpakai if exists else default to "0"
                    terpakai: s.terpakai || "0",
                    total: String(totalCalc),
                    sisa: String(totalCalc),
                }));
            }
            else {
                // clear if no found
                setForm((s) => ({
                    ...s,
                    kategori_reimbursement_id: value,
                    jumlah: "",
                    total: "",
                    sisa: "",
                }));
            }
            return;
        }
        // terpakai -> recalc total & sisa
        if (name === "terpakai") {
            const terpakaiNum = Number(value || 0);
            const jumlahNum = Number(form.jumlah || 0);
            const totalNum = jumlahNum - terpakaiNum;
            const final = totalNum >= 0 ? totalNum : 0;
            setForm((s) => ({
                ...s,
                terpakai: String(terpakaiNum),
                total: String(final),
                sisa: String(final),
            }));
            return;
        }
        // default set
        setForm((s) => ({ ...s, [name]: value }));
    };
    const removeFile = () => setForm((s) => ({ ...s, file: null }));
    // ============================
    // VALIDATION
    // ============================
    const validate = () => {
        const newErr = {
            company_id: "",
            pegawai_id: "",
            kategori_reimbursement_id: "",
            tanggal: "",
            event: "",
            file: "",
        };
        let ok = true;
        if (!form.company_id) {
            newErr.company_id = "Pilih company";
            ok = false;
        }
        if (!form.pegawai_id) {
            newErr.pegawai_id = "Pilih pegawai";
            ok = false;
        }
        if (!form.kategori_reimbursement_id) {
            newErr.kategori_reimbursement_id = "Pilih kategori";
            ok = false;
        }
        if (!form.tanggal) {
            newErr.tanggal = "Tanggal wajib diisi";
            ok = false;
        }
        if (!form.event.trim()) {
            newErr.event = "Event wajib diisi";
            ok = false;
        }
        if (!form.file) {
            newErr.file = "File wajib diupload";
            ok = false;
        }
        if (form.metode_reim === "transfer" && !form.no_rekening.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nomor rekening wajib diisi",
            });
            ok = false;
        }
        setErrors(newErr);
        return ok;
    };
    // ============================
    // SUBMIT
    // ============================
    const submit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("pegawai_id", form.pegawai_id);
            fd.append("kategori_reimbursement_id", form.kategori_reimbursement_id);
            fd.append("tanggal", form.tanggal);
            // 🚨 REQUIRED
            fd.append("event", form.event);
            fd.append("metode_reim", form.metode_reim);
            // 🚨 REQUIRED_IF transfer
            if (form.metode_reim === "transfer") {
                fd.append("no_rekening", form.no_rekening);
            }
            // optional tapi aman
            fd.append("jumlah", String(Number(form.jumlah || 0)));
            fd.append("terpakai", String(Number(form.terpakai || 0)));
            if (form.file) {
                fd.append("file", form.file);
            }
            await api.post("/reimbursement", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Berhasil", "Reimbursement berhasil ditambahkan", "success")
                .then(() => navigate("/reimbursement"));
        }
        catch (err) {
            console.error(err?.response?.data);
            Swal.fire("Gagal", JSON.stringify(err?.response?.data?.errors || err?.response?.data), "error");
        }
        finally {
            setLoading(false);
        }
    };
    // ============================
    // User Interface
    // ============================
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Add-Reimbursement", description: "Add Reimbursement" }), _jsx(PageHeader, { pageTitle: "Tambah Reimbursement", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/reimbursement"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "mt-4", children: _jsx(ComponentCard, { title: "Form Reimbursement", children: fetching ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("form", { onSubmit: submit, className: "space-y-4", children: [dashboardType === "superadmin" && (_jsxs("div", { children: [_jsx(Label, { children: "Company" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: String(c.id), children: c.name }, c.id)))] }), errors.company_id && _jsx("p", { className: "text-red-500", children: errors.company_id })] })), _jsxs("div", { children: [_jsx(Label, { children: "Pegawai" }), _jsxs("select", { name: "pegawai_id", value: form.pegawai_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white", disabled: dashboardType === "superadmin" && !form.company_id, children: [_jsx("option", { value: "", children: dashboardType === "admin"
                                                    ? "-- Pilih Pegawai --"
                                                    : form.company_id
                                                        ? "-- Pilih Pegawai --"
                                                        : "Pilih company dulu" }), filteredPegawai.map((p) => (_jsx("option", { value: String(p.id), children: p.name }, p.id)))] }), errors.pegawai_id && _jsx("p", { className: "text-red-500", children: errors.pegawai_id })] }), _jsxs("div", { children: [_jsx(Label, { children: "Kategori Reimbursement" }), _jsxs("select", { name: "kategori_reimbursement_id", value: form.kategori_reimbursement_id, onChange: handleChange, className: "w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Kategori --" }), kategori.map((k) => (_jsxs("option", { value: String(k.id), children: [k.nama, " \u2014 ", Number(k.jumlah).toLocaleString()] }, k.id)))] }), errors.kategori_reimbursement_id && (_jsx("p", { className: "text-red-500", children: errors.kategori_reimbursement_id }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal" }), _jsx(Input, { type: "date", name: "tanggal", value: form.tanggal, onChange: handleChange, className: "dark:bg-gray-800 dark:text-white" }), errors.tanggal && _jsx("p", { className: "text-red-500", children: errors.tanggal })] }), _jsxs("div", { children: [_jsx(Label, { children: "Event" }), _jsx(Input, { name: "event", value: form.event, onChange: handleChange, placeholder: "Nama event", className: "dark:bg-gray-800 dark:text-white" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Jumlah (dari kategori)" }), _jsx(Input, { name: "jumlah", value: form.jumlah ? formatRupiah(form.jumlah) : "", disabled: true, className: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Terpakai" }), _jsx(Input, { type: "number", name: "terpakai", value: form.terpakai, onChange: handleChange, className: "dark:bg-gray-800 dark:text-white" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Total" }), _jsx(Input, { name: "total", value: form.total ? formatRupiah(form.total) : "", disabled: true, className: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Metode Reimbursement" }), _jsxs("select", { name: "metode_reim", value: form.metode_reim, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "transfer", children: "Transfer" })] })] }), form.metode_reim === "transfer" && (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nomor Rekening" }), _jsx("input", { type: "text", name: "no_rekening", value: form.no_rekening, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", placeholder: "Contoh: 1234567890 (BCA)" })] })), _jsxs("div", { children: [_jsx(Label, { children: "Status" }), _jsxs("select", { name: "status", value: form.status, onChange: handleChange, className: "w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white", children: [_jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "File Reimbursement" }), _jsx("div", { className: "border-2 border-dashed p-4 rounded relative cursor-pointer", children: !form.file ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-gray-500", children: "Klik untuk pilih file" }), _jsx("input", { type: "file", name: "file", onChange: handleChange, accept: ".jpg,.jpeg,.png,.pdf", className: "absolute inset-0 opacity-0 cursor-pointer" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: form.file.name }), _jsx("button", { type: "button", onClick: removeFile, className: "text-red-500 font-bold", children: "\u2716" })] })) }), errors.file && _jsx("p", { className: "text-red-500", children: errors.file })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: `${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-xl`, children: loading ? "Menyimpan..." : "Save" }) })] })) }) })] }));
}
