import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function VisitOutKunjungan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lokasiKeluar, setLokasiKeluar] = useState("");
    const [form, setForm] = useState({
        keterangan_keluar: "",
        foto_keluar: null,
    });
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLokasiKeluar(`${pos.coords.latitude},${pos.coords.longitude}`);
        }, () => Swal.fire("Error", "GPS tidak aktif", "error"));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.foto_keluar || !lokasiKeluar) {
            Swal.fire("Error", "Foto & lokasi wajib diisi", "error");
            return;
        }
        const formData = new FormData();
        formData.append("foto_keluar", form.foto_keluar);
        formData.append("lokasi_keluar", lokasiKeluar);
        formData.append("keterangan_keluar", form.keterangan_keluar);
        try {
            await api.post(`/kunjungan/${id}?_method=PUT`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Berhasil", "Visit out berhasil", "success");
            navigate("/kunjungan");
        }
        catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Error", "error");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Visit Out", description: "Visit Out Kunjungan" }), _jsx(PageHeader, { pageTitle: "Visit Out" }), _jsx(ComponentCard, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { children: "Keterangan" }), _jsx("textarea", { className: "w-full border rounded px-3 py-2", rows: 3, onChange: (e) => setForm({ ...form, keterangan_keluar: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { children: "Foto Keluar" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setForm({ ...form, foto_keluar: e.target.files?.[0] || null }), className: "w-full border rounded px-3 py-2" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "bg-orange-600 text-white px-6 py-2 rounded-lg", children: "Simpan Visit Out" }) })] }) })] }));
}
