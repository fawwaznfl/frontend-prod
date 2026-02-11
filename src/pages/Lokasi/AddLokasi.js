import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function AddLokasi() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const dashboardType = localStorage.getItem("dashboard_type");
    const userCompanyId = localStorage.getItem("user_company_id");
    const [form, setForm] = useState({
        company_id: "",
        nama_lokasi: "",
        lat_kantor: "",
        long_kantor: "",
        radius: "",
        status: "active",
        keterangan: "",
    });
    // Fetch Company
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
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
    }, []);
    useEffect(() => {
        if (dashboardType === "admin" && userCompanyId) {
            setForm((prev) => ({ ...prev, company_id: userCompanyId }));
        }
    }, [dashboardType, userCompanyId]);
    // Handle form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.post("/lokasis", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Lokasi berhasil ditambahkan.", "success");
            navigate("/lokasi");
        }
        catch (err) {
            console.error("API Error:", err.response?.data);
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan.", "error");
        }
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
                message = "Request lokasi timeout";
            Swal.fire("Error", message, "error");
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Lokasi", description: "Tambah lokasi kantor" }), _jsx(PageHeader, { pageTitle: "Tambah Lokasi", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/lokasi"), className: "bg-gray-600 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-xl", children: "Kembali" }) }), _jsx(ComponentCard, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [dashboardType === "superadmin" && (_jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Perusahaan" }), _jsxs("select", { name: "company_id", value: form.company_id, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true, children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Nama Lokasi" }), _jsx("input", { type: "text", name: "nama_lokasi", value: form.nama_lokasi, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { className: "text-gray-700 dark:text-gray-200 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Latitude" }), _jsx("input", { type: "text", name: "lat_kantor", value: form.lat_kantor, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "Longitude" }), _jsx("input", { type: "text", name: "long_kantor", value: form.long_kantor, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsx("button", { type: "button", onClick: handleGetLocation, className: "w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg", children: "Ambil Lokasi Otomatis" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Radius (meter)" }), _jsx("input", { type: "number", name: "radius", value: form.radius, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Status" }), _jsxs("select", { name: "status", value: form.status, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, className: "w-full border p-2 rounded-lg dark:bg-gray-700 dark:text-white", rows: 3 })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg", children: "Simpan" })] }) })] }));
}
