import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function EditPenugasan() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [companies, setCompanies] = useState([]);
    const [pegawaiList, setPegawaiList] = useState([]);
    const [pegawaiFiltered, setPegawaiFiltered] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedPegawai, setSelectedPegawai] = useState("");
    const [judul, setJudul] = useState("");
    const [rincian, setRincian] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(true);
    // Fetch Companies
    const fetchCompanies = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/companies", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data.data);
    };
    // Fetch Pegawai
    const fetchPegawais = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/pegawais", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const mapped = (res.data.data ?? res.data).map((p) => ({
            id: p.id,
            name: p.name,
            company_id: p.company_id ?? p.company?.id ?? null,
        }));
        setPegawaiList(mapped);
    };
    // Fetch existing penugasan
    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/penugasan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const d = res.data.data;
            setSelectedCompany(d.company_id);
            setSelectedPegawai(d.pegawai_id);
            setJudul(d.judul_pekerjaan);
            setRincian(d.rincian_pekerjaan);
            setStatus(d.status);
            setLoading(false);
        }
        catch (e) {
            Swal.fire("Error", "Gagal mengambil data penugasan.", "error");
            navigate("/penugasan");
        }
    };
    // Init fetch
    useEffect(() => {
        fetchCompanies();
        fetchPegawais();
        fetchDetail();
    }, []);
    // Update pegawai list ketika company berubah
    useEffect(() => {
        if (!selectedCompany) {
            setPegawaiFiltered([]);
            return;
        }
        const filtered = pegawaiList.filter((p) => p.company_id === Number(selectedCompany));
        setPegawaiFiltered(filtered);
    }, [selectedCompany, pegawaiList]);
    // Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCompany || !selectedPegawai || !judul) {
            Swal.fire("Error", "Semua field wajib diisi!", "warning");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await api.put(`/penugasan/${id}`, {
                company_id: selectedCompany,
                pegawai_id: selectedPegawai,
                judul_pekerjaan: judul,
                rincian_pekerjaan: rincian,
                status: status,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Berhasil!", "Penugasan berhasil diperbarui.", "success");
            navigate("/penugasan");
        }
        catch (err) {
            Swal.fire("Error", "Gagal menyimpan perubahan.", "error");
        }
    };
    if (loading) {
        return (_jsx("div", { className: "text-center text-gray-600 dark:text-gray-300 mt-10", children: "Loading..." }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Penugasan", description: "Edit Penugasan" }), _jsx(PageHeader, { pageTitle: "Edit Penugasan", titleClass: "text-[32px] dark:text-white" }), _jsx(ComponentCard, { className: "p-6 dark:bg-gray-800 dark:border-gray-700", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(Number(e.target.value)), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "", children: "-- Pilih Company --" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Pegawai" }), _jsxs("select", { value: selectedPegawai, onChange: (e) => setSelectedPegawai(Number(e.target.value)), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white", disabled: !selectedCompany, children: [_jsx("option", { value: "", children: selectedCompany
                                                ? "-- Pilih Pegawai --"
                                                : "Pilih company dahulu" }), pegawaiFiltered.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id))), selectedCompany && pegawaiFiltered.length === 0 && (_jsx("option", { children: "Tidak ada pegawai" }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Judul Pekerjaan" }), _jsx("input", { type: "text", value: judul, onChange: (e) => setJudul(e.target.value), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Rincian Pekerjaan" }), _jsx("textarea", { value: rincian, onChange: (e) => setRincian(e.target.value), className: "border w-full px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white h-32" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium dark:text-white", children: "Status" }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "border px-3 py-2 w-full rounded-lg dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "process", children: "Process" }), _jsx("option", { value: "finish", children: "Finish" })] })] }), _jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl", children: "Simpan Perubahan" })] }) })] }));
}
