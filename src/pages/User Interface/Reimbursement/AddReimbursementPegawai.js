import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import BottomNav from "../../../components/common/BottomNav";
import { useNavigate } from "react-router-dom";
export default function AddReimbursementPegawai() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([
        { id: Date.now(), name: "", fee: "" }
    ]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [kategori, setKategori] = useState([]);
    const [form, setForm] = useState({
        company_id: user.company_id ? String(user.company_id) : "",
        pegawai_id: String(user.id),
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
    const [errors, setErrors] = useState({
        kategori_reimbursement_id: "",
    });
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "metode_reim") {
            setForm((s) => ({
                ...s,
                metode_reim: value,
                no_rekening: value === "transfer" ? s.no_rekening : "", // reset kalau bukan transfer
            }));
            return;
        }
        // kategori selected -> isi otomatis
        if (name === "kategori_reimbursement_id") {
            const found = kategori.find((k) => String(k.id) === value);
            if (found) {
                const terpakaiNum = Number(form.terpakai || 0);
                const totalCalc = Math.max(found.jumlah - terpakaiNum, 0);
                setForm((s) => ({
                    ...s,
                    kategori_reimbursement_id: value,
                    jumlah: String(found.jumlah),
                    terpakai: s.terpakai || "0",
                    total: String(totalCalc),
                    sisa: String(totalCalc),
                }));
            }
            else {
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
        // terpakai direfresh otomatis
        if (name === "terpakai") {
            const clean = value.replace(/[^\d]/g, "");
            const terpakaiNum = Number(clean || 0);
            const jumlahNum = Number(form.jumlah || 0);
            const final = jumlahNum - terpakaiNum >= 0
                ? jumlahNum - terpakaiNum
                : 0;
            setForm((s) => ({
                ...s,
                terpakai: clean, // simpan angka murni
                total: String(final),
                sisa: String(final),
            }));
            return;
        }
        setForm((s) => ({ ...s, [name]: value }));
    };
    const addRow = () => {
        setRows([...rows, { id: Date.now(), name: "", fee: "" }]);
    };
    const removeRow = (id) => {
        setRows(rows.filter((r) => r.id !== id));
    };
    const fetchKategori = async () => {
        try {
            const res = await api.get("/kategori-reimbursement");
            const data = Array.isArray(res.data.data) ? res.data.data : res.data;
            // FILTER: berdasarkan company user
            const filtered = data.filter((k) => String(k.company_id) === String(user.company_id));
            setKategori(filtered);
        }
        catch (err) {
            console.error("fetchKategori", err);
        }
    };
    useEffect(() => {
        fetchKategori();
    }, []);
    const handleSubmit = async () => {
        if (!form.kategori_reimbursement_id) {
            setErrors({ kategori_reimbursement_id: "Kategori wajib dipilih" });
            return;
        }
        if (!form.tanggal) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal wajib diisi",
            });
            return;
        }
        if (form.metode_reim === "transfer" && !form.no_rekening) {
            Swal.fire({
                icon: "warning",
                title: "Nomor rekening wajib diisi",
            });
            return;
        }
        const fd = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val !== null) {
                if (["jumlah", "terpakai", "total", "sisa"].includes(key)) {
                    fd.append(key, String(Number(val))); // convert ke integer
                }
                else {
                    fd.append(key, val);
                }
            }
        });
        try {
            const res = await api.post("/reimbursement", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Reimbursement berhasil diajukan!"
            });
        }
        catch (err) {
            console.log("ERR RESPONSE:", err.response?.data);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan",
            }).then(() => {
                navigate("/reimbursement-pegawai");
            });
        }
    };
    const formatRupiah = (value) => {
        const num = Number(value || 0);
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
            .format(num)
            .replace("Rp", "Rp. ");
    };
    /// User Interface
    return (_jsxs("div", { className: "w-full min-h-screen bg-[#F5F6FA] pb-28", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#4A4CFF] to-[#7A52FF] p-5 text-white text-center relative rounded-b-3xl", children: [_jsx(ChevronLeft, { className: "absolute left-5 top-5 cursor-pointer", size: 26, onClick: () => navigate("/reimbursement-pegawai") }), _jsx("p", { className: "text-lg font-semibold", children: "Reimbursement" })] }), _jsxs("div", { className: "mx-4 mt-5 bg-white shadow-md rounded-3xl p-5 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100", value: user?.name || "Tidak ada nama" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Kategori" }), _jsxs("select", { name: "kategori_reimbursement_id", value: form.kategori_reimbursement_id, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "", children: "Pilih Kategori" }), kategori.map((k) => (_jsxs("option", { value: String(k.id), children: [k.nama, " \u2014 ", formatRupiah(k.jumlah)] }, k.id)))] }), errors.kategori_reimbursement_id && (_jsx("p", { className: "text-red-500", children: errors.kategori_reimbursement_id }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Tanggal" }), _jsx("input", { type: "date", name: "tanggal", value: form.tanggal, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Event" }), _jsx("input", { type: "text", name: "event", value: form.event, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", placeholder: "Isi event" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Jumlah dari kategori" }), _jsx("input", { type: "text", value: formatRupiah(form.jumlah), readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Terpakai" }), _jsx("input", { name: "terpakai", type: "text", value: formatRupiah(form.terpakai), onChange: handleChange, className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Total" }), _jsx("input", { name: "total", type: "text", value: formatRupiah(form.total), readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { className: "space-y-1 mt-6", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Sisa" }), _jsx("input", { name: "sisa", type: "text", value: formatRupiah(form.sisa), readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Metode Reimbursement" }), _jsxs("select", { name: "metode_reim", value: form.metode_reim, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "transfer", children: "Transfer" })] })] }), form.metode_reim === "transfer" && (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nomor Rekening" }), _jsx("input", { type: "text", name: "no_rekening", value: form.no_rekening, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", placeholder: "Contoh: 1234567890 (BCA)" })] })), _jsxs("div", { className: "space-y-1 mt-4", children: [_jsx("label", { className: "text-sm text-gray-600", children: "Upload File" }), _jsxs("label", { className: "flex flex-col items-center justify-center w-full h-25 border-2 border-dashed \n              border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition", children: [_jsxs("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: [_jsx("svg", { "aria-hidden": "true", className: "w-10 h-10 text-gray-400 mb-2", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7 16a4 4 0 01-.88-7.903A5 5 0 \n                    1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium text-blue-600", children: "Click to upload" }), " atau drag file"] }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "PDF, JPG, PNG (max 5MB)" })] }), _jsx("input", { type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setForm((s) => ({ ...s, file }));
                                            }
                                        } })] }), form.file && (_jsxs("div", { className: "mt-3 flex items-center justify-between bg-gray-100 p-3 rounded-xl", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: form.file.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [(form.file.size / 1024 / 1024).toFixed(2), " MB"] })] }), _jsx("button", { type: "button", onClick: () => setForm((s) => ({ ...s, file: null })), className: "text-red-500 font-semibold text-sm", children: "Hapus" })] }))] }), _jsx("button", { onClick: handleSubmit, className: "w-full bg-blue-600 text-white py-3 rounded-xl mt-5 text-lg font-medium", children: "Submit" })] }), _jsx(BottomNav, {})] }));
}
