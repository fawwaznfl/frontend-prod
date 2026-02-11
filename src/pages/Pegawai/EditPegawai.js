import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import DatePicker from "../../components/form/date-picker";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
export default function EditPegawai() {
    const { id } = useParams();
    const navigate = useNavigate();
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const [fotoPreview, setFotoPreview] = useState(null);
    const [fotoFile, setFotoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [lokasis, setLokasis] = useState([]);
    const [roles, setRoles] = useState([]);
    const [divisis, setDivisis] = useState([]);
    const isSuperadmin = user?.dashboard_type === "superadmin";
    const isAdmin = user?.dashboard_type === "admin";
    const [periodeGaji, setPeriodeGaji] = useState("bulan");
    const satuanText = periodeGaji === "hari" ? "/hari" : "/bulan";
    const [satuanGaji, setSatuanGaji] = useState("bulan");
    const satuanLabel = "/" + satuanGaji;
    const [satuanKasbon, setSatuanKasbon] = useState("bulan");
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        telepon: "",
        tgl_lahir: null,
        masa_berlaku: null,
        gender: null,
        divisi_id: null,
        lokasi_id: null,
        role_id: null,
        dashboard_type: "",
        status: "",
        company_id: null,
        tgl_join: "",
        kasbon_periode: "bulan",
        status_nikah: "",
        status_pajak: "",
        ktp: "",
        mangkir: "",
        tunjangan_bpjs_kesehatan: "",
        potongan_bpjs_kesehatan: "",
        potongan_bpjs_ketenagakerjaan: "",
        tunjangan_pajak: "",
        tunjangan_bpjs_ketenagakerjaan: "",
        saldo_kasbon: "",
        kartu_keluarga: "",
        bpjs_kesehatan: "",
        bpjs_ketenagakerjaan: "",
        npwp: "",
        sim: "",
        izin: "",
        izin_cuti: "",
        izin_telat: "",
        terlambat: "",
        izin_pulang_cepat: "",
        izin_lainnya: "",
        no_pkwt: "",
        no_kontrak: "",
        tanggal_mulai_pwkt: "",
        tanggal_berakhir_pwkt: "",
        rekening: "",
        nama_rekening: "",
        alamat: "",
        gaji_pokok: "",
        makan_transport: "",
        lembur: "",
        kehadiran: "",
        thr: "",
        bonus_pribadi: "",
        bonus_team: "",
        bonus_jackpot: "",
        terlambat_satuan: "hari",
    });
    // FETCH COMPANY / LOKASI / ROLE
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanies(res.data.data || res.data);
        }
        catch (err) { }
    };
    const fetchLokasis = async (company_id) => {
        try {
            const token = localStorage.getItem("token");
            if (user?.dashboard_type === "admin") {
                const res = await api.get(`/lokasis?company_id=${user.company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLokasis(res.data.data || res.data);
                return;
            }
            if (company_id) {
                const res = await api.get(`/lokasis?company_id=${company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLokasis(res.data.data || res.data);
                return;
            }
            setLokasis([]);
        }
        catch (err) {
            console.log(err);
        }
    };
    const fetchRoles = async (company_id) => {
        try {
            const token = localStorage.getItem("token");
            // KALAU ADMIN DI AMBIL BERDASARKAN COMPANY USER
            if (user?.dashboard_type === "admin") {
                const res = await api.get(`/roles?company_id=${user.company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(res.data.data || res.data);
                return;
            }
            // KALAU SUPERADMIN DI AMBIL BERDASARKAN USER YANG LOGIN 
            if (company_id) {
                const res = await api.get(`/roles?company_id=${company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(res.data.data || res.data);
                return;
            }
            const res = await api.get(`/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(res.data.data || res.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    const fetchDivisis = async (company_id) => {
        try {
            const token = localStorage.getItem("token");
            if (user?.dashboard_type === "admin") {
                const res = await api.get(`/divisis?company_id=${user.company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDivisis(res.data.data || res.data);
                return;
            }
            if (company_id) {
                const res = await api.get(`/divisis?company_id=${company_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDivisis(res.data.data || res.data);
                return;
            }
            const res = await api.get("/divisis", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDivisis(res.data.data || res.data);
        }
        catch (err) { }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["divisi_id", "lokasi_id", "role_id", "company_id"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? null : Number(value),
            }));
        }
        else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    // UPLOAD FOTO
    const handleFotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setFotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setFotoPreview(reader.result);
        reader.readAsDataURL(file);
    };
    // FETCH DETAIL PEGAWAI
    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/pegawais/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data;
            if (data.company_id) {
                await fetchRoles(data.company_id);
                await fetchDivisis(data.company_id);
                await fetchLokasis(data.company_id);
            }
            // SET FORM DATA
            setFormData({
                name: data.name ?? "",
                username: data.username ?? "",
                email: data.email ?? "",
                telepon: data.telepon ?? "",
                tgl_lahir: data.tgl_lahir ?? null,
                masa_berlaku: data.masa_berlaku ?? null,
                gender: data.gender ?? null,
                divisi_id: data.divisi_id ?? null,
                lokasi_id: data.lokasi_id ?? null,
                role_id: data.role_id ?? null,
                dashboard_type: data.dashboard_type ?? "",
                status: data.status ?? "",
                company_id: data.company_id ?? null,
                tgl_join: data.tgl_join ?? "",
                status_nikah: data.status_nikah ?? "",
                status_pajak: data.status_pajak ?? "",
                kasbon_periode: data.kasbon_periode ?? "bulan",
                ktp: data.ktp ?? "",
                mangkir: data.mangkir ?? "",
                tunjangan_bpjs_kesehatan: data.tunjangan_bpjs_kesehatan ?? "",
                potongan_bpjs_kesehatan: data.potongan_bpjs_kesehatan ?? "",
                potongan_bpjs_ketenagakerjaan: data.potongan_bpjs_ketenagakerjaan ?? "",
                tunjangan_pajak: data.tunjangan_pajak ?? "",
                tunjangan_bpjs_ketenagakerjaan: data.tunjangan_bpjs_ketenagakerjaan ?? "",
                saldo_kasbon: data.saldo_kasbon ?? "",
                kartu_keluarga: data.kartu_keluarga ?? "",
                terlambat: data.terlambat ?? "",
                bpjs_kesehatan: data.bpjs_kesehatan ?? "",
                bpjs_ketenagakerjaan: data.bpjs_ketenagakerjaan ?? "",
                npwp: data.npwp ?? "",
                sim: data.sim ?? "",
                izin: data.izin ?? "",
                izin_cuti: data.izin_cuti ?? "",
                izin_telat: data.izin_telat ?? "",
                izin_pulang_cepat: data.izin_pulang_cepat ?? "",
                izin_lainnya: data.izin_lainnya ?? "",
                no_pkwt: data.no_pkwt ?? "",
                no_kontrak: data.no_kontrak ?? "",
                tanggal_mulai_pwkt: data.tanggal_mulai_pwkt ?? "",
                tanggal_berakhir_pwkt: data.tanggal_berakhir_pwkt ?? "",
                rekening: data.rekening ?? "",
                nama_rekening: data.nama_rekening ?? "",
                alamat: data.alamat ?? "",
                gaji_pokok: data.gaji_pokok ?? "",
                makan_transport: data.makan_transport ?? "",
                lembur: data.lembur ?? "",
                kehadiran: data.kehadiran ?? "",
                thr: data.thr ?? "",
                bonus_pribadi: data.bonus_pribadi ?? "",
                bonus_team: data.bonus_team ?? "",
                bonus_jackpot: data.bonus_jackpot ?? "",
                terlambat_satuan: data.terlambat_satuan ?? "hari",
            });
            // FOTO PREVIEW
            if (data.foto_karyawan) {
                setFotoPreview(`${import.meta.env.VITE_STORAGE_URL}/${data.foto_karyawan}`);
            }
        }
        catch (err) {
            Swal.fire("Error", "Gagal memuat data pegawai", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
        fetchDetail();
    }, []);
    const formatRupiah = (value) => {
        const numberString = value.replace(/\D/g, "");
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(Number(numberString));
        return formatted.replace(",00", "");
    };
    const handleGajiPokokChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            gaji_pokok: raw,
        }));
    };
    const handleIzinChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            izin: raw,
        }));
    };
    const handleTerlambatChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            terlambat: raw,
        }));
    };
    const handleMangkirChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            mangkir: raw,
        }));
    };
    const handleBPJSKesehatanChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            tunjangan_bpjs_kesehatan: raw,
        }));
    };
    const handlePotonganBPJSKesehatanChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            potongan_bpjs_kesehatan: raw,
        }));
    };
    const handlePotonganBPJSKetenagakerjaanChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            potongan_bpjs_ketenagakerjaan: raw,
        }));
    };
    const handleBPJSKetenagakerjaanChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            tunjangan_bpjs_ketenagakerjaan: raw,
        }));
    };
    const handleTunjanganPajakChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            tunjangan_pajak: raw,
        }));
    };
    const handleSaldoKasbonChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData((prev) => ({
            ...prev,
            saldo_kasbon: raw,
        }));
    };
    const handleKehadiranChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            kehadiran: raw,
        }));
    };
    const handleThrChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            thr: raw,
        }));
    };
    const handleBonusJackpotChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            bonus_jackpot: raw,
        }));
    };
    const handleBonusTeamChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            bonus_team: raw,
        }));
    };
    const handleBonusPribadiChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            bonus_pribadi: raw,
        }));
    };
    const handleMakanTransportChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            makan_transport: raw,
        }));
    };
    const handleLemburChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev,
            lembur: raw,
        }));
    };
    // SUBMIT FORM
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const body = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    body.append(key, String(value));
                }
            });
            if (fotoFile) {
                body.append("foto_karyawan", fotoFile);
            }
            await api.post(`/pegawais/${id}?_method=PUT`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Sukses", "Data pegawai berhasil diperbarui", "success");
            navigate("/pegawai");
        }
        catch (err) {
            if (err.response?.status === 422) {
                Swal.fire("Validasi Gagal", JSON.stringify(err.response.data.errors, null, 2), "error");
            }
            else {
                Swal.fire("Error", "Gagal menyimpan perubahan", "error");
            }
        }
        finally {
            setSaving(false);
        }
    };
    useEffect(() => {
        if (!formData.company_id) {
            setLokasis([]);
            setFormData((prev) => ({ ...prev, lokasi_id: null }));
            return;
        }
        fetchRoles(formData.company_id);
        fetchDivisis(formData.company_id);
        fetchLokasis(formData.company_id);
    }, [formData.company_id]);
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: ["divisi_id", "lokasi_id", "role_id", "company_id"].includes(name)
                ? (value === "" ? null : Number(value))
                : value,
        }));
    };
    useEffect(() => {
        if (roles.length > 0 && formData.role_id !== null) {
            const exist = roles.some((r) => r.id == formData.role_id);
            if (!exist)
                return;
            setFormData((prev) => ({
                ...prev,
                role_id: Number(prev.role_id),
            }));
        }
    }, [roles]);
    // User interface
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Edit Pegawai", description: "Form edit data pegawai" }), _jsx(PageHeader, { pageTitle: "Edit Pegawai", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/pegawai"), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsx("div", { className: "space-y-6 mt-4", children: loading ? (_jsx(ComponentCard, { children: _jsx("p", { children: "Loading..." }) })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(ComponentCard, { title: "Informasi Akun", titleClass: "text-xl font-bold text-blue-600", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Nama Lengkap" }), _jsx(Input, { name: "name", value: formData.name, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Foto Pegawai" }), _jsxs("label", { className: "mt-1 flex flex-col items-center justify-center w-full h-10 border-2 border-dashed \n                      rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700\n                      border-gray-300 dark:border-gray-600 transition", children: [fotoPreview ? (_jsx("img", { src: fotoPreview, className: "w-10 h-10 object-cover rounded-xl shadow-md" })) : (_jsxs("div", { className: "flex flex-col items-center text-gray-500 dark:text-gray-400", children: [_jsx("p", { className: "text-sm font-medium", children: "Upload Foto" }), _jsx("p", { className: "text-xs", children: "Klik untuk memilih" })] })), _jsx("input", { type: "file", accept: "image/*", onChange: handleFotoChange, className: "hidden" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Username" }), _jsx(Input, { name: "username", value: formData.username, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Email" }), _jsx(Input, { type: "email", name: "email", value: formData.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Telepon" }), _jsx(Input, { type: "number", name: "telepon", value: formData.telepon, onChange: handleChange, className: "w-full", placeholder: "Masukkan Nomor Telepon" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Lahir" }), _jsx(DatePicker, { id: "tgl_lahir", selected: formData.tgl_lahir ? new Date(formData.tgl_lahir) : undefined, onChange: (val) => setFormData((prev) => ({ ...prev, tgl_lahir: val })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Gender" }), _jsx(Select, { options: [
                                                    { value: "laki_laki", label: "Laki-laki" },
                                                    { value: "perempuan", label: "Perempuan" },
                                                ], value: formData.gender ?? "", onChange: (val) => handleSelectChange("gender", val) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Perusahaan" }), _jsxs("select", { name: "company_id", value: formData.company_id ?? "", onChange: handleChange, disabled: isAdmin, className: `
                      w-full px-3 py-2 rounded-xl border
                      dark:bg-gray-800 dark:border-gray-600 dark:text-white
                      ${isAdmin ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                    `, children: [_jsx("option", { value: "", children: isAdmin
                                                            ? "Company -"
                                                            : "Pilih Perusahaan" }), companies.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), isAdmin && formData.company_id && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Company ditentukan oleh Superadmin" }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Role" }), _jsxs("select", { name: "role_id", value: formData.role_id ?? "", onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Role" }), roles.map((r) => (_jsx("option", { value: r.id, children: r.nama }, r.id)))] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lokasi Kantor" }), _jsxs("select", { name: "lokasi_id", value: formData.lokasi_id ?? "", onChange: handleChange, disabled: user?.dashboard_type === "superadmin" && !formData.company_id, className: "w-full px-3 py-2 rounded-xl border\n                      disabled:bg-gray-100 disabled:text-gray-400\n                      dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: user?.dashboard_type === "superadmin" && !formData.company_id
                                                            ? "Pilih perusahaan dulu"
                                                            : "Pilih Lokasi" }), lokasis.map((l) => (_jsx("option", { value: l.id, children: l.nama_lokasi }, l.id)))] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Masuk Perusahaan" }), _jsx(DatePicker, { id: "tgl_join", selected: formData.tgl_join ? new Date(formData.tgl_join) : undefined, onChange: (val) => setFormData((prev) => ({ ...prev, tgl_join: val })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status Pernikahan" }), _jsxs("select", { name: "status_nikah", value: formData.status_nikah ?? "", onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Status Nikah" }), _jsx("option", { value: "menikah", children: "Menikah" }), _jsx("option", { value: "belum_menikah", children: "Belum Menikah" }), _jsx("option", { value: "janda", children: "Janda" }), _jsx("option", { value: "duda", children: "Duda" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Divisi" }), _jsxs("select", { name: "divisi_id", value: formData.divisi_id ?? "", onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Divisi" }), divisis.map((d) => (_jsx("option", { value: d.id, children: d.nama }, d.id)))] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status Pajak" }), _jsxs("select", { name: "status_pajak", value: formData.status_pajak ?? "", onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Status Pajak" }), _jsx("option", { value: "TK/0", children: "TK/0" }), _jsx("option", { value: "TK/1", children: "TK/1" }), _jsx("option", { value: "TK/2", children: "TK/2" }), _jsx("option", { value: "TK/3", children: "TK/3" }), _jsx("option", { value: "K0", children: "K0" }), _jsx("option", { value: "K1", children: "K1" }), _jsx("option", { value: "K2", children: "K2" }), _jsx("option", { value: "K3", children: "K3" })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { children: "Dashboard" }), _jsxs("select", { name: "dashboard_type", value: formData.dashboard_type ?? "", onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "", children: "Pilih Dashboard Type" }), _jsx("option", { value: "superadmin", children: "Superadmin" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "pegawai", children: "Pegawai" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor KTP" }), _jsx(Input, { type: "number", name: "ktp", value: formData.ktp, onChange: handleChange, className: "w-full", placeholder: "Masukkan Nomor KTP" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Kartu Keluarga" }), _jsx(Input, { type: "number", name: "kartu_keluarga", value: formData.kartu_keluarga, onChange: handleChange, className: "w-full", placeholder: "Masukkan No Kartu Keluarga" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor BPJS Kesehatan" }), _jsx(Input, { type: "number", name: "bpjs_kesehatan", value: formData.bpjs_kesehatan, onChange: handleChange, className: "w-full", placeholder: "Masukkan No BPJS Kesehatan" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor BPJS Ketenagakerjaan" }), _jsx(Input, { type: "number", name: "bpjs_ketenagakerjaan", value: formData.bpjs_ketenagakerjaan, onChange: handleChange, className: "w-full", placeholder: "Masukkan No BPJS Ketenagakerjaan" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor NPWP" }), _jsx(Input, { name: "npwp", value: formData.npwp, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor SIM" }), _jsx(Input, { name: "sim", value: formData.sim, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor PKWT" }), _jsx(Input, { name: "no_pkwt", value: formData.no_pkwt, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Kontrak" }), _jsx(Input, { name: "no_kontrak", value: formData.no_kontrak, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Mulai PKWT" }), _jsx(DatePicker, { id: "tanggal_mulai_pwkt", selected: formData.tanggal_mulai_pwkt ? new Date(formData.tanggal_mulai_pwkt) : undefined, onChange: (val) => setFormData((prev) => ({ ...prev, tanggal_mulai_pwkt: val })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Berakhir PKWT" }), _jsx(DatePicker, { id: "tanggal_berakhir_pwkt", selected: formData.tanggal_berakhir_pwkt ? new Date(formData.tanggal_berakhir_pwkt) : undefined, onChange: (val) => setFormData((prev) => ({ ...prev, tanggal_berakhir_pwkt: val })) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Rekening" }), _jsx(Input, { name: "rekening", value: formData.rekening, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nama Rekening" }), _jsx(Input, { name: "nama_rekening", value: formData.nama_rekening, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { children: "Alamat" }), _jsx("textarea", { name: "alamat", value: formData.alamat, onChange: handleChange, className: "w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white h-28", placeholder: "Masukkan Alamat" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Masa Berlaku" }), _jsx(DatePicker, { id: "masa_berlaku", selected: formData.masa_berlaku ? new Date(formData.masa_berlaku) : undefined, onChange: (val) => setFormData((prev) => ({ ...prev, masa_berlaku: val })) })] })] }) }), _jsx(ComponentCard, { title: "Cuti & Izin", titleClass: "text-xl font-bold text-blue-600", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Cuti" }), _jsx(Input, { type: "number", name: "izin_cuti", value: formData.izin_cuti, onChange: handleChange, className: "w-full", placeholder: "Masukkan jumlah cuti" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Telat" }), _jsx(Input, { type: "number", name: "izin_telat", value: formData.izin_telat, onChange: handleChange, className: "w-full", placeholder: "Masukkan jumlah izin" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Masuk" }), _jsx(Input, { type: "number", name: "izin_lainnya", value: formData.izin_lainnya, onChange: handleChange, className: "w-full", placeholder: "Masukkan jumlah izin" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Pulang Cepat" }), _jsx(Input, { type: "number", name: "izin_pulang_cepat", value: formData.izin_pulang_cepat, onChange: handleChange, className: "w-full", placeholder: "Masukkan jumlah izin" })] })] }) }), _jsx(ComponentCard, { title: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xl font-bold text-black", children: "Penjumlahan Gaji" }), _jsxs("select", { value: periodeGaji, onChange: (e) => setPeriodeGaji(e.target.value), className: "\n                      rounded-lg border border-gray-300 px-2 py-1 text-sm\n                      dark:border-gray-700 dark:bg-gray-900\n                    ", children: [_jsx("option", { value: "bulan", children: "Per Bulan" }), _jsx("option", { value: "hari", children: "Per Hari" })] })] }), titleClass: "text-xl font-bold text-blue-600", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Gaji Pokok" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "gaji_pokok", value: "Rp. " + formData.gaji_pokok, onChange: handleGajiPokokChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm", children: satuanText })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Makan & Transport" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "makan_transport", value: "Rp. " + formData.makan_transport, onChange: handleMakanTransportChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm", children: satuanText })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lembur" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "lembur", value: "Rp. " + (formData.lembur), onChange: handleLemburChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: "/Jam" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Kehadiran" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "kehadiran", value: "Rp. " + (formData.kehadiran), onChange: handleKehadiranChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: satuanText })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "THR" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "thr", value: "Rp. " + (formData.thr), onChange: handleThrChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: "/Tahun" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Pribadi" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "bonus_pribadi", value: "Rp. " + (formData.bonus_pribadi), onChange: handleBonusPribadiChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: satuanText })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Team" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "bonus_team", value: "Rp. " + (formData.bonus_team), onChange: handleBonusTeamChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: satuanText })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Jackpot" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "bonus_jackpot", value: "Rp. " + (formData.bonus_jackpot), onChange: handleBonusJackpotChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: satuanText })] })] })] }) }), _jsx(ComponentCard, { title: "Pengurangan Gaji", titleClass: "text-xl font-bold text-blue-600", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Izin" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "izin", value: "Rp. " + (formData.izin), onChange: handleIzinChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: "/hari" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Terlambat" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "terlambat", value: "Rp. " + (formData.terlambat), onChange: handleTerlambatChange, className: "pr-20" }), _jsxs("select", { value: formData.terlambat_satuan, onChange: (e) => setFormData((prev) => ({
                                                            ...prev,
                                                            terlambat_satuan: e.target.value,
                                                        })), className: "absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 text-sm", children: [_jsx("option", { value: "hari", children: "/hari" }), _jsx("option", { value: "jam", children: "/jam" }), _jsx("option", { value: "menit", children: "/menit" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Mangkir" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "mangkir", value: "Rp. " + (formData.mangkir), onChange: handleMangkirChange, className: "pr-20" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm", children: "/hari" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Saldo Kasbon" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "saldo_kasbon", value: "Rp. " + (formData.saldo_kasbon), onChange: handleSaldoKasbonChange, className: "pr-20" }), _jsxs("select", { value: formData.kasbon_periode, onChange: (e) => setFormData((prev) => ({
                                                            ...prev,
                                                            kasbon_periode: e.target.value,
                                                        })), className: "absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 text-sm", children: [_jsx("option", { value: "bulan", children: "/bulan" }), _jsx("option", { value: "tahun", children: "/tahun" })] })] })] })] }) }), _jsx(ComponentCard, { title: "Tunjangan & Potongan Pajak / BPJS", titleClass: "text-xl font-bold text-blue-600", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Kesehatan" }), _jsx("div", { className: "relative", children: _jsx(Input, { name: "tungangan bpjs kesehatan", value: "Rp. " + (formData.tunjangan_bpjs_kesehatan), onChange: handleBPJSKesehatanChange, className: "pr-20" }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Ketenagakerjaan" }), _jsx("div", { className: "relative", children: _jsx(Input, { name: "tungangan bpjs ketenagakerjaan", value: "Rp. " + (formData.tunjangan_bpjs_ketenagakerjaan), onChange: handleBPJSKetenagakerjaanChange, className: "pr-20" }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Kesehatan" }), _jsx("div", { className: "relative", children: _jsx(Input, { name: "potongan bpjs kesehatan", value: "Rp. " + (formData.potongan_bpjs_kesehatan), onChange: handlePotonganBPJSKesehatanChange, className: "pr-20" }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Ketenagakerjaan" }), _jsx("div", { className: "relative", children: _jsx(Input, { name: "potongan bpjs ketenagakerjaan", value: "Rp. " + (formData.potongan_bpjs_ketenagakerjaan), onChange: handlePotonganBPJSKetenagakerjaanChange, className: "pr-20" }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tunjangan Pajak" }), _jsx("div", { className: "relative", children: _jsx(Input, { name: "tungangan pajak", value: "Rp. " + (formData.tunjangan_pajak), onChange: handleTunjanganPajakChange, className: "pr-20" }) })] })] }) }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: saving, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl", children: saving ? "Menyimpan..." : "Simpan Perubahan" }) })] })) })] }));
}
