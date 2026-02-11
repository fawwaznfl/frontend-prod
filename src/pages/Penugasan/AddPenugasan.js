import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function AddPenugasan() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dashboardType = user.dashboard_type; // "superadmin" / "admin"
    const userCompanyId = user.company_id;
    const [companies, setCompanies] = useState([]);
    const [pegawaiList, setPegawaiList] = useState([]);
    const [pegawaiFiltered, setPegawaiFiltered] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(dashboardType === "admin" ? userCompanyId : "");
    const [selectedPegawai, setSelectedPegawai] = useState("");
    const [judul, setJudul] = useState("");
    const [rincian, setRincian] = useState("");
    const [loadingPegawai, setLoadingPegawai] = useState(false);
    // ========== FETCH COMPANIES (SUPERADMIN ONLY) ==========
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data);
        }
        catch {
            setCompanies([]);
        }
    };
    // ========== FETCH PEGAWAI ==========
    const fetchPegawais = async () => {
        try {
            setLoadingPegawai(true);
            const token = localStorage.getItem("token");
            const res = await api.get("/pegawais", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = (res.data.data ?? res.data).map((p) => ({
                id: p.id,
                name: p.name,
                company_id: p.company_id ?? p.company?.id ?? null,
            }));
            if (dashboardType === "admin") {
                // Admin hanya boleh lihat pegawai dari company-nya
                const filtered = mapped.filter((p) => p.company_id === Number(userCompanyId));
                setPegawaiList(filtered);
            }
            else {
                setPegawaiList(mapped);
            }
        }
        catch (err) {
            console.error("Error fetching pegawai:", err);
            setPegawaiList([]);
        }
        finally {
            setLoadingPegawai(false);
        }
    };
    // Fetch awal
    useEffect(() => {
        if (dashboardType === "superadmin")
            fetchCompanies();
        fetchPegawais();
    }, []);
    // ========== FILTER PEGAWAI (SUPERADMIN & ADMIN) ==========
    useEffect(() => {
        if (!selectedCompany) {
            setPegawaiFiltered([]);
            return;
        }
        const filtered = pegawaiList.filter((p) => p.company_id === Number(selectedCompany));
        setPegawaiFiltered(filtered);
    }, [selectedCompany, pegawaiList]);
    // ========== SUBMIT ==========
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCompany || !selectedPegawai || !judul || !rincian) {
            Swal.fire("Gagal", "Semua field harus diisi.", "warning");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await api.post("/penugasan", {
                company_id: selectedCompany,
                pegawai_id: selectedPegawai,
                judul_pekerjaan: judul,
                rincian_pekerjaan: rincian,
            }, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire("Berhasil", "Penugasan berhasil ditambahkan!", "success");
            navigate("/penugasan");
        }
        catch (err) {
            Swal.fire("Error", "Gagal menambahkan penugasan.", "error");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Tambah Penugasan", description: "Tambah data penugasan" }), _jsx(PageHeader, { pageTitle: "Tambah Penugasan", titleClass: "text-[32px] dark:text-white" }), _jsx(ComponentCard, { className: "p-6 dark:bg-gray-800 dark:border-gray-700", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [dashboardType === "superadmin" && (_jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(Number(e.target.value)), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Nama Pegawai" }), loadingPegawai ? (_jsx("div", { className: "text-gray-600 dark:text-gray-300", children: "Loading pegawai..." })) : (_jsxs("select", { value: selectedPegawai, onChange: (e) => setSelectedPegawai(e.target.value), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Pegawai --" }), pegawaiFiltered.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Judul Pekerjaan" }), _jsx("input", { type: "text", value: judul, onChange: (e) => setJudul(e.target.value), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", placeholder: "Masukkan judul pekerjaan..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Rincian Pekerjaan" }), _jsx("textarea", { value: rincian, onChange: (e) => setRincian(e.target.value), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white h-32", placeholder: "Masukkan rincian pekerjaan..." })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium", children: "Simpan Penugasan" })] }) })] }));
}
