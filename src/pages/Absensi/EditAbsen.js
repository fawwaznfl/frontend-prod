import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function EditAbsen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        jam_masuk: "",
        jam_pulang: "",
        lokasi_masuk: "",
        lokasi_pulang: "",
        status: "hadir",
        verifikasi: "pending",
        keterangan: "",
    });
    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            const res = await api.get(`/absensi/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const d = res.data.data;
            setForm({
                jam_masuk: d.jam_masuk || "",
                jam_pulang: d.jam_pulang || "",
                lokasi_masuk: d.lokasi_masuk || "",
                lokasi_pulang: d.lokasi_pulang || "",
                status: d.status || "hadir",
                verifikasi: d.verifikasi || "pending",
                keterangan: d.keterangan || "",
            });
        }
        catch (err) {
            Swal.fire("Error", "Gagal load data", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);
    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {};
        Object.keys(form).forEach((key) => {
            let value = form[key];
            // Hanya kirim field jika tidak kosong
            if (value !== "") {
                // Pastikan jam_masuk & jam_pulang sesuai format HH:MM
                if ((key === "jam_masuk" || key === "jam_pulang") && value.length === 8) {
                    // Format "HH:MM:SS" → ambil HH:MM
                    value = value.slice(0, 5);
                }
                payload[key] = value;
            }
        });
        try {
            await api.put(`/absensi/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil", "Absensi berhasil diperbarui", "success");
            navigate("/data-absen");
        }
        catch (err) {
            console.error(err.response?.data || err);
            Swal.fire("Gagal", "Update gagal", "error");
        }
    };
    if (loading)
        return _jsx("p", { children: "Loading..." });
    // ================= UI =================
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Absen", description: "Edit absensi pegawai" }), _jsx(PageHeader, { pageTitle: "Edit Absen", rightContent: _jsx("button", { onClick: () => navigate("/absen"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-5 mt-4", children: _jsx(ComponentCard, { title: "Form Edit Absensi", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "Jam Masuk", name: "jam_masuk", value: form.jam_masuk, onChange: handleChange, type: "time" }), _jsx(Input, { label: "Jam Pulang", name: "jam_pulang", value: form.jam_pulang, onChange: handleChange, type: "time" }), _jsx(Input, { label: "Lokasi Masuk", name: "lokasi_masuk", value: form.lokasi_masuk, onChange: handleChange }), _jsx(Input, { label: "Lokasi Pulang", name: "lokasi_pulang", value: form.lokasi_pulang, onChange: handleChange }), _jsx(Select, { label: "Status", name: "status", value: form.status, onChange: handleChange, options: ["hadir", "sakit", "izin", "cuti", "dinas_luar", "libur", "alpha"] }), _jsx(Select, { label: "Verifikasi", name: "verifikasi", value: form.verifikasi, onChange: handleChange, options: ["pending", "disetujui", "ditolak"] }), _jsxs("div", { children: [_jsx("label", { children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, className: "w-full p-2 border rounded" })] }), _jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl", children: "Simpan Perubahan" })] }) }) })] }));
}
// ================= REUSABLE INPUT =================
function Input({ label, ...props }) {
    return (_jsxs("div", { children: [_jsx("label", { children: label }), _jsx("input", { ...props, className: "w-full p-2 border rounded" })] }));
}
function Select({ label, options, ...props }) {
    return (_jsxs("div", { children: [_jsx("label", { children: label }), _jsx("select", { ...props, className: "w-full p-2 border rounded", children: options.map((o) => (_jsx("option", { value: o, children: o }, o))) })] }));
}
