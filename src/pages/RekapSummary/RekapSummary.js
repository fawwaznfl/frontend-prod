import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/common/DataTable";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Printer, Wallet } from "lucide-react";
import { useSearchParams } from "react-router-dom";
export default function RekapData() {
    const dashboardType = localStorage.getItem("dashboard_type");
    // STATE
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [data, setData] = useState([]);
    const [viewState, setViewState] = useState("form");
    // FETCH COMPANY (SUPERADMIN)
    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies");
            setCompanies(res.data.data);
        }
        catch {
            Swal.fire("Error", "Gagal mengambil data company", "error");
        }
    };
    // FETCH REKAP
    const fetchRekap = async () => {
        if (!startDate || !endDate) {
            return Swal.fire("Error", "Tanggal harus diisi", "warning");
        }
        if (dashboardType === "superadmin" && !selectedCompany) {
            return Swal.fire("Error", "Pilih company terlebih dahulu", "warning");
        }
        setViewState("loading");
        try {
            const params = {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
            };
            if (dashboardType === "superadmin") {
                params.company_id = selectedCompany;
            }
            const res = await api.get("/rekap-absensi/summary", { params });
            setData(res.data.data);
            setViewState("result");
            // ⬇️ SIMPAN KE URL
            setSearchParams({
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                ...(dashboardType === "superadmin" && {
                    company_id: String(selectedCompany),
                }),
            });
        }
        catch {
            Swal.fire("Error", "Gagal mengambil data rekap", "error");
            setViewState("form");
        }
    };
    useEffect(() => {
        const start = searchParams.get("start_date");
        const end = searchParams.get("end_date");
        const companyId = searchParams.get("company_id");
        if (start && end) {
            const startD = new Date(start);
            const endD = new Date(end);
            setStartDate(startD);
            setEndDate(endD);
            if (dashboardType === "superadmin" && companyId) {
                setSelectedCompany(Number(companyId));
            }
            fetchRekapWithParams(startD, endD, companyId ? Number(companyId) : undefined);
        }
    }, []);
    const HighlightStat = ({ text, mainBg, subBg, }) => {
        if (text.startsWith("Tidak")) {
            return (_jsx("span", { className: "\n            inline-block\n            px-3 py-1\n            rounded-full\n            bg-gray-100\n            text-gray-500\n            text-xs\n            font-medium\n          ", children: text }));
        }
        const [main, sub] = text.split("\n");
        return (_jsxs("div", { className: "flex flex-col gap-1 items-start", children: [_jsx("span", { className: `
            px-3 py-1
            rounded-full
            text-xs
            font-semibold
            ${mainBg}
          `, children: main }), sub && (_jsx("span", { className: `
              px-2 py-0.5
              rounded-full
              text-[11px]
              font-medium
              ${subBg}
            `, children: sub }))] }));
    };
    // EFFECT
    useEffect(() => {
        if (dashboardType === "superadmin") {
            fetchCompanies();
        }
    }, []);
    // TABLE COLUMNS
    const columns = [
        { header: "Nama Pegawai", accessor: "nama_pegawai" },
        { header: "Total Cuti", cell: r => `${r.total_cuti} x` },
        { header: "Total Izin Masuk", cell: r => `${r.total_izin_masuk} x` },
        { header: "Total Sakit", cell: r => `${r.total_sakit} x` },
        { header: "Total Izin Telat", cell: r => `${r.total_izin_telat} x` },
        { header: "Total Izin Pulang Cepat", cell: r => `${r.total_izin_pulang_cepat} x` },
        { header: "Total Hadir", accessor: "total_hadir" },
        { header: "Total Alfa", cell: r => `${r.total_alfa} x` },
        { header: "Total Libur", cell: r => `${r.total_libur} x` },
        {
            header: "Total Telat",
            width: "130px",
            cell: r => (_jsx(HighlightStat, { text: r.total_telat, mainBg: " bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", subBg: " bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" }))
        },
        {
            header: "Total Pulang Cepat",
            width: "130px",
            cell: r => (_jsx(HighlightStat, { text: r.total_pulang_cepat, mainBg: " bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", subBg: " bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" }))
        },
        {
            header: "Total Lembur",
            cell: r => (_jsx(HighlightStat, { text: r.total_lembur, mainBg: "bg-blue-100 text-blue-700", subBg: "bg-blue-50 text-blue-600" }))
        },
        {
            header: "Persentase Kehadiran",
            cell: r => `${r.persentase_kehadiran} %`
        },
        {
            header: "Action",
            cell: r => (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => handleExportPegawai(r), className: " px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700\n                    dark:bg-green-500 dark:hover:bg-green-600", children: _jsx(Printer, { size: 18 }) }), !r.has_payroll && (_jsx("button", { onClick: () => navigate(`/hitung-gaji/${r.pegawai_id}?start_date=${formatDate(startDate)}
                &end_date=${formatDate(endDate)}&persentase=${r.persentase_kehadiran}`), className: "px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700", title: "Hitung Gaji", children: _jsx(Wallet, { size: 18 }) }))] }))
        }
    ];
    // EXPORT REKAP
    const handleExportRekap = () => {
        if (!startDate || !endDate) {
            return Swal.fire("Error", "Tanggal belum lengkap", "warning");
        }
        Swal.fire({
            title: "Export Detail",
            text: "Pilih format export",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Excel",
            denyButtonText: "PDF",
            cancelButtonText: "Batal",
            confirmButtonColor: "#16a34a",
            denyButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                exportRekapExcel();
            }
            else if (result.isDenied) {
                exportRekapPdf();
            }
        });
    };
    const exportRekapExcel = async () => {
        const res = await api.get("/rekap-absensi/export-summary", {
            params: {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                company_id: selectedCompany || undefined,
            },
            responseType: "blob",
        });
        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rekap-absensi-summary.xlsx";
        a.click();
    };
    const exportRekapPdf = async () => {
        const res = await api.get("/rekap-absensi/export-rekap-pdf", {
            params: {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                company_id: selectedCompany || undefined,
            },
            responseType: "blob",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rekap-absensi-summary.pdf";
        a.click();
    };
    // EXPORT DETAIL
    const handleExportAll = () => {
        if (!startDate || !endDate) {
            return Swal.fire("Error", "Tanggal belum lengkap", "warning");
        }
        Swal.fire({
            title: "Export Detail",
            text: "Pilih format export",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Excel",
            denyButtonText: "PDF",
            cancelButtonText: "Batal",
            confirmButtonColor: "#16a34a",
            denyButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                exportExcelAll();
            }
            else if (result.isDenied) {
                exportPdfAll();
            }
        });
    };
    const exportExcelAll = async () => {
        const res = await api.get("/rekap-absensi/export", {
            params: {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                company_id: selectedCompany || undefined,
            },
            responseType: "blob",
        });
        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rekap-absensi-detail.xlsx";
        a.click();
    };
    const exportPdfAll = async () => {
        const res = await api.get("/rekap-absensi/export-pdf", {
            params: {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                company_id: selectedCompany || undefined,
            },
            responseType: "blob",
        });
        const blob = new Blob([res.data], {
            type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rekap-absensi-detail.pdf";
        a.click();
    };
    const handleExportPopup = async () => {
        const result = await Swal.fire({
            title: "Export Detail Absensi",
            text: "Pilih format export",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "📊 Excel",
            cancelButtonText: "📄 PDF",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            // EXCEL
            handleExportAll();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            // PDF
            handleExportPdf();
        }
    };
    const handleExportPdf = async () => {
        if (!startDate || !endDate) {
            return Swal.fire("Error", "Tanggal belum lengkap", "warning");
        }
        try {
            const res = await api.get("/rekap-absensi/export-pdf", {
                params: {
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate),
                    company_id: selectedCompany || undefined,
                },
                responseType: "blob",
            });
            const blob = new Blob([res.data], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "rekap-absensi-detail.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        catch {
            Swal.fire("Error", "Gagal export PDF", "error");
        }
    };
    const handleExportPegawai = async (pegawai) => {
        if (!startDate || !endDate) {
            return Swal.fire("Error", "Tanggal belum lengkap", "warning");
        }
        try {
            const res = await api.get("/rekap-absensi/export", {
                params: {
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate),
                    pegawai_id: pegawai.pegawai_id, // ⬅️ KUNCI
                },
                responseType: "blob",
            });
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rekap-absensi-${pegawai.nama_pegawai}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        catch {
            Swal.fire("Error", "Gagal export pegawai", "error");
        }
    };
    const fetchRekapWithParams = async (start, end, companyId) => {
        setViewState("loading");
        try {
            const params = {
                start_date: formatDate(start),
                end_date: formatDate(end),
            };
            if (dashboardType === "superadmin" && companyId) {
                params.company_id = companyId;
            }
            const res = await api.get("/rekap-absensi/summary", { params });
            setData(res.data.data);
            setViewState("result");
        }
        catch {
            Swal.fire("Error", "Gagal mengambil data rekap", "error");
            setViewState("form");
        }
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Rekap Absensi", description: "Rekap Data Absensi" }), _jsx(PageHeader, { pageTitle: "Rekap Data Absensi", titleClass: "text-[32px] dark:text-white" }), _jsxs("div", { className: "space-y-6", children: [viewState === "form" && (_jsx(ComponentCard, { title: "Filter Rekap Absensi", children: _jsxs("div", { className: "space-y-5", children: [dashboardType === "superadmin" && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xl-700 dark:text-gray-200", children: "Company" }), _jsxs("select", { value: selectedCompany, onChange: (e) => setSelectedCompany(Number(e.target.value)), className: " border px-3 py-2 rounded-lg bg-white dark:bg-gray-700\n                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-600", children: [_jsx("option", { value: "", children: "Pilih Company" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] })), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Mulai" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Pilih tanggal mulai", className: " border px-3 py-2 rounded-lg bg-white dark:bg-gray-700\n                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-600", maxDate: endDate || undefined })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-200", children: "Tanggal Akhir" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), dateFormat: "yyyy-MM-dd", placeholderText: "Pilih tanggal akhir", className: " border px-3 py-2 rounded-lg bg-white dark:bg-gray-700\n                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-600", minDate: startDate || undefined })] }), _jsx("button", { onClick: fetchRekap, className: "\n                    w-full\n                    bg-gradient-to-r from-blue-600 to-blue-500\n                    hover:from-blue-700 hover:to-blue-600\n                    text-white font-semibold\n                    py-3 rounded-xl\n                    shadow-md hover:shadow-lg\n                    transition-all duration-200\n                    flex items-center justify-center gap-2\n                ", children: "Tampilkan Rekap Absensi" })] }) })), viewState === "loading" && (_jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col items-center py-12 gap-4", children: [_jsx("div", { className: "animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Memuat rekap absensi..." })] }) })), viewState === "result" && (_jsxs(_Fragment, { children: [_jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-xl dark:text-gray-200", children: "Rekap Data Absensi" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleExportAll, className: "px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700\n                    dark:bg-blue-500 dark:hover:bg-blue-600", children: "Export Details" }), _jsx("button", { onClick: handleExportRekap, className: "px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700\n                  dark:bg-purple-500 dark:hover:bg-purple-600", children: "Export Rekap" }), _jsx("button", { onClick: () => {
                                                        setViewState("form");
                                                        setSearchParams({});
                                                    }, className: "px-4 py-2 rounded-lg text-white bg-green-600", children: "Back" })] })] }) }), _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "flex gap-6", children: [_jsx(DatePicker, { selected: startDate, dateFormat: "yyyy-MM-dd", disabled: true, className: "bg-gray-100 px-4 py-2 rounded-lg" }), _jsx(DatePicker, { selected: endDate, dateFormat: "yyyy-MM-dd", disabled: true, className: "bg-gray-100 px-4 py-2 rounded-lg" })] }) }), _jsx(ComponentCard, { className: " overflow-x-auto [&_tr:hover]:bg-white [&_tr:hover]:text-gray-900\n            dark:[&_tr:hover]:bg-gray-800 dark:[&_tr:hover]:text-gray-100 [&_input]:bg-white [&_input]:text-gray-900\n            dark:[&_input]:bg-gray-800 dark:[&_input]:text-gray-100 dark:[&_table]:bg-gray-900 dark:[&_table]:text-gray-100\n            dark:[&_thead]:bg-gray-800 dark:[&_th]:bg-gray-800 dark:[&_th]:text-gray-100 dark:[&_tr]:border-gray-700\n            dark:[&_td]:border-gray-700 [&_tr]:transition-colors", children: _jsx(DataTable, { columns: columns, data: data }) })] }))] })] }));
}
