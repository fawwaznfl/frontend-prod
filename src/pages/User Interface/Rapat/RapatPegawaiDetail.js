import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../../api/axios";
import Swal from "sweetalert2";
export default function RapatPegawaiDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rapat, setRapat] = useState(null);
    const [activeTab, setActiveTab] = useState("detail");
    const [isHadir, setIsHadir] = useState(false);
    const [loadingHadir, setLoadingHadir] = useState(false);
    const pegawais = rapat?.pegawais ?? [];
    const totalPeserta = pegawais.length;
    const jumlahHadir = pegawais.filter((p) => p.pivot?.waktu_hadir).length;
    const jumlahTidakHadir = totalPeserta - jumlahHadir;
    useEffect(() => {
        api.get(`/rapat/${id}`).then((res) => {
            const data = res.data.data;
            setRapat(data);
            const pegawaiLoginId = data.auth_pegawai_id;
            const peserta = data.pegawais.find((p) => p.id === pegawaiLoginId);
            if (peserta?.pivot?.waktu_hadir) {
                setIsHadir(true);
            }
        });
    }, [id]);
    if (!rapat) {
        return _jsx("p", { className: "p-4 text-center", children: "Memuat detail rapat..." });
    }
    const formatTanggalWaktu = (tanggalISO, waktu) => {
        const date = new Date(tanggalISO);
        const tanggalFormatted = date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const jamFormatted = waktu.slice(0, 5).replace(":", ".");
        return `${tanggalFormatted}, ${jamFormatted}`;
    };
    const handleHadir = async () => {
        try {
            setLoadingHadir(true);
            await api.post(`/rapat/${id}/hadir`);
            setIsHadir(true);
            Swal.fire({
                icon: "success",
                title: "Berhasil Hadir",
                text: "Kehadiran kamu berhasil dicatat",
                timer: 2000,
                showConfirmButton: false,
            });
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.response?.data?.message ||
                    "Gagal melakukan absensi hadir",
            });
        }
        finally {
            setLoadingHadir(false);
        }
    };
    const handleNotulen = async () => {
        const { value: notulen } = await Swal.fire({
            title: "Notulen Rapat",
            input: "textarea",
            inputLabel: "Isi notulen rapat",
            inputPlaceholder: "Tulis notulen di sini...",
            inputValue: rapat?.notulen || "",
            inputAttributes: {
                rows: "6",
            },
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "bg-indigo-600 text-white",
            },
            inputValidator: (value) => {
                if (!value)
                    return "Notulen tidak boleh kosong";
            },
        });
        if (!notulen)
            return;
        try {
            await api.post(`/rapat/${id}/notulen`, { notulen });
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Notulen berhasil disimpan",
                timer: 2000,
                showConfirmButton: false,
            });
            // update state biar langsung tampil
            setRapat((prev) => ({
                ...prev,
                notulen,
            }));
            setActiveTab("notulen");
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.response?.data?.message ||
                    "Gagal menyimpan notulen",
            });
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-24", children: [_jsx("div", { className: "fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: rapat.nama_pertemuan })] }) }), _jsx("div", { className: "fixed top-[88px] left-0 right-0 z-20 bg-white mx-4 rounded-2xl shadow-sm", children: _jsx("div", { className: "flex text-sm font-medium", children: [
                        { label: "Detail", value: "detail" },
                        { label: "Peserta", value: "peserta" },
                        { label: "Notulen", value: "notulen" },
                    ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.value), className: `flex-1 py-3 text-center relative transition
                ${activeTab === tab.value
                            ? "text-indigo-600"
                            : "text-gray-400"}`, children: [tab.label, activeTab === tab.value && (_jsx("span", { className: "absolute bottom-0 left-6 right-6 h-[3px] bg-indigo-600 rounded-full" }))] }, tab.value))) }) }), _jsxs("div", { className: "pt-[160px] sm:pt-[170px] pb-28 sm:pb-32 px-3 sm:px-4 overflow-y-auto h-screen space-y-3 sm:space-y-4", children: [activeTab === "detail" && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Mulai Acara" }), _jsx("p", { className: "font-semibold text-gray-900 text-sm sm:text-base leading-snug", children: formatTanggalWaktu(rapat.tanggal_rapat, rapat.waktu_mulai) })] }), _jsx("hr", { className: "border-gray-100 my-1 sm:my-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Selesai Acara" }), _jsx("p", { className: "font-semibold text-gray-900 text-sm sm:text-base leading-snug", children: formatTanggalWaktu(rapat.tanggal_rapat, rapat.waktu_selesai) })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Jenis Pertemuan" }), _jsxs("p", { className: "font-semibold text-gray-900 text-sm sm:text-base leading-snug", children: ["Pertemuan ", rapat.jenis_pertemuan] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Lokasi Pertemuan" }), _jsx("p", { className: "font-semibold text-gray-900 text-sm sm:text-base leading-snug", children: rapat.lokasi || "-" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Jumlah Peserta" }), _jsxs("p", { className: "font-semibold text-gray-900 text-sm sm:text-base", children: [totalPeserta, " Orang"] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Peserta Hadir" }), _jsxs("p", { className: "font-semibold text-green-600 text-sm sm:text-base", children: [jumlahHadir, " Orang"] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Peserta Tidak Hadir" }), _jsxs("p", { className: "font-semibold text-red-600 text-sm sm:text-base", children: [jumlahTidakHadir, " Orang"] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Detail Pertemuan" }), _jsx("p", { className: "font-semibold text-gray-900 text-sm sm:text-base leading-snug", children: rapat.detail_pertemuan || "-" })] })] }) })), activeTab === "peserta" && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-sm p-4", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Jumlah Peserta" }), _jsxs("p", { className: "font-semibold text-gray-900", children: [rapat.pegawais?.length || 0, " Orang"] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-sm divide-y", children: [rapat.pegawais?.map((pegawai) => {
                                        const sudahHadir = !!pegawai.pivot?.waktu_hadir;
                                        return (_jsxs("div", { className: "flex items-center gap-3 p-4", children: [pegawai.foto_karyawan_url ? (_jsx("img", { src: pegawai.foto_karyawan_url, alt: pegawai.name, className: "w-10 h-10 rounded-full object-cover" })) : (_jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold", children: pegawai.name.charAt(0) })), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm sm:text-base", children: pegawai.name }), _jsx("p", { className: "text-[10px] sm:text-xs text-gray-500", children: "Peserta Rapat" })] }), _jsx("span", { className: `px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold
                ${sudahHadir
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-600"}
                `, children: sudahHadir ? "Hadir" : "Belum Hadir" })] }, pegawai.id));
                                    }), rapat.pegawais?.length === 0 && (_jsx("div", { className: "p-6 text-center text-gray-500 text-sm", children: "Belum ada peserta" }))] })] })), activeTab === "notulen" && (_jsx("div", { className: "bg-white rounded-2xl shadow-sm p-4 text-sm text-gray-700 leading-relaxed", children: rapat.notulen ? (_jsx("pre", { className: "whitespace-pre-wrap font-sans", children: rapat.notulen })) : (_jsx("p", { className: "text-center text-gray-400", children: "Belum ada notulen" })) }))] }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleNotulen, className: "flex-1 py-3 rounded-xl font-semibold border border-indigo-600 text-indigo-600 active:scale-95", children: "Notulen" }), _jsx("button", { onClick: handleHadir, disabled: isHadir || loadingHadir, className: `flex-1 py-3 rounded-xl font-semibold transition
                ${isHadir
                                ? "bg-green-500 text-white"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"}
                ${loadingHadir && "opacity-70"}
            `, children: loadingHadir
                                ? "Mencatat kehadiran..."
                                : isHadir
                                    ? "Sudah Hadir"
                                    : "Hadir" })] }) })] }));
}
