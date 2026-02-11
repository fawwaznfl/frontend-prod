import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageHeader from "../PageHeader";
import ComponentCard from "../components/common/ComponentCard";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [photoFile, setPhotoFile] = useState(null);
    const navigate = useNavigate();
    const [photoPreview, setPhotoPreview] = useState("");
    // Fetch Profile
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            // Gunakan endpoint user/profile untuk halaman profile
            const res = await api.get("/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data.data);
            setFormData(res.data.data);
            // Simpan user_id untuk penggunaan selanjutnya
            if (res.data.data?.id) {
                localStorage.setItem("user_id", res.data.data.id);
            }
            // Handle foto karyawan - sudah ada full URL dari backend
            if (res.data.data.foto_karyawan_url) {
                setPhotoPreview(res.data.data.foto_karyawan_url);
            }
            else if (res.data.data.foto_karyawan) {
                setPhotoPreview(`${import.meta.env.VITE_API_URL}/storage/${res.data.data.foto_karyawan}`);
            }
        }
        catch (err) {
            console.error("Error fetching profile:", err);
            Swal.fire("Error", "Gagal memuat data profil", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // Handle Photo Change
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };
    // Handle Update Profile
    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            // Append text fields
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, String(formData[key]));
                }
            });
            // Append photo if changed
            if (photoFile) {
                formDataToSend.append("foto_karyawan", photoFile);
            }
            // Gunakan endpoint user/profile untuk update
            await api.post("/user/profile", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Berhasil!", "Profil berhasil diperbarui", "success");
            setIsEditing(false);
            fetchProfile();
        }
        catch (err) {
            console.error("Error updating profile:", err);
            Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui profil", "error");
        }
    };
    // Calculate Masa Kerja
    const calculateMasaKerja = (tglJoin) => {
        if (!tglJoin)
            return "-";
        const joinDate = new Date(tglJoin);
        const today = new Date();
        let years = today.getFullYear() - joinDate.getFullYear();
        let months = today.getMonth() - joinDate.getMonth();
        let days = today.getDate() - joinDate.getDate();
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} Tahun, ${months} Bulan, ${days} Hari.`;
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Loading..." }) }));
    }
    if (!profile) {
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("p", { className: "text-gray-700 dark:text-gray-300", children: "Data profil tidak ditemukan" }) }));
    }
    const formatRupiahPerBulan = (value) => {
        if (value === null || value === undefined || value === "")
            return "-";
        return `Rp ${Number(value).toLocaleString("id-ID")} / Bulan`;
    };
    const formatRupiahPerJam = (value) => {
        if (value === null || value === undefined || value === "")
            return "-";
        return `Rp ${Number(value).toLocaleString("id-ID")} / Jam`;
    };
    const formatRupiahPerHari = (value) => {
        if (value === null || value === undefined || value === "")
            return "-";
        return `Rp ${Number(value).toLocaleString("id-ID")} / Hari`;
    };
    const formatRupiahPerTahun = (value) => {
        if (value === null || value === undefined || value === "")
            return "-";
        return `Rp ${Number(value).toLocaleString("id-ID")} / Tahun`;
    };
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "My Profile", description: "Profil Saya" }), _jsx(PageHeader, { pageTitle: "My Profile", titleClass: "text-[32px] dark:text-white" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-48 h-48 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden mb-4", children: photoPreview ? (_jsx("img", { src: photoPreview, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-32 h-32 bg-white dark:bg-gray-400 rounded-full" })) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-1", children: profile.name }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: profile.divisi_name || "-" }), _jsxs("div", { className: "w-full space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: "Email" }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: profile.email })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: "Username" }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: profile.username })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: "Telepon" }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: profile.telepon || "-" })] })] })] }) }), _jsx(ComponentCard, { className: "dark:bg-gray-800 dark:border-gray-700 lg:col-span-2", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nama Pegawai" }), _jsx("input", { type: "text", name: "name", value: formData.name || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor Handphone" }), _jsx("input", { type: "text", name: "telepon", value: formData.telepon || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Username" }), _jsx("input", { type: "text", name: "username", value: formData.username || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Lokasi Kantor" }), _jsx("input", { type: "text", value: profile.lokasi_name || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Lahir" }), _jsx("input", { type: "date", name: "tgl_lahir", value: formData.tgl_lahir ? new Date(formData.tgl_lahir).toISOString().split('T')[0] : "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Alamat" }), _jsx("textarea", { name: "alamat", value: formData.alamat || "", onChange: handleInputChange, disabled: !isEditing, rows: 1, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Masuk Perusahaan" }), _jsx("input", { type: "date", name: "tgl_join", value: formData.tgl_join ? new Date(formData.tgl_join).toISOString().split('T')[0] : "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Masa Kerja" }), _jsx("input", { type: "text", value: calculateMasaKerja(profile.tgl_join), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Gender" }), _jsxs("select", { name: "gender", value: formData.gender || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600", children: [_jsx("option", { value: "", children: "Pilih Gender" }), _jsx("option", { value: "Laki-laki", children: "Laki-Laki" }), _jsx("option", { value: "Perempuan", children: "Perempuan" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Level User" }), _jsx("input", { type: "text", value: profile.dashboard_type || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Status Pernikahan" }), _jsxs("select", { name: "status_nikah", value: formData.status_nikah || "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600", children: [_jsx("option", { value: "", children: "Pilih Status" }), _jsx("option", { value: "TK/0", children: "TK/0" }), _jsx("option", { value: "TK/1", children: "TK/1" }), _jsx("option", { value: "TK/2", children: "TK/2" }), _jsx("option", { value: "TK/3", children: "TK/3" }), _jsx("option", { value: "K0", children: "K0" }), _jsx("option", { value: "K1", children: "K1" }), _jsx("option", { value: "K2", children: "K2" }), _jsx("option", { value: "K3", children: "K3" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Divisi" }), _jsx("input", { type: "text", value: profile.divisi_name || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Status Pajak" }), _jsx("input", { type: "text", value: profile.status_pajak || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor KTP" }), _jsx("input", { type: "text", value: profile.ktp || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor Kartu Keluarga" }), _jsx("input", { type: "text", value: profile.kartu_keluarga || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor BPJS Kesehatan" }), _jsx("input", { type: "text", value: profile.bpjs_kesehatan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor BPJS Ketenagakerjaan" }), _jsx("input", { type: "text", value: profile.bpjs_ketenagakerjaan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor NPWP" }), _jsx("input", { type: "text", value: profile.npwp || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor SIM" }), _jsx("input", { type: "text", value: profile.sim || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor PKWT" }), _jsx("input", { type: "text", value: profile.no_pkwt || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor Kontrak" }), _jsx("input", { type: "text", value: profile.no_kontrak || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Mulai PKWT" }), _jsx("input", { type: "date", name: "tanggal_mulai_pwkt", value: formData.tanggal_mulai_pwkt ? new Date(formData.tanggal_mulai_pwkt).toISOString().split('T')[0] : "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tanggal Mulai PKWT" }), _jsx("input", { type: "date", name: "tanggal_berakhir_pwkt", value: formData.tanggal_berakhir_pwkt ? new Date(formData.tanggal_berakhir_pwkt).toISOString().split('T')[0] : "", onChange: handleInputChange, disabled: !isEditing, className: "w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor Rekening" }), _jsx("input", { type: "text", value: profile.rekening || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Nomor Nama" }), _jsx("input", { type: "text", value: profile.nama_rekening || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsx(ComponentCard, { title: "Cuti & Izin", titleClass: "text-xl font-bold text-blue-600", className: "lg:col-span-2", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Cuti" }), _jsx("input", { type: "text", value: profile.izin_cuti || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Izin Masuk" }), _jsx("input", { type: "text", value: profile.izin_lainnya || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Izin Telat" }), _jsx("input", { type: "text", value: profile.izin_telat || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Izin Pulang Cepat" }), _jsx("input", { type: "text", value: profile.izin_pulang_cepat || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] })] }) }), _jsx(ComponentCard, { title: "Penjumlahan Gaji", titleClass: "text-xl font-bold text-blue-600", className: "lg:col-span-2", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Gaji Pokok" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.gaji_pokok), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Makan & Transport" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.makan_transport), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "lembur" }), _jsx("input", { type: "text", value: formatRupiahPerJam(profile.lembur), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "100% Kehadiran" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.kehadiran), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "THR" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.thr), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Bonus Pribadi" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.bonus_pribadi), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Bonus Team" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.bonus_team), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Bonus Jackpot" }), _jsx("input", { type: "text", value: formatRupiahPerBulan(profile.bonus_jackpot), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] })] }) }), _jsx(ComponentCard, { title: "Pengurangan Gaji", titleClass: "text-xl font-bold text-blue-600", className: "lg:col-span-2", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Izin" }), _jsx("input", { type: "text", value: formatRupiahPerHari(profile.izin), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Terlambat" }), _jsx("input", { type: "text", value: formatRupiahPerHari(profile.terlambat), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Mangkir" }), _jsx("input", { type: "text", value: formatRupiahPerHari(profile.mangkir), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Saldo Kasbon" }), _jsx("input", { type: "text", value: formatRupiahPerTahun(profile.saldo_kasbon), disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] })] }) }), _jsx(ComponentCard, { title: "Tunjangan & Potongan Pajak / BPJS", titleClass: "text-xl font-bold text-blue-600", className: "lg:col-span-2", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tunjangan BPJS Kesehatan" }), _jsx("input", { type: "text", value: profile.tunjangan_bpjs_kesehatan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tunjangan BPJS Ketenagakerjaan" }), _jsx("input", { type: "text", value: profile.tunjangan_bpjs_ketenagakerjaan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Potongan BPJS Kesehatan" }), _jsx("input", { type: "text", value: profile.potongan_bpjs_kesehatan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Potongan BPJS Ketenagakerjaan" }), _jsx("input", { type: "text", value: profile.potongan_bpjs_ketenagakerjaan || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-gray-900 dark:text-white", children: "Tunjangan Pajak (Gross Up)" }), _jsx("input", { type: "text", value: profile.tunjangan_pajak || "-", disabled: true, className: "w-full border px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white" })] })] }) })] }) })] })] }));
}
