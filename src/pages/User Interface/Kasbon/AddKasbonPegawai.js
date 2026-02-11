import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
import { useNavigate } from "react-router-dom";
export default function AddKasbonPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [limitKasbon, setLimitKasbon] = useState(null);
    const [form, setForm] = useState({
        pegawai_id: user.id ? String(user.id) : "",
        company_id: user.company_id || "",
        tanggal: "",
        nominal: "",
        keperluan: "",
        metode_pengiriman: "cash",
        nomor_rekening: "",
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async () => {
        // VALIDASI
        if (!form.tanggal || !form.nominal || !form.keperluan) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi Data",
                text: "Tanggal, nominal, dan keperluan wajib diisi.",
            });
            return;
        }
        if (!form.tanggal ||
            !form.nominal ||
            !form.keperluan ||
            (form.metode_pengiriman === "transfer" && !form.nomor_rekening)) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi Data",
                text: form.metode_pengiriman === "transfer" && !form.nomor_rekening
                    ? "Nomor rekening wajib diisi untuk metode transfer."
                    : "Tanggal, nominal, dan keperluan wajib diisi.",
            });
            return;
        }
        try {
            // SEND API
            const res = await api.post("/kasbon", {
                pegawai_id: form.pegawai_id,
                company_id: form.company_id,
                tanggal: form.tanggal,
                nominal: Number(form.nominal.replace(/\D/g, "")),
                keperluan: form.keperluan,
                metode_pengiriman: form.metode_pengiriman,
                nomor_rekening: form.metode_pengiriman === "transfer"
                    ? form.nomor_rekening
                    : null,
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Kasbon berhasil ditambahkan!",
            }).then(() => {
                navigate("/kasbon-pegawai"); // redirect
            });
        }
        catch (err) {
            console.error("ERR:", err.response?.data);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan.",
            });
        }
    };
    const formatRupiah = (value) => {
        const number = value.replace(/\D/g, "");
        return number
            ? "Rp " + Number(number).toLocaleString("id-ID")
            : "";
    };
    const fetchSisaKasbon = async () => {
        try {
            const res = await api.get("/kasbon/sisa");
            if (res.data) {
                setLimitKasbon({
                    limit: res.data.limit,
                    terpakai: res.data.terpakai,
                    sisa: res.data.sisa,
                });
            }
        }
        catch (err) {
            console.log("Gagal ambil sisa kasbon", err);
            setLimitKasbon(null);
        }
    };
    useEffect(() => {
        fetchSisaKasbon();
    }, []);
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsxs("div", { className: "relative bg-gradient-to-r from-indigo-600 to-indigo-400 text-white py-6 text-center rounded-b-3xl", children: [_jsx("button", { className: "absolute left-4 top-6", onClick: () => navigate("/kasbon-pegawai"), children: _jsx(ChevronLeft, { size: 28 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Tambah Data Kasbon" })] }), _jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "bg-white shadow-lg rounded-2xl p-6", children: [_jsx("label", { className: "text-gray-600 text-sm", children: "Tanggal" }), _jsx("input", { type: "date", name: "tanggal", value: form.tanggal, onChange: handleChange, className: "w-full mt-1 mb-5 p-3 border rounded-xl" }), _jsx("label", { className: "text-gray-600 text-sm", children: "Nominal" }), _jsx("input", { type: "text", name: "nominal", value: form.nominal, onChange: (e) => setForm({
                                    ...form,
                                    nominal: formatRupiah(e.target.value),
                                }), className: "w-full mt-1 mb-5 p-3 border rounded-xl", placeholder: "Masukan Nominal" }), limitKasbon && (_jsxs("div", { className: "mb-4 p-3 rounded-xl bg-blue-50 text-sm text-blue-700", children: ["Saldo kamu Sisa:", " ", _jsxs("b", { className: limitKasbon.sisa <= 0 ? "text-red-600" : "text-green-700", children: [limitKasbon.sisa < 0 ? "-" : "", "Rp ", Math.abs(limitKasbon.sisa).toLocaleString("id-ID")] })] })), _jsx("label", { className: "text-gray-600 text-sm", children: "Metode Pengiriman" }), _jsxs("select", { name: "metode_pengiriman", value: form.metode_pengiriman, onChange: handleChange, className: "w-full mt-1 mb-5 p-3 border rounded-xl bg-white", children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "transfer", children: "Transfer" })] }), form.metode_pengiriman === "transfer" && (_jsxs(_Fragment, { children: [_jsx("label", { className: "text-gray-600 text-sm", children: "Nomor Rekening" }), _jsx("input", { type: "text", name: "nomor_rekening", value: form.nomor_rekening, onChange: handleChange, className: "w-full mt-1 mb-5 p-3 border rounded-xl", placeholder: "Masukkan nomor rekening" })] })), _jsx("label", { className: "text-gray-600 text-sm", children: "Keperluan" }), _jsx("textarea", { name: "keperluan", rows: 3, value: form.keperluan, onChange: handleChange, className: "w-full mt-1 mb-5 p-3 border rounded-xl", placeholder: "Masukkan keperluan" })] }), _jsx("button", { onClick: handleSubmit, className: "w-full mt-6 bg-blue-600 text-white py-3 rounded-xl text-lg font-medium shadow-md hover:bg-blue-700", children: "Submit" })] }), _jsx(BottomNav, {})] }));
}
