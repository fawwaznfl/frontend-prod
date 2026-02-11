import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import FileInput from "../../components/form/input/FileInput";
import TextArea from "../../components/form/input/TextArea";
import api from "../../api/axios";
import Swal from "sweetalert2";
export default function AddPegawai() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // basic info
    const [name, setName] = useState("");
    const [fotoKaryawan, setFotoKaryawan] = useState(null);
    const [email, setEmail] = useState("");
    const [telepon, setTelepon] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fotoPreview, setFotoPreview] = useState(null);
    // lookup selects
    const [lokasiId, setLokasiId] = useState(null);
    const [divisiId, setDivisiId] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [dashboardType, setDashboardType] = useState("pegawai");
    // dates & personal
    const [tglLahir, setTglLahir] = useState(null);
    const [tglJoin, setTglJoin] = useState(null);
    const [statusNikah, setStatusNikah] = useState("single");
    const [gender, setGender] = useState("male");
    const [alamat, setAlamat] = useState("");
    // documents (numbers + files)
    const [ktpNo, setKtpNo] = useState("");
    const [kkNo, setKkNo] = useState("");
    const [ktpFile, setKtpFile] = useState(null);
    const [kkFile, setKkFile] = useState(null);
    const [bpjsKesehatanNo, setBpjsKesehatanNo] = useState("");
    const [bpjsKetenagakerjaanNo, setBpjsKetenagakerjaanNo] = useState("");
    const [npwpNo, setNpwpNo] = useState("");
    const [simNo, setSimNo] = useState("");
    const [noPkwt, setNoPkwt] = useState("");
    const [noKontrak, setNoKontrak] = useState("");
    const [tanggalMulaiPkwt, setTanggalMulaiPkwt] = useState(null);
    const [tanggalBerakhirPkwt, setTanggalBerakhirPkwt] = useState(null);
    const [masaBerlaku, setMasaBerlaku] = useState(null);
    const [rekeningNo, setRekeningNo] = useState("");
    const [namaRekening, setNamaRekening] = useState("");
    // cuti & izin
    const [cuti, setCuti] = useState(0);
    const [izinMasuk, setIzinMasuk] = useState(0);
    const [izinTelat, setIzinTelat] = useState(0);
    const [izinPulangCepat, setIzinPulangCepat] = useState(0);
    // gaji (penjumlahan)
    const [gajiPokok, setGajiPokok] = useState("0.00");
    const [makanTransport, setMakanTransport] = useState("0.00");
    const [lembur, setLembur] = useState("0.00");
    const [kehadiran100, setKehadiran100] = useState("0.00");
    const [thr, setThr] = useState("0.00");
    const [bonusPribadi, setBonusPribadi] = useState("0.00");
    const [bonusTeam, setBonusTeam] = useState("0.00");
    const [bonusJackpot, setBonusJackpot] = useState("0.00");
    // pengurangan gaji
    const [izin, setIzin] = useState("0.00");
    const [terlambat, setTerlambat] = useState("0.00");
    const [mangkir, setMangkir] = useState("0.00");
    const [saldoKasbon, setSaldoKasbon] = useState("0.00");
    // tunjangan & potongan
    const [tunjanganBpjsKesehatan, setTunjanganBpjsKesehatan] = useState("0.00");
    const [tunjanganBpjsKetenagakerjaan, setTunjanganBpjsKetenagakerjaan] = useState("0.00");
    const [potBpjsKesehatan, setPotBpjsKesehatan] = useState("0.00");
    const [potBpjsKetenagakerjaan, setPotBpjsKetenagakerjaan] = useState("0.00");
    const [tunjanganPajak, setTunjanganPajak] = useState("0.00");
    // lookup lists
    const [lokasiOptions, setLokasiOptions] = useState([]);
    const [divisiOptions, setDivisiOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    // validation state
    const [errors, setErrors] = useState({});
    useEffect(() => {
        // fetch lookup lists but safe (catch errors)
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const fetchLookups = async () => {
            try {
                const [lokRes, divRes, roleRes] = await Promise.all([
                    api.get("/lokasis", { headers }).catch(() => ({ data: [] })),
                    api.get("/divisis", { headers }).catch(() => ({ data: [] })),
                    api.get("/roles", { headers }).catch(() => ({ data: [] })),
                ]);
                // adapt to either {data: {data: []}} or raw array
                setLokasiOptions(lokRes.data?.data ?? lokRes.data ?? []);
                setDivisiOptions(divRes.data?.data ?? divRes.data ?? []);
                setRoleOptions(roleRes.data?.data ?? roleRes.data ?? []);
            }
            catch (e) {
                console.error("Lookup fetch error", e);
            }
        };
        fetchLookups();
    }, []);
    const validate = () => {
        const e = {};
        if (!name.trim())
            e.name = "Nama wajib diisi";
        if (!username.trim())
            e.username = "Username wajib diisi";
        if (!password.trim())
            e.password = "Password wajib diisi";
        if (!email.trim())
            e.email = "Email wajib diisi";
        else if (!/^\S+@\S+\.\S+$/.test(email))
            e.email = "Format email tidak valid";
        if (!telepon.trim())
            e.telepon = "Nomor telepon wajib diisi";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    // helper: ekstrak File dari File | ChangeEvent<HTMLInputElement> | null
    const extractFile = (payload) => {
        if (!payload)
            return null;
        // if component passes File directly
        if (payload instanceof File)
            return payload;
        // if component passes event
        if (payload?.target?.files)
            return payload.target.files[0] ?? null;
        // some custom FileInput might pass { file: File }
        if (payload?.file instanceof File)
            return payload.file;
        return null;
    };
    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!validate()) {
            Swal.fire("Periksa input", "Silakan lengkapi field yang wajib.", "warning");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const fd = new FormData();
            // basic
            fd.append("name", name);
            if (fotoKaryawan)
                fd.append("foto_karyawan", fotoKaryawan);
            fd.append("email", email);
            fd.append("telepon", telepon);
            fd.append("username", username);
            fd.append("password", password);
            if (lokasiId)
                fd.append("lokasi_id", String(lokasiId));
            if (divisiId)
                fd.append("divisi_id", String(divisiId));
            if (roleId)
                fd.append("role_id", String(roleId));
            fd.append("dashboard_type", dashboardType);
            if (tglLahir)
                fd.append("tgl_lahir", tglLahir);
            if (tglJoin)
                fd.append("tgl_join", tglJoin);
            fd.append("gender", gender);
            fd.append("status_nikah", statusNikah);
            if (alamat)
                fd.append("alamat", alamat);
            // documents
            if (ktpNo)
                fd.append("ktp_no", ktpNo);
            if (kkNo)
                fd.append("kk_no", kkNo);
            if (ktpFile)
                fd.append("ktp", ktpFile);
            if (kkFile)
                fd.append("kartu_keluarga", kkFile);
            if (bpjsKesehatanNo)
                fd.append("bpjs_kesehatan", bpjsKesehatanNo);
            if (bpjsKetenagakerjaanNo)
                fd.append("bpjs_ketenagakerjaan", bpjsKetenagakerjaanNo);
            if (npwpNo)
                fd.append("npwp", npwpNo);
            if (simNo)
                fd.append("sim", simNo);
            if (noPkwt)
                fd.append("no_pkwt", noPkwt);
            if (noKontrak)
                fd.append("no_kontrak", noKontrak);
            if (tanggalMulaiPkwt)
                fd.append("tanggal_mulai_pkwt", tanggalMulaiPkwt);
            if (tanggalBerakhirPkwt)
                fd.append("tanggal_berakhir_pkwt", tanggalBerakhirPkwt);
            if (masaBerlaku)
                fd.append("masa_berlaku", masaBerlaku);
            if (rekeningNo)
                fd.append("rekening", rekeningNo);
            if (namaRekening)
                fd.append("nama_rekening", namaRekening);
            // cuti & izin
            fd.append("izin_cuti", String(cuti));
            fd.append("izin_masuk", String(izinMasuk));
            fd.append("izin_telat", String(izinTelat));
            fd.append("izin_pulang_cepat", String(izinPulangCepat));
            // gaji penjumlahan
            fd.append("gaji_pokok", gajiPokok);
            fd.append("makan_transport", makanTransport);
            fd.append("lembur", lembur);
            fd.append("kehadiran", kehadiran100);
            fd.append("thr", thr);
            fd.append("bonus_pribadi", bonusPribadi);
            fd.append("bonus_team", bonusTeam);
            fd.append("bonus_jackpot", bonusJackpot);
            // pengurangan gaji
            fd.append("izin", izin);
            fd.append("terlambat", terlambat);
            fd.append("mangkir", mangkir);
            fd.append("saldo_kasbon", saldoKasbon);
            // tunjangan & potongan
            fd.append("tunjangan_bpjs_kesehatan", tunjanganBpjsKesehatan);
            fd.append("tunjangan_bpjs_ketenagakerjaan", tunjanganBpjsKetenagakerjaan);
            fd.append("pot_bpjs_kesehatan", potBpjsKesehatan);
            fd.append("pot_bpjs_ketenagakerjaan", potBpjsKetenagakerjaan);
            fd.append("tunjangan_pajak", tunjanganPajak);
            // submit
            await api.post("/pegawais", fd, {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data",
                },
            });
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pegawai berhasil ditambahkan",
                confirmButtonColor: "#3085d6",
            });
            navigate("/pegawai");
        }
        catch (err) {
            console.error("Submit pegawai error:", err);
            const msg = err?.response?.data?.message ?? "Terjadi kesalahan saat menyimpan data.";
            Swal.fire({ icon: "error", title: "Gagal", text: String(msg), confirmButtonColor: "#d33" });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Add-Pegawai", description: "Add Pegawai" }), _jsx(PageHeader, { pageTitle: "Tambah Pegawai", titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/pegawai"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsxs("div", { className: "space-y-6 mt-4", children: [_jsx(ComponentCard, { title: "Data Pribadi", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "Nama pegawai *" }), _jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "Nama lengkap" }), errors.name && _jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.name })] }), _jsxs("div", { children: [_jsx(Label, { children: "Foto pegawai" }), _jsx(FileInput, { onChange: (payload) => {
                                                const f = extractFile(payload);
                                                if (!f)
                                                    return;
                                                // Validasi tipe file
                                                const allowedTypes = ["image/jpeg", "image/png"];
                                                if (!allowedTypes.includes(f.type)) {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "Format tidak didukung",
                                                        text: "File harus JPG atau PNG!",
                                                    });
                                                    return;
                                                }
                                                //  Validasi ukuran max 3MB
                                                const maxSize = 2 * 1024 * 1024;
                                                if (f.size > maxSize) {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "File terlalu besar",
                                                        text: "Ukuran file maksimal 3MB!",
                                                    });
                                                    return;
                                                }
                                                setFotoKaryawan(f);
                                                // Preview
                                                const previewUrl = URL.createObjectURL(f);
                                                setFotoPreview(previewUrl);
                                            } }), fotoPreview && (_jsx("img", { src: fotoPreview, alt: "Preview Foto", className: "w-24 h-24 object-cover rounded-lg mt-2 border" })), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "JPEG/PNG, max 3MB" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Email *" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "email@domain.com" }), errors.email && _jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.email })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Handphone *" }), _jsx(Input, { value: telepon, onChange: (e) => setTelepon(e.target.value), placeholder: "08xxxxxxxxxx" }), errors.telepon && _jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.telepon })] }), _jsxs("div", { children: [_jsx(Label, { children: "Username *" }), _jsx(Input, { value: username, onChange: (e) => setUsername(e.target.value), placeholder: "username" }), errors.username && _jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.username })] }), _jsxs("div", { children: [_jsx(Label, { children: "Password *" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password" }), errors.password && _jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.password })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lokasi Kantor" }), _jsx(Select, { options: lokasiOptions.map((l) => ({ value: String(l.id), label: l.name })), placeholder: "Pilih lokasi", onChange: (val) => setLokasiId(val ? Number(val) : null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Lahir" }), _jsx(DatePicker, { id: "tgl_lahir", placeholder: "Pilih tanggal", onChange: (value) => setTglLahir(value || null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Masuk Perusahaan" }), _jsx(DatePicker, { id: "tgl_join", placeholder: "Pilih tanggal", onChange: (value) => setTglJoin(value || null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Role" }), _jsx(Select, { options: roleOptions.map((r) => ({ value: String(r.id), label: r.name })), placeholder: "Pilih role", onChange: (val) => setRoleId(val ? Number(val) : null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Gender" }), _jsx(Select, { options: [
                                                { value: "male", label: "Male" },
                                                { value: "female", label: "Female" },
                                                { value: "other", label: "Other" },
                                            ], placeholder: "Pilih gender", onChange: (val) => setGender(val) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Dashboard" }), _jsx(Select, { options: [
                                                { value: "superadmin", label: "Superadmin" },
                                                { value: "admin", label: "Admin" },
                                                { value: "pegawai", label: "Pegawai" },
                                            ], placeholder: "Pilih dashboard", onChange: (val) => setDashboardType(val), defaultValue: dashboardType })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status Pernikahan" }), _jsx(Select, { options: [
                                                { value: "single", label: "Single" },
                                                { value: "married", label: "Married" },
                                            ], placeholder: "Pilih status", onChange: (val) => setStatusNikah(val) })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { children: "Alamat" }), _jsx(TextArea, { rows: 3, value: alamat, onChange: (v) => setAlamat(v) })] })] }) }), _jsx(ComponentCard, { title: "Dokumen & Kontrak", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "Nomor KTP" }), _jsx(Input, { value: ktpNo, onChange: (e) => setKtpNo(e.target.value), placeholder: "Nomor KTP" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Upload KTP" }), _jsx(FileInput, { onChange: (payload) => setKtpFile(extractFile(payload)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Kartu Keluarga" }), _jsx(Input, { value: kkNo, onChange: (e) => setKkNo(e.target.value), placeholder: "Nomor KK" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Upload Kartu Keluarga" }), _jsx(FileInput, { onChange: (payload) => setKkFile(extractFile(payload)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor BPJS Kesehatan" }), _jsx(Input, { value: bpjsKesehatanNo, onChange: (e) => setBpjsKesehatanNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor BPJS Ketenagakerjaan" }), _jsx(Input, { value: bpjsKetenagakerjaanNo, onChange: (e) => setBpjsKetenagakerjaanNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor NPWP" }), _jsx(Input, { value: npwpNo, onChange: (e) => setNpwpNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor SIM" }), _jsx(Input, { value: simNo, onChange: (e) => setSimNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor PKWT" }), _jsx(Input, { value: noPkwt, onChange: (e) => setNoPkwt(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Kontrak" }), _jsx(Input, { value: noKontrak, onChange: (e) => setNoKontrak(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Mulai PKWT" }), _jsx(DatePicker, { id: "tanggal_mulai_pkwt", placeholder: "Pilih tanggal", onChange: (value) => setTanggalMulaiPkwt(value || null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Berakhir PKWT" }), _jsx(DatePicker, { id: "tanggal_berakhir_pkwt", placeholder: "Pilih tanggal", onChange: (value) => setTanggalBerakhirPkwt(value || null) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Rekening" }), _jsx(Input, { value: rekeningNo, onChange: (e) => setRekeningNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nama Pemilik Rekening" }), _jsx(Input, { value: namaRekening, onChange: (e) => setNamaRekening(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Masa Berlaku" }), _jsx(DatePicker, { id: "masa_berlaku", placeholder: "Pilih tanggal", onChange: (value) => setMasaBerlaku(value || null) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Cuti & Izin", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Cuti" }), _jsx(Input, { type: "number", value: String(cuti), onChange: (e) => setCuti(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Masuk" }), _jsx(Input, { type: "number", value: String(izinMasuk), onChange: (e) => setIzinMasuk(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Telat" }), _jsx(Input, { type: "number", value: String(izinTelat), onChange: (e) => setIzinTelat(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Pulang Cepat" }), _jsx(Input, { type: "number", value: String(izinPulangCepat), onChange: (e) => setIzinPulangCepat(Number(e.target.value)) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Penjumlahan Gaji", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Gaji Pokok" }), _jsx(Input, { value: gajiPokok, onChange: (e) => setGajiPokok(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Makan & Transport" }), _jsx(Input, { value: makanTransport, onChange: (e) => setMakanTransport(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lembur" }), _jsx(Input, { value: lembur, onChange: (e) => setLembur(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "100% Kehadiran" }), _jsx(Input, { value: kehadiran100, onChange: (e) => setKehadiran100(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "THR" }), _jsx(Input, { value: thr, onChange: (e) => setThr(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Pribadi" }), _jsx(Input, { value: bonusPribadi, onChange: (e) => setBonusPribadi(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Team" }), _jsx(Input, { value: bonusTeam, onChange: (e) => setBonusTeam(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Jackpot" }), _jsx(Input, { value: bonusJackpot, onChange: (e) => setBonusJackpot(e.target.value) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Pengurangan Gaji", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Izin (Rp)" }), _jsx(Input, { value: izin, onChange: (e) => setIzin(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Terlambat (Rp)" }), _jsx(Input, { value: terlambat, onChange: (e) => setTerlambat(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Mangkir (Rp)" }), _jsx(Input, { value: mangkir, onChange: (e) => setMangkir(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Saldo Kasbon (Rp)" }), _jsx(Input, { value: saldoKasbon, onChange: (e) => setSaldoKasbon(e.target.value) })] })] }) }), _jsx(ComponentCard, { title: "Tunjangan & Potongan Pajak / BPJS", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Kesehatan" }), _jsx(Input, { value: tunjanganBpjsKesehatan, onChange: (e) => setTunjanganBpjsKesehatan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Ketenagakerjaan" }), _jsx(Input, { value: tunjanganBpjsKetenagakerjaan, onChange: (e) => setTunjanganBpjsKetenagakerjaan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Kesehatan" }), _jsx(Input, { value: potBpjsKesehatan, onChange: (e) => setPotBpjsKesehatan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Ketenagakerjaan" }), _jsx(Input, { value: potBpjsKetenagakerjaan, onChange: (e) => setPotBpjsKetenagakerjaan(e.target.value) })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { children: "Tunjangan Pajak (Gross Up)" }), _jsx(Input, { value: tunjanganPajak, onChange: (e) => setTunjanganPajak(e.target.value) })] })] }) }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleSubmit, disabled: loading, className: `px-6 py-2 rounded-xl text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`, children: loading ? "Menyimpan..." : "Simpan Pegawai" }) })] })] }));
}
