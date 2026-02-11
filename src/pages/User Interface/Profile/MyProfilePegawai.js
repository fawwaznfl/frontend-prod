import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function MyProfilePegawai() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("info");
    const [pegawai, setPegawai] = useState(null);
    const [cuti, setCuti] = useState([]);
    const [gajiPlus, setGajiPlus] = useState([]);
    const [gajiMinus, setGajiMinus] = useState([]);
    const [tanggalLahir, setTanggalLahir] = useState(null);
    const [initialTanggalLahir, setInitialTanggalLahir] = useState(null);
    const [alamat, setAlamat] = useState("");
    const [initialAlamat, setInitialAlamat] = useState("");
    const [namaRekening, setNamaRekening] = useState("");
    const [initialNamaRekening, setInitialNamaRekening] = useState("");
    const [gender, setGender] = useState("");
    const [initialGender, setInitialGender] = useState("");
    const [statusNikah, setStatusNikah] = useState("");
    const [initialStatusNikah, setInitialStatusNikah] = useState("");
    const [noKtp, setNoKtp] = useState("");
    const [initialNoKtp, setInitialNoKtp] = useState("");
    const [noKk, setNoKk] = useState("");
    const [initialNoKk, setInitialNoKk] = useState("");
    const [nobpjs, setNobpjs] = useState("");
    const [initialNobpjs, setInitialNobpjs] = useState("");
    const [nobpjsketenaga, setNobpjsketenaga] = useState("");
    const [initialNobpjsketenaga, setInitialNobpjsketenaga] = useState("");
    const [nonpwp, setNonpwp] = useState("");
    const [initialNonpwp, setInitialNonpwp] = useState("");
    const [nosim, setNosim] = useState("");
    const [initialNosim, setInitialNosim] = useState("");
    const [nopkwt, setNopkwt] = useState("");
    const [initialNopkwt, setInitialNopkwt] = useState("");
    const [nokontrak, setNokontrak] = useState("");
    const [initialNokontrak, setInitialNokontrak] = useState("");
    const [norekening, setNorekening] = useState("");
    const [initialNorekening, setInitialNorekening] = useState("");
    const [telepon, setTelepon] = useState("");
    const [loading, setLoading] = useState(true);
    const [initialTelepon, setInitialTelepon] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [cutiSummary, setCutiSummary] = useState(null);
    const [fotoFile, setFotoFile] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [saving, setSaving] = useState(false);
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };
    const formatTanggalID = (dateString) => {
        if (!dateString)
            return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    const formatRupiah = (value) => {
        if (value === null || value === undefined)
            return "-";
        const number = typeof value === "string"
            ? Number(value)
            : value;
        if (isNaN(number))
            return "-";
        return (number.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
        }) + " / bulan");
    };
    const handleFotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setFotoFile(file);
        setPreviewFoto(URL.createObjectURL(file));
    };
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        fetchProfile();
    }, []);
    const fetchProfile = async () => {
        try {
            const res = await api.get("/profile");
            const data = res.data.data;
            setPegawai(data);
            setTelepon(data.telepon || "");
            setAlamat(data.alamat || "");
            setInitialAlamat(data.alamat || "");
            setGender(data.gender || "");
            setInitialGender(data.gender || "");
            setStatusNikah(data.status_nikah || "");
            setInitialStatusNikah(data.status_nikah || "");
            setNoKtp(data.ktp || "");
            setInitialNoKtp(data.ktp || "");
            setNoKk(data.kartu_keluarga || "");
            setInitialNoKk(data.kartu_keluarga || "");
            setNobpjs(data.bpjs_kesehatan || "");
            setInitialNobpjs(data.bpjs_kesehatan || "");
            setNobpjsketenaga(data.bpjs_ketenagakerjaan || "");
            setInitialNobpjsketenaga(data.bpjs_ketenagakerjaan || "");
            setNonpwp(data.npwp || "");
            setInitialNonpwp(data.npwp || "");
            setNosim(data.sim || "");
            setInitialNosim(data.sim || "");
            setNopkwt(data.no_pkwt || "");
            setInitialNopkwt(data.no_pkwt || "");
            setNokontrak(data.no_kontrak || "");
            setInitialNokontrak(data.no_kontrak || "");
            setNorekening(data.rekening || "");
            setInitialNorekening(data.no_rekening || "");
            setNamaRekening(data.nama_rekening || "");
            setInitialNamaRekening(data.nama_rekening || "");
            const tgl = data.tgl_lahir
                ? new Date(data.tgl_lahir)
                : null;
            setTanggalLahir(tgl);
            setInitialTanggalLahir(tgl);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const InfoField = ({ label, value, type = "text", }) => (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: label }), _jsx("input", { type: type, value: value || "-", disabled: true, className: "\n          w-full rounded-xl border border-gray-200\n          bg-gray-50 px-4 py-3\n          text-gray-800 text-sm\n          cursor-not-allowed\n        " })] }));
    const uploadApi = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            Accept: "application/json",
        },
    });
    const fetchCutiSummary = async () => {
        const res = await api.get(`/cuti/summary/${user.id}`);
        setCutiSummary(res.data.data);
    };
    useEffect(() => {
        fetchCutiSummary();
    }, []);
    const handleSaveAll = async () => {
        try {
            setSaving(true);
            const payload = {};
            // 📞 Telepon
            if (telepon !== initialTelepon) {
                payload.telepon = telepon;
            }
            // Tanggal lahir
            if (tanggalLahir &&
                (!initialTanggalLahir ||
                    tanggalLahir.getTime() !== initialTanggalLahir.getTime())) {
                payload.tgl_lahir = formatDate(tanggalLahir);
            }
            // Alamat
            if (alamat !== initialAlamat) {
                payload.alamat = alamat;
            }
            // Alamat
            if (namaRekening !== initialNamaRekening) {
                payload.nama_rekening = namaRekening;
            }
            // Gender
            if (gender !== initialGender) {
                payload.gender = gender;
            }
            // Status nikah
            if (statusNikah !== initialStatusNikah) {
                payload.status_nikah = statusNikah;
            }
            // KTP
            if (noKtp !== initialNoKtp) {
                payload.ktp = noKtp;
            }
            // Kartu Keluarga
            if (noKk !== initialNoKk) {
                payload.kartu_keluarga = noKk;
            }
            // BPJS Kesehatan
            if (nobpjs !== initialNobpjs) {
                payload.bpjs_kesehatan = nobpjs;
            }
            // BPJS ketenagakerjaan
            if (nobpjsketenaga !== initialNobpjsketenaga) {
                payload.bpjs_ketenagakerjaan = nobpjsketenaga;
            }
            // BPJS ketenagakerjaan
            if (nonpwp !== initialNonpwp) {
                payload.npwp = nonpwp;
            }
            // SIM
            if (nosim !== initialNosim) {
                payload.sim = nosim;
            }
            // SIM
            if (nopkwt !== initialNopkwt) {
                payload.no_pkwt = nopkwt;
            }
            // Nomor Kontrak
            if (nokontrak !== initialNokontrak) {
                payload.no_kontrak = nokontrak;
            }
            // Nomor Kontrak
            if (norekening !== initialNorekening) {
                payload.rekening = norekening;
            }
            // Kirim payload
            if (Object.keys(payload).length > 0) {
                await api.post("/profile/update", payload);
            }
            // Upload foto
            if (fotoFile) {
                const formData = new FormData();
                formData.append("foto_karyawan", fotoFile);
                await api.post("/profile/update-foto", formData, {
                    headers: { "Content-Type": undefined },
                });
            }
            await fetchProfile();
            Swal.fire({
                icon: "success",
                title: "Berhasil 🎉",
                text: "Perubahan berhasil disimpan",
                timer: 2000,
                showConfirmButton: false,
            });
        }
        catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menyimpan perubahan",
            });
        }
        finally {
            setSaving(false);
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "sticky top-0 z-20 bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "My Profile" })] }) }), _jsx("div", { className: "bg-white mt-3 mx-4 rounded-2xl shadow-sm", children: _jsx("div", { className: "flex text-sm font-medium", children: [
                        { label: "Informasi", value: "info" },
                        { label: "Cuti", value: "cuti" },
                        { label: "+ Gaji", value: "plus" },
                        { label: "- Gaji", value: "minus" },
                    ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.value), className: `flex-1 py-3 text-center relative transition
                ${activeTab === tab.value ? "text-indigo-600" : "text-gray-400"}`, children: [tab.label, activeTab === tab.value && (_jsx("span", { className: "absolute bottom-0 left-6 right-6 h-[3px] bg-indigo-600 rounded-full" }))] }, tab.value))) }) }), _jsx("div", { className: "px-4 pt-4 pb-24 space-y-4 overflow-y-auto", style: {
                    height: "calc(100vh - 200px)",
                }, children: loading ? (_jsx("div", { className: "text-center text-gray-400 text-sm mt-10", children: "Memuat data..." })) : (_jsxs(_Fragment, { children: [activeTab === "info" && (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: user.foto_karyawan, className: "w-14 h-14 rounded-xl object-cover bg-indigo-100" }), !previewFoto && !pegawai?.foto_karyawan && (_jsx("div", { className: "w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center", children: _jsx(User, { className: "text-indigo-600" }) })), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: pegawai?.name }), _jsx("p", { className: "text-xs text-gray-500", children: pegawai?.divisi?.nama || "-" })] })] }), _jsx("hr", {}), _jsx(InfoField, { label: "Nama Pegawai", value: pegawai?.name }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Foto Profile" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFotoChange, className: "block w-full text-sm\n                  file:mr-4 file:rounded-lg\n                  file:border-0\n                  file:bg-indigo-50\n                  file:px-4 file:py-2\n                  file:text-indigo-600\n                  hover:file:bg-indigo-100\n                " })] }), _jsx(InfoField, { label: "Email", value: pegawai?.email }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "No Telepon" }), _jsx("input", { type: "tel", value: telepon, onChange: (e) => setTelepon(e.target.value), placeholder: "08xxxxxxxxxx", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " })] }), _jsx(InfoField, { label: "username", value: pegawai?.username }), _jsx(InfoField, { label: "Lokasi Kantor", value: pegawai?.lokasi?.nama_lokasi }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Tanggal Lahir" }), _jsx(DatePicker, { selected: tanggalLahir, onChange: (date) => setTanggalLahir(date), dateFormat: "yyyy-MM-dd", placeholderText: "Pilih tanggal lahir", showYearDropdown: true, showMonthDropdown: true, dropdownMode: "select", maxDate: new Date(), className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Alamat" }), _jsx("textarea", { value: alamat, onChange: (e) => setAlamat(e.target.value), rows: 3, placeholder: "Masukkan alamat lengkap", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                resize-none\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " })] }), _jsx(InfoField, { label: "Tanggal Masuk Perusahaan", value: formatTanggalID(pegawai?.tgl_join) }), _jsx(InfoField, { label: "Masa Kerja" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Jenis Kelamin" }), _jsxs("select", { value: gender, onChange: (e) => setGender(e.target.value), className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              ", children: [_jsx("option", { value: "", children: "Pilih jenis kelamin" }), _jsx("option", { value: "Laki-laki", children: "Laki-laki" }), _jsx("option", { value: "Perempuan", children: "Perempuan" })] })] }), _jsx(InfoField, { label: "Level User", value: pegawai?.dashboard_type }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Status Nikah" }), _jsxs("select", { value: statusNikah, onChange: (e) => setStatusNikah(e.target.value), className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              ", children: [_jsx("option", { value: "", children: "Pilih Status Nikah" }), _jsx("option", { value: "menikah", children: "Menikah" }), _jsx("option", { value: "belum_menikah", children: "Belum Menikah" }), _jsx("option", { value: "janda", children: "Janda" }), _jsx("option", { value: "duda", children: "Duda" })] })] }), _jsx(InfoField, { label: "Divisi", value: pegawai?.divisi?.nama }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor KTP" }), _jsx("input", { type: "text", inputMode: "numeric", value: noKtp, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNoKtp(val);
                                            }, placeholder: "16 digit No KTP", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [noKtp.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor Kartu Keluarga" }), _jsx("input", { type: "text", inputMode: "numeric", value: noKk, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNoKk(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [noKk.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor BPJS Kesehatan" }), _jsx("input", { type: "text", inputMode: "numeric", value: nobpjs, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNobpjs(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nobpjs.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor BPJS Ketenagakerjaan" }), _jsx("input", { type: "text", inputMode: "numeric", value: nobpjsketenaga, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNobpjsketenaga(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nobpjsketenaga.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor NPWP" }), _jsx("input", { type: "text", inputMode: "numeric", value: nonpwp, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNonpwp(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nonpwp.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor SIM" }), _jsx("input", { type: "text", inputMode: "numeric", value: nosim, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNosim(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nosim.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor PKWT" }), _jsx("input", { type: "text", inputMode: "numeric", value: nopkwt, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNopkwt(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nopkwt.length, "/16 digit"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor Kontrak" }), _jsx("input", { type: "text", inputMode: "numeric", value: nokontrak, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNokontrak(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [nokontrak.length, "/16 digit"] })] }), _jsx(InfoField, { label: "Tanggal Mulai PKWT", value: pegawai?.tanggal_mulai_pwkt }), _jsx(InfoField, { label: "Tanggal Berakhir PKWT", value: pegawai?.tanggal_berakhir_pwkt }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm text-gray-500", children: "Nomor Rekening" }), _jsx("input", { type: "text", inputMode: "numeric", value: norekening, onChange: (e) => {
                                                // hanya angka, max 16 digit
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                setNorekening(val);
                                            }, placeholder: "16 digit No Kartu Keluarga", className: "\n                w-full rounded-xl border border-gray-200\n                bg-white px-4 py-3\n                text-gray-800 text-sm\n                focus:outline-none focus:ring-2 focus:ring-indigo-500\n              " }), _jsxs("p", { className: "text-xs text-gray-400", children: [norekening.length, "/16 digit"] })] }), _jsx("input", { type: "text", value: namaRekening, onChange: (e) => setNamaRekening(e.target.value), placeholder: "Masukkan nama rekening", className: "\n              w-full rounded-xl border border-gray-200\n              bg-white px-4 py-3\n              text-gray-800 text-sm\n              focus:outline-none focus:ring-2 focus:ring-indigo-500\n            " }), _jsx("button", { onClick: handleSaveAll, disabled: saving ||
                                        (!fotoFile && telepon === initialTelepon && tanggalLahir === initialTanggalLahir && alamat === initialAlamat
                                            && gender === initialGender && statusNikah === initialStatusNikah && noKtp === initialNoKtp && nobpjs === initialNobpjs
                                            && nobpjsketenaga === initialNobpjsketenaga && nonpwp === initialNonpwp && nosim === initialNopkwt && nopkwt === initialNopkwt
                                            && nokontrak === initialNokontrak && norekening === initialNorekening), className: "\n              w-full mt-4 rounded-xl py-3\n              bg-indigo-600 text-white text-sm font-medium\n              disabled:bg-gray-300\n            ", children: saving ? "Menyimpan..." : "Simpan Perubahan" })] })), activeTab === "cuti" && (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Cuti & Izin" }), _jsx(InfoField, { label: "Cuti", value: String(cutiSummary?.cuti ?? 0) }), _jsx(InfoField, { label: "Izin Masuk", value: String(cutiSummary?.izin_masuk ?? 0) }), _jsx(InfoField, { label: "Izin Telat", value: String(cutiSummary?.izin_telat ?? 0) }), _jsx(InfoField, { label: "Izin Pulang Cepat", value: String(cutiSummary?.izin_pulang_cepat ?? 0) }), _jsx(InfoField, { label: "Sakit", value: String(cutiSummary?.sakit ?? 0) })] })), activeTab === "plus" && (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Penjumlahan Gaji" }), _jsx(InfoField, { label: "Gaji Pokok", value: formatRupiah(pegawai?.gaji_pokok) }), _jsx(InfoField, { label: "Makan & Transport", value: formatRupiah(pegawai?.makan_transport) }), _jsx(InfoField, { label: "Lembur", value: formatRupiah(pegawai?.lembur) }), _jsx(InfoField, { label: "100% Kehadiran", value: formatRupiah(pegawai?.kehadiran) }), _jsx(InfoField, { label: "THR", value: formatRupiah(pegawai?.thr) }), _jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Bonus Bulan Berjalan" }), _jsx(InfoField, { label: "Bonus Pribadi", value: formatRupiah(pegawai?.bonus_pribadi) }), _jsx(InfoField, { label: "Bonus Team", value: formatRupiah(pegawai?.bonus_team) }), _jsx(InfoField, { label: "Bonus Jackpot", value: formatRupiah(pegawai?.bonus_jackpot) })] }), _jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Tunjangan BPJS & PAJAK" }), _jsx(InfoField, { label: "Tunjangan BPJS Kesehatan", value: formatRupiah(pegawai?.tunjangan_bpjs_kesehatan) }), _jsx(InfoField, { label: "Tunjangan BPJS Ketenagakerjaan", value: formatRupiah(pegawai?.tunjangan_bpjs_ketenagakerjaan) }), _jsx(InfoField, { label: "Tunjangan Pajak", value: formatRupiah(pegawai?.tunjangan_pajak) })] })] })), activeTab === "minus" && (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Pengurangan BPJS" }), _jsx(InfoField, { label: "Potongan BPJS Kesehatan", value: formatRupiah(pegawai?.potongan_bpjs_kesehatan) }), _jsx(InfoField, { label: "Potongan BPJS Ketenagakerjaan", value: formatRupiah(pegawai?.potongan_bpjs_ketenagakerjaan) }), _jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-4", children: [_jsx("h2", { className: "font-semibold text-gray-800", children: "Pengurangan Gaji" }), _jsx(InfoField, { label: "Izin", value: formatRupiah(pegawai?.izin) }), _jsx(InfoField, { label: "Terlambat", value: formatRupiah(pegawai?.terlambat) }), _jsx(InfoField, { label: "Mangkir", value: formatRupiah(pegawai?.mangkir) }), _jsx(InfoField, { label: "Saldo Kasbon", value: formatRupiah(pegawai?.saldo_kasbon) })] })] }))] })) }), _jsx(BottomNav, {})] }));
}
/* COMPONENT KECIL  */
const InfoRow = ({ label, value }) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: label }), _jsx("span", { className: "font-medium text-gray-900", children: value || "-" })] }));
const EmptyState = ({ text }) => (_jsx("div", { className: "text-center text-gray-400 mt-10 text-sm", children: text }));
