import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
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
import Swal from "sweetalert2";
export default function PegawaiForm({ initialValues, formTitle = "Tambah Pegawai", onSubmit, }) {
    const navigate = useNavigate();
    // ===== STATE DATA PRIBADI =====
    const [name, setName] = useState(initialValues?.name ?? "");
    const [fotoPreview, setFotoPreview] = useState(initialValues?.fotoPreview ?? null);
    const [fotoFile, setFotoFile] = useState(null);
    const [email, setEmail] = useState(initialValues?.email ?? "");
    const [telepon, setTelepon] = useState(initialValues?.telepon ?? "");
    const [username, setUsername] = useState(initialValues?.username ?? "");
    const [statuspajak, setPassword] = useState(""); // kosongkan saat edit
    const [lokasiId, setLokasiId] = useState(initialValues?.lokasiId?.toString() ?? null);
    const [divisiId, setDivisiId] = useState(initialValues?.divisiId?.toString() ?? null);
    const [roleId, setRoleId] = useState(initialValues?.roleId?.toString() ?? null);
    const [dashboardType, setDashboardType] = useState(initialValues?.dashboardType ?? "pegawai");
    const [tglLahir, setTglLahir] = useState(initialValues?.tglLahir ?? null);
    const [tglJoin, setTglJoin] = useState(initialValues?.tglJoin ?? null);
    const [statusNikah, setStatusNikah] = useState(initialValues?.statusNikah ?? "single");
    const [gender, setGender] = useState(initialValues?.gender ?? "male");
    const [alamat, setAlamat] = useState(initialValues?.alamat ?? "");
    // ===== TUNJANGAN & POTONGAN =====
    const [tunjanganBpjsKesehatan, setTunjanganBpjsKesehatan] = useState(initialValues?.tunjanganBpjsKesehatan ?? "0.00");
    const [tunjanganBpjsKetenagakerjaan, setTunjanganBpjsKetenagakerjaan] = useState(initialValues?.tunjanganBpjsKetenagakerjaan ?? "0.00");
    const [potBpjsKesehatan, setPotBpjsKesehatan] = useState(initialValues?.potBpjsKesehatan ?? "0.00");
    const [potBpjsKetenagakerjaan, setPotBpjsKetenagakerjaan] = useState(initialValues?.potBpjsKetenagakerjaan ?? "0.00");
    const [tunjanganPajak, setTunjanganPajak] = useState(initialValues?.tunjanganPajak ?? "0.00");
    // ===== PENJUMLAHAN GAJI =====
    const [gajiPokok, setGajiPokok] = useState(initialValues?.gajiPokok ?? "0.00");
    const [makanTransport, setMakanTransport] = useState(initialValues?.makanTransport ?? "0.00");
    const [lembur, setLembur] = useState(initialValues?.lembur ?? "0.00");
    const [kehadiran100, setKehadiran100] = useState(initialValues?.kehadiran100 ?? "0.00");
    const [thr, setThr] = useState(initialValues?.thr ?? "0.00");
    const [bonusPribadi, setBonusPribadi] = useState(initialValues?.bonusPribadi ?? "0.00");
    const [bonusTeam, setBonusTeam] = useState(initialValues?.bonusTeam ?? "0.00");
    const [bonusJackpot, setBonusJackpot] = useState(initialValues?.bonusJackpot ?? "0.00");
    // ===== CUTI & IZIN =====
    const [cuti, setCuti] = useState(initialValues?.cuti ?? 0);
    const [izinMasuk, setIzinMasuk] = useState(initialValues?.izinMasuk ?? 0);
    const [izinTelat, setIzinTelat] = useState(initialValues?.izinTelat ?? 0);
    const [izinPulangCepat, setIzinPulangCepat] = useState(initialValues?.izinPulangCepat ?? 0);
    // ===== PENGURANGAN GAJI =====
    const [izin, setIzin] = useState(initialValues?.izin ?? "0.00");
    const [terlambat, setTerlambat] = useState(initialValues?.terlambat ?? "0.00");
    const [mangkir, setMangkir] = useState(initialValues?.mangkir ?? "0.00");
    const [saldoKasbon, setSaldoKasbon] = useState(initialValues?.saldoKasbon ?? "0.00");
    // ===== DOKUMEN =====
    const [ktpNo, setKtpNo] = useState(initialValues?.ktpNo ?? "");
    const [kkNo, setKkNo] = useState(initialValues?.kkNo ?? "");
    const [ktpFile, setKtpFile] = useState(initialValues?.ktpFile ?? null);
    const [kkFile, setKkFile] = useState(initialValues?.kkFile ?? null);
    const [bpjsKesehatanNo, setBpjsKesehatanNo] = useState(initialValues?.bpjsKesehatanNo ?? "");
    const [bpjsKetenagakerjaanNo, setBpjsKetenagakerjaanNo] = useState(initialValues?.bpjsKetenagakerjaanNo ?? "");
    const [npwpNo, setNpwpNo] = useState(initialValues?.npwpNo ?? "");
    const [simNo, setSimNo] = useState(initialValues?.simNo ?? "");
    const [noPkwt, setNoPkwt] = useState(initialValues?.noPkwt ?? "");
    const [noKontrak, setNoKontrak] = useState(initialValues?.noKontrak ?? "");
    const [tanggalMulaiPkwt, setTanggalMulaiPkwt] = useState(initialValues?.tanggalMulaiPkwt ?? null);
    const [tanggalBerakhirPkwt, setTanggalBerakhirPkwt] = useState(initialValues?.tanggalBerakhirPkwt ?? null);
    const [masaBerlaku, setMasaBerlaku] = useState(initialValues?.masaBerlaku ?? null);
    const [rekeningNo, setRekeningNo] = useState(initialValues?.rekeningNo ?? "");
    const [namaRekening, setNamaRekening] = useState(initialValues?.namaRekening ?? "");
    // ===== OPTIONS DUMMY =====
    const lokasiOptions = [
        { value: "1", label: "Jakarta" },
        { value: "2", label: "Bandung" },
    ];
    const divisiOptions = [
        { value: "1", label: "IT" },
        { value: "2", label: "HR" },
    ];
    const roleOptions = [
        { value: "1", label: "Admin" },
        { value: "2", label: "Pegawai" },
    ];
    // ===== FUNCTIONS =====
    const handleFotoChange = (payload) => {
        const f = payload?.target?.files?.[0] ?? null;
        if (!f)
            return;
        const previewUrl = URL.createObjectURL(f);
        setFotoPreview(previewUrl);
        setFotoFile(f);
    };
    const extractFile = (payload) => {
        if (!payload)
            return null;
        if (payload instanceof File)
            return payload;
        if (payload?.target?.files)
            return payload.target.files[0] ?? null;
        if (payload?.file instanceof File)
            return payload.file;
        return null;
    };
    const handleSubmit = async () => {
        if (!onSubmit) {
            Swal.fire("Info", "UI demo, belum tersambung backend", "info");
            return;
        }
        await onSubmit({
            name,
            fotoFile,
            email,
            telepon,
            username,
            statuspajak,
            lokasiId,
            divisiId,
            roleId,
            dashboardType,
            tglLahir,
            tglJoin,
            statusNikah,
            gender,
            alamat,
            tunjanganBpjsKesehatan,
            tunjanganBpjsKetenagakerjaan,
            potBpjsKesehatan,
            potBpjsKetenagakerjaan,
            tunjanganPajak,
            gajiPokok,
            makanTransport,
            lembur,
            kehadiran100,
            thr,
            bonusPribadi,
            bonusTeam,
            bonusJackpot,
            cuti,
            izinMasuk,
            izinTelat,
            izinPulangCepat,
            izin,
            terlambat,
            mangkir,
            saldoKasbon,
            ktpNo,
            kkNo,
            ktpFile,
            kkFile,
            bpjsKesehatanNo,
            bpjsKetenagakerjaanNo,
            npwpNo,
            simNo,
            noPkwt,
            noKontrak,
            tanggalMulaiPkwt,
            tanggalBerakhirPkwt,
            masaBerlaku,
            rekeningNo,
            namaRekening,
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: formTitle, description: formTitle }), _jsx(PageHeader, { pageTitle: formTitle, titleClass: "text-[32px] dark:text-white", rightContent: _jsx("button", { onClick: () => navigate("/pegawai"), className: "bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl", children: "\u2B05 Back" }) }), _jsxs("div", { className: "space-y-6 mt-4", children: [_jsx(ComponentCard, { title: "Data Pribadi", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "Nama Pegawai *" }), _jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Foto Pegawai" }), _jsx(FileInput, { onChange: handleFotoChange }), fotoPreview && _jsx("img", { src: fotoPreview, className: "w-24 h-24 object-cover mt-2 border rounded-lg" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Email *" }), _jsx(Input, { value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Telepon *" }), _jsx(Input, { value: telepon, onChange: (e) => setTelepon(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Username *" }), _jsx(Input, { value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status Pajak" }), _jsx(Input, { type: "", value: statuspajak, onChange: (e) => setPassword(e.target.value), placeholder: "Kosongkan jika tidak diubah" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lokasi Kantor" }), _jsx(Select, { options: lokasiOptions, onChange: setLokasiId, defaultValue: lokasiId ?? undefined })] }), _jsxs("div", { children: [_jsx(Label, { children: "Divisi" }), _jsx(Select, { options: divisiOptions, onChange: setDivisiId, defaultValue: divisiId ?? undefined })] }), _jsxs("div", { children: [_jsx(Label, { children: "Role" }), _jsx(Select, { options: roleOptions, onChange: setRoleId, defaultValue: roleId ?? undefined })] }), _jsxs("div", { children: [_jsx(Label, { children: "Dashboard" }), _jsx(Select, { options: [
                                                { value: "superadmin", label: "Superadmin" },
                                                { value: "admin", label: "Admin" },
                                                { value: "pegawai", label: "Pegawai" },
                                            ], onChange: setDashboardType, defaultValue: dashboardType })] }), _jsxs("div", { children: [_jsx(Label, { children: "Gender" }), _jsx(Select, { options: [
                                                { value: "male", label: "Male" },
                                                { value: "female", label: "Female" },
                                                { value: "other", label: "Other" },
                                            ], onChange: setGender, defaultValue: gender })] }), _jsxs("div", { children: [_jsx(Label, { children: "Status Pernikahan" }), _jsx(Select, { options: [
                                                { value: "single", label: "Single" },
                                                { value: "married", label: "Married" },
                                            ], onChange: setStatusNikah, defaultValue: statusNikah })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Lahir" }), _jsx(DatePicker, { id: "tgl_lahir", selected: tglLahir ? new Date(tglLahir) : undefined, onChange: (value) => setTglLahir(value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Join" }), _jsx(DatePicker, { id: "tgl_join", selected: tglJoin ? new Date(tglJoin) : undefined, onChange: (value) => setTglJoin(value) })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { children: "Alamat" }), _jsx(TextArea, { rows: 3, value: alamat, onChange: setAlamat })] })] }) }), _jsx(ComponentCard, { title: "Dokumen & Kontrak", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "Nomor KTP" }), _jsx(Input, { value: ktpNo, onChange: (e) => setKtpNo(e.target.value), placeholder: "Nomor KTP" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Upload KTP" }), _jsx(FileInput, { onChange: (payload) => setKtpFile(extractFile(payload)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor KK" }), _jsx(Input, { value: kkNo, onChange: (e) => setKkNo(e.target.value), placeholder: "Nomor KK" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Upload KK" }), _jsx(FileInput, { onChange: (payload) => setKkFile(extractFile(payload)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "BPJS Kesehatan" }), _jsx(Input, { value: bpjsKesehatanNo, onChange: (e) => setBpjsKesehatanNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "BPJS Ketenagakerjaan" }), _jsx(Input, { value: bpjsKetenagakerjaanNo, onChange: (e) => setBpjsKetenagakerjaanNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "NPWP" }), _jsx(Input, { value: npwpNo, onChange: (e) => setNpwpNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "SIM" }), _jsx(Input, { value: simNo, onChange: (e) => setSimNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor PKWT" }), _jsx(Input, { value: noPkwt, onChange: (e) => setNoPkwt(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Kontrak" }), _jsx(Input, { value: noKontrak, onChange: (e) => setNoKontrak(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Mulai PKWT" }), _jsx(DatePicker, { id: "tanggal_mulai_pkwt", selected: tanggalMulaiPkwt ? new Date(tanggalMulaiPkwt) : undefined, onChange: (value) => setTanggalMulaiPkwt(value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tanggal Berakhir PKWT" }), _jsx(DatePicker, { id: "tanggal_berakhir_pkwt", placeholder: "Pilih tanggal", onChange: (value) => setTanggalBerakhirPkwt(value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nomor Rekening" }), _jsx(Input, { value: rekeningNo, onChange: (e) => setRekeningNo(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Nama Rekening" }), _jsx(Input, { value: namaRekening, onChange: (e) => setNamaRekening(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Masa Berlaku" }), _jsx(DatePicker, { id: "masa_berlaku", placeholder: "Pilih tanggal", onChange: (value) => setMasaBerlaku(value) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Cuti & Izin", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Cuti" }), _jsx(Input, { type: "number", value: String(cuti), onChange: (e) => setCuti(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Masuk" }), _jsx(Input, { type: "number", value: String(izinMasuk), onChange: (e) => setIzinMasuk(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Telat" }), _jsx(Input, { type: "number", value: String(izinTelat), onChange: (e) => setIzinTelat(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Izin Pulang Cepat" }), _jsx(Input, { type: "number", value: String(izinPulangCepat), onChange: (e) => setIzinPulangCepat(Number(e.target.value)) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Penjumlahan Gaji", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Gaji Pokok" }), _jsx(Input, { value: gajiPokok, onChange: (e) => setGajiPokok(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Makan & Transport" }), _jsx(Input, { value: makanTransport, onChange: (e) => setMakanTransport(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Lembur" }), _jsx(Input, { value: lembur, onChange: (e) => setLembur(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "100% Kehadiran" }), _jsx(Input, { value: kehadiran100, onChange: (e) => setKehadiran100(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "THR" }), _jsx(Input, { value: thr, onChange: (e) => setThr(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Pribadi" }), _jsx(Input, { value: bonusPribadi, onChange: (e) => setBonusPribadi(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Team" }), _jsx(Input, { value: bonusTeam, onChange: (e) => setBonusTeam(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Bonus Jackpot" }), _jsx(Input, { value: bonusJackpot, onChange: (e) => setBonusJackpot(e.target.value) })] })] }) }), _jsx(ComponentCard, { title: "Komponen Pengurangan Gaji", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Izin (Rp)" }), _jsx(Input, { value: izin, onChange: (e) => setIzin(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Terlambat (Rp)" }), _jsx(Input, { value: terlambat, onChange: (e) => setTerlambat(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Mangkir (Rp)" }), _jsx(Input, { value: mangkir, onChange: (e) => setMangkir(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Saldo Kasbon (Rp)" }), _jsx(Input, { value: saldoKasbon, onChange: (e) => setSaldoKasbon(e.target.value) })] })] }) }), _jsx(ComponentCard, { title: "Tunjangan & Potongan Pajak / BPJS", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Kesehatan" }), _jsx(Input, { value: tunjanganBpjsKesehatan, onChange: (e) => setTunjanganBpjsKesehatan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tunjangan BPJS Ketenagakerjaan" }), _jsx(Input, { value: tunjanganBpjsKetenagakerjaan, onChange: (e) => setTunjanganBpjsKetenagakerjaan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Kesehatan" }), _jsx(Input, { value: potBpjsKesehatan, onChange: (e) => setPotBpjsKesehatan(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Potongan BPJS Ketenagakerjaan" }), _jsx(Input, { value: potBpjsKetenagakerjaan, onChange: (e) => setPotBpjsKetenagakerjaan(e.target.value) })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { children: "Tunjangan Pajak (Gross Up)" }), _jsx(Input, { value: tunjanganPajak, onChange: (e) => setTunjanganPajak(e.target.value) })] })] }) }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleSubmit, className: "px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700", children: "Simpan Pegawai" }) })] })] }));
}
