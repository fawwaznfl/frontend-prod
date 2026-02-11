import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
export default function AddShift() {
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [jamMasuk, setJamMasuk] = useState(null);
    const [jamPulang, setJamPulang] = useState(null);
    const [companyId, setCompanyId] = useState("");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJamMasuk, setShowJamMasuk] = useState(false);
    const [showJamPulang, setShowJamPulang] = useState(false);
    const [viewMasuk, setViewMasuk] = useState("hours");
    const [viewPulang, setViewPulang] = useState("hours");
    // Ambil role dan company user
    const dashboardType = localStorage.getItem("dashboard_type");
    const userCompanyId = localStorage.getItem("company_id");
    // Fetch companies hanya jika superadmin
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
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
        else {
            // Admin → otomatis set companyId user
            const storedCompanyId = localStorage.getItem("company_id");
            console.log("Dashboard Type:", dashboardType);
            console.log("Stored Company ID:", storedCompanyId);
            setCompanyId(storedCompanyId || "");
            setLoading(false);
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validasi umum
        if (!nama || !jamMasuk || !jamPulang) {
            Swal.fire("Gagal", "Semua field wajib diisi!", "error");
            return;
        }
        // Validasi company hanya untuk superadmin
        if (dashboardType === "superadmin" && !companyId) {
            Swal.fire("Gagal", "Company wajib dipilih!", "error");
            return;
        }
        // DEBUG: Cek payload sebelum kirim
        console.log("Payload yang akan dikirim:", {
            nama,
            jam_masuk: jamMasuk,
            jam_pulang: jamPulang,
            company_id: companyId,
        });
        try {
            const token = localStorage.getItem("token");
            await api.post("/shifts", {
                nama,
                jam_masuk: jamMasuk.format("HH:mm"),
                jam_pulang: jamPulang.format("HH:mm"),
                company_id: companyId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil", "Shift berhasil ditambahkan.", "success");
            navigate("/shift");
        }
        catch (err) {
            console.error("API Error:", err.response?.data);
            Swal.fire("Gagal", "Terjadi kesalahan saat menambah shift.", "error");
        }
    };
    // USER INTERFACE
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Shift", description: "Tambah Shift Baru" }), _jsx(PageHeader, { pageTitle: "Tambah Shift", titleClass: "text-[32px] dark:text-white" }), _jsx("div", { className: "space-y-5 sm:space-y-6", children: _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 p-6", children: loading ? (_jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Company" }), _jsxs("select", { value: companyId, onChange: (e) => setCompanyId(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium mb-1 dark:text-white", children: "Nama Shift" }), _jsx("input", { type: "text", placeholder: "Masukkan nama shift", value: nama, onChange: (e) => setNama(e.target.value), className: "border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-col gap-2 relative", children: [_jsx("label", { className: "text-sm font-medium dark:text-white", children: "Jam Masuk" }), _jsx("input", { type: "text", readOnly: true, placeholder: "Pilih jam masuk", value: jamMasuk ? jamMasuk.format("HH:mm") : "", onClick: () => setShowJamMasuk(true), className: "border px-3 py-2 rounded-xl cursor-pointer\n                          dark:bg-gray-700 dark:text-white" }), showJamMasuk && (_jsx("div", { className: "absolute z-50 mt-1 bg-white dark:bg-gray-700\n                                border rounded-xl p-3 shadow-lg", children: _jsx(StaticTimePicker, { value: jamMasuk, openTo: "hours", views: ["hours", "minutes"], view: viewMasuk, onViewChange: (newView) => {
                                                    if (newView === "hours" || newView === "minutes") {
                                                        setViewMasuk(newView);
                                                    }
                                                }, onChange: (newValue) => {
                                                    setJamMasuk(newValue);
                                                    if (viewMasuk === "hours") {
                                                        setViewMasuk("minutes");
                                                    }
                                                    else {
                                                        setShowJamMasuk(false);
                                                        setViewMasuk("hours");
                                                    }
                                                }, ampm: false, minutesStep: 5, displayStaticWrapperAs: "desktop" }) }))] }), _jsxs("div", { className: "flex flex-col gap-2 relative", children: [_jsx("label", { className: "text-sm font-medium dark:text-white", children: "Jam Pulang" }), _jsx("input", { type: "text", readOnly: true, placeholder: "Pilih Jam Pulang", value: jamPulang ? jamPulang.format("HH:mm") : "", onClick: () => setShowJamPulang(true), className: "border px-3 py-2 rounded-xl cursor-pointer\n                          dark:bg-gray-700 dark:text-white" }), showJamPulang && (_jsx("div", { className: "absolute z-50 mt-1 bg-white dark:bg-gray-700\n                                border rounded-xl p-3 shadow-lg", children: _jsx(StaticTimePicker, { value: jamPulang, openTo: "hours", views: ["hours", "minutes"], view: viewPulang, onViewChange: (newView) => {
                                                    if (newView === "hours" || newView === "minutes") {
                                                        setViewPulang(newView);
                                                    }
                                                }, onChange: (newValue) => {
                                                    setJamPulang(newValue);
                                                    if (viewPulang === "hours") {
                                                        setViewPulang("minutes");
                                                    }
                                                    else {
                                                        setShowJamPulang(false);
                                                        setViewPulang("hours");
                                                    }
                                                }, ampm: false, minutesStep: 5, displayStaticWrapperAs: "desktop" }) }))] }), _jsxs("div", { className: "flex gap-3 pt-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "Simpan" }), _jsx("button", { type: "button", onClick: () => navigate("/shift"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "Batal" })] })] })) }) })] }) }));
}
