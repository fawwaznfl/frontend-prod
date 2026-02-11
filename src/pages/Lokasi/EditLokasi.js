import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
export default function EditLokasi() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        company_id: "",
        nama_lokasi: "",
        lat_kantor: "",
        long_kantor: "",
        radius: "",
        status: "active",
        keterangan: "",
    });
    // Fetch companies
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data);
        }
        catch (err) {
            console.error("Error fetching companies:", err);
        }
    };
    // Fetch existing lokasi
    const fetchLokasi = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/lokasis/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.data;
            setForm({
                company_id: data.company_id ?? "",
                nama_lokasi: data.nama_lokasi ?? "",
                lat_kantor: data.lat_kantor ?? "",
                long_kantor: data.long_kantor ?? "",
                radius: String(data.radius ?? ""),
                status: data.status ?? "active",
                keterangan: data.keterangan ?? "",
            });
        }
        catch (err) {
            console.error("Error fetching lokasi:", err);
            Swal.fire("Error", "Data lokasi tidak ditemukan.", "error");
            navigate("/lokasi");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
        fetchLokasi();
    }, []);
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        // pastikan radius selalu string
        setForm({
            ...form,
            [name]: name === "radius" ? String(value) : value
        });
    };
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire("Error", "Browser tidak mendukung GPS", "error");
            return;
        }
        Swal.fire({
            title: "Mengambil lokasi...",
            text: "Pastikan GPS aktif",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setForm((prev) => ({
                ...prev,
                lat_kantor: latitude.toString(),
                long_kantor: longitude.toString(),
            }));
            Swal.fire("Berhasil", "Lokasi berhasil diambil", "success");
        }, (error) => {
            let message = "Gagal mengambil lokasi";
            if (error.code === 1)
                message = "Izin lokasi ditolak";
            if (error.code === 2)
                message = "Lokasi tidak tersedia";
            if (error.code === 3)
                message = "Request timeout";
            Swal.fire("Error", message, "error");
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
        });
    };
    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...form,
                radius: String(form.radius),
            };
            await api.put(`/lokasis/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Lokasi berhasil diperbarui.", "success");
            navigate("/lokasi");
        }
        catch (err) {
            console.error("API Error:", err.response?.data);
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan.", "error");
        }
    };
    if (loading)
        return _jsx("p", { className: "text-center", children: "Loading..." });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Lokasi", description: "Edit lokasi kantor" }), _jsx(PageHeader, { pageTitle: "Edit Lokasi", titleClass: "text-[32px] dark:text-white" }), _jsx(ComponentCard, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Perusahaan" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true, children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Nama Lokasi kantor" }), _jsx("input", { type: "text", name: "nama_lokasi", value: form.nama_lokasi, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Latitude" }), _jsx("input", { type: "text", name: "lat_kantor", value: form.lat_kantor, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Longitude" }), _jsx("input", { type: "text", name: "long_kantor", value: form.long_kantor, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] })] }), _jsx("button", { type: "button", onClick: handleGetLocation, className: "w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg", children: "Ambil Lokasi Otomatis" }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Radius (meter)" }), _jsx("input", { type: "text", name: "radius", value: form.radius, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Status" }), _jsxs("select", { name: "status", value: form.status, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", rows: 3 })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg", children: "Update" })] }) })] }));
}
