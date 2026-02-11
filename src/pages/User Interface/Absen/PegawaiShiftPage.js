import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { Clock } from "lucide-react";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
export default function PegawaiShiftPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [absenStatus, setAbsenStatus] = useState("masuk");
    const [cutiHariIni, setCutiHariIni] = useState(null);
    const today = new Date().toISOString().slice(0, 10);
    const [params] = useSearchParams();
    const tanggalShift = params.get("tanggal") || today;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.id;
    const [stream, setStream] = useState(null);
    const [currentTime, setCurrentTime] = useState("");
    const [shiftToday, setShiftToday] = useState(null);
    const [location, setLocation] = useState({
        lat: null,
        lon: null,
    });
    const [photoData, setPhotoData] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    // CLOCK REALTIME
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("id-ID", { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const fetchAbsensiAktif = async () => {
        try {
            const res = await api.get(`/absensi/aktif/${pegawai_id}`);
            if (res.data.data) {
                // ADA ABSEN BELUM PULANG
                setAbsenStatus("pulang");
                // ambil shift berdasarkan tanggal absensi lama
                const shiftRes = await api.get(`/shift-mapping/by-date/${pegawai_id}?tanggal=${res.data.data.tanggal}`);
                setShiftToday(shiftRes.data.data);
            }
            else {
                // TIDAK ADA → SHIFT SESUAI TANGGAL DI URL
                const resShift = await api.get(`/shift-mapping/by-date/${pegawai_id}?tanggal=${tanggalShift}`);
                setShiftToday(resShift.data.data);
                setAbsenStatus("masuk");
            }
        }
        catch {
            setShiftToday(null);
        }
    };
    const fetchCutiHariIni = async () => {
        const res = await api.get(`/cuti/check-today/${pegawai_id}`);
        if (res.data.data) {
            setCutiHariIni(res.data.data);
        }
    };
    useEffect(() => {
        //fetchShiftToday();
        //fetchStatusHariIni();
        fetchAbsensiAktif();
        fetchCutiHariIni();
        handleGetLocation();
    }, []);
    useEffect(() => {
        if (absenStatus === "selesai") {
            stopCamera();
        }
    }, [absenStatus]);
    // GET LOCATION
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            return Swal.fire("Error", "Browser tidak mendukung GPS", "error");
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
            });
        }, () => {
            Swal.fire("GPS Error", "Aktifkan GPS untuk aplikasi ini.", "error");
        });
    };
    // CAMERA
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setStream(mediaStream);
            if (videoRef.current)
                videoRef.current.srcObject = mediaStream;
        }
        catch {
            Swal.fire("Error", "Tidak bisa mengakses kamera", "error");
        }
    };
    const stopCamera = () => {
        stream?.getTracks().forEach((t) => t.stop());
        setStream(null);
    };
    // TAMBAH: VERIFY WAJAH
    const verifyFace = async (photoBlob) => {
        setIsVerifying(true);
        try {
            const formData = new FormData();
            formData.append("file", photoBlob, "face.jpg");
            formData.append("pegawai_id", pegawai_id);
            const res = await api.post("/face/verify", // ⬅️ lewat backend
            formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsVerifying(false);
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Wajah Terverifikasi!",
                    text: `Score: ${(res.data.score * 100).toFixed(1)}%`,
                    timer: 2000,
                });
                return true;
            }
            Swal.fire("Error", res.data.message, "error");
            return false;
        }
        catch (err) {
            setIsVerifying(false);
            Swal.fire("Verifikasi Gagal", err.response?.data?.message || "Server error", "error");
            return false;
        }
    };
    const takePhoto = async () => {
        if (!videoRef.current || !canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg");
        // CONVERT KE BLOB UNTUK VERIFIKASI
        const blob = base64ToBlob(data);
        // VERIFIKASI WAJAH
        const verified = await verifyFace(blob);
        if (verified) {
            setPhotoData(data);
            setIsVerified(true);
            stopCamera();
            await autoSaveAbsen(data);
        }
        else {
            setPhotoData(null);
            setIsVerified(false);
        }
    };
    // SAVE ABSENSI (MASUK / PULANG)
    const saveAbsen = async () => {
        if (!photoData)
            return Swal.fire("Error", "Foto belum diambil.", "error");
        // CEK APAKAH SUDAH TERVERIFIKASI
        if (!isVerified) {
            return Swal.fire("Error", "Wajah belum terverifikasi!", "error");
        }
        const blob = base64ToBlob(photoData);
        const formData = new FormData();
        formData.append("pegawai_id", pegawai_id);
        formData.append("shift_id", shiftToday?.shift?.id || "");
        formData.append("tanggal", tanggalShift);
        formData.append("lokasi", `${location.lat},${location.lon}`);
        formData.append("foto", blob, "absen.jpg");
        const res = await api.post("/absensi/auto", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Berhasil", res.data.message, "success");
        // === Update status berdasarkan response backend ===
        if (res.data.message.includes("Absen masuk")) {
            setAbsenStatus("pulang");
        }
        else if (res.data.message.includes("Absen pulang")) {
            setAbsenStatus("selesai");
        }
        navigate("/home-pegawai");
    };
    function base64ToBlob(base64) {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
        return new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
    }
    const cutiColor = {
        cuti: "bg-blue-100 text-blue-700",
        sakit: "bg-red-100 text-red-700",
        izin_masuk: "bg-yellow-100 text-yellow-700",
        izin_telat: "bg-purple-100 text-purple-700",
        izin_pulang_cepat: "bg-orange-100 text-orange-700",
        melahirkan: "bg-pink-100 text-pink-700",
    };
    const canAbsen = absenStatus !== "selesai" &&
        !cutiHariIni;
    const autoSaveAbsen = async (base64Photo) => {
        try {
            const blob = base64ToBlob(base64Photo);
            const formData = new FormData();
            formData.append("pegawai_id", pegawai_id);
            formData.append("shift_id", shiftToday?.shift?.id || "");
            formData.append("tanggal", tanggalShift);
            formData.append("lokasi", `${location.lat},${location.lon}`);
            formData.append("foto", blob, "absen.jpg");
            const res = await api.post("/absensi/auto", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire({
                icon: "success",
                title: "Absensi Berhasil 🎉",
                text: res.data.message,
                timer: 2000,
                showConfirmButton: false,
            });
            if (res.data.message.includes("Absen masuk")) {
                setAbsenStatus("pulang");
            }
            else if (res.data.message.includes("Absen pulang")) {
                setAbsenStatus("selesai");
            }
            setTimeout(() => {
                navigate("/home-pegawai");
            }, 2000);
        }
        catch (err) {
            Swal.fire("Gagal Menyimpan Absensi", err.response?.data?.message || "Server error", "error");
        }
    };
    useEffect(() => {
        Swal.fire({
            title: `<div style="font-size:18px;font-weight:600">Perhatian 👀</div>`,
            html: `
        <div style="
          text-align:left;
          font-size:14px;
          line-height:1.6;
          color:#374151;
        ">
          <p style="margin-bottom:12px">
            Sebelum melakukan <b>Absensi</b>, harap perhatikan panduan berikut:
          </p>

            <div style="display:flex;gap:8px">
              <span>1</span>
              <span>Pastikan Mata menghadap ke kamera</b></span>
            </div>

            <div style="display:flex;gap:8px">
              <span>2</span>
              <span>Pastikan Kamera dan wajah sejajar</b></span>
            </div>

            <div style="display:flex;gap:8px">
              <span>3</span>
              <span>Klik tombol <b>Aktifkan Kamera</b></span>
            </div>

            <div style="display:flex;gap:8px">
              <span>4</span>
              <span>Jika masih gagal, ulangi sampai benar posisinya</b></span>
            </div>

            
          </div>
        </div>
      `,
            confirmButtonText: "Mengerti",
            confirmButtonColor: "#4f46e5",
            allowOutsideClick: false,
            width: "90%",
            padding: "1.25rem",
            backdrop: "rgba(0,0,0,0.6)",
        });
    }, []);
    // USER INTERFACE
    return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl", children: [_jsx("span", { className: "text-xl", children: "\u2190" }), " Kembali"] }), _jsx("h1", { className: "text-2xl font-bold text-center capitalize", children: cutiHariIni
                    ? `Hari ini Anda ${cutiHariIni.jenis_cuti.replace("_", " ")}`
                    : absenStatus === "masuk"
                        ? "Absen Masuk Pegawai"
                        : absenStatus === "pulang"
                            ? "Absen Pulang Pegawai"
                            : "Absensi Selesai" }), absenStatus === "pulang" && (_jsx("div", { className: "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm text-center", children: "\u26A0\uFE0F Anda masih memiliki absensi sebelumnya yang belum diselesaikan" })), absenStatus !== "selesai" && !cutiHariIni && (_jsx(ComponentCard, { title: tanggalShift === today
                    ? "Shift Hari Ini"
                    : "Shift Sebelumnya (Belum Diselesaikan)", children: shiftToday ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "Tanggal:" }), " ", today] }), _jsxs("p", { children: [_jsx("strong", { children: "Shift:" }), " ", shiftToday.shift.nama] }), _jsxs("p", { children: [_jsx("strong", { children: "Jam Masuk:" }), " ", shiftToday.shift.jam_masuk] }), _jsxs("p", { children: [_jsx("strong", { children: "Jam Pulang:" }), " ", shiftToday.shift.jam_pulang] })] })) : (_jsx("p", { className: "text-red-500 font-semibold text-center", children: "Tidak ada shift hari ini" })) })), _jsx(ComponentCard, { title: "Jam Sekarang", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-6 h-6" }), _jsx("p", { className: "text-lg font-semibold", children: currentTime })] }) }), canAbsen && (_jsxs(ComponentCard, { title: "Lokasi Pegawai", children: [location.lat ? (_jsxs("p", { children: ["Lat: ", location.lat, " \u2014 Lon: ", location.lon] })) : (_jsx("p", { className: "text-gray-500", children: "Lokasi belum terdeteksi" })), _jsx("button", { onClick: handleGetLocation, className: "bg-blue-600 w-full py-2 mt-3 text-white rounded-xl", children: "Deteksi Lokasi" })] })), canAbsen && (_jsxs(ComponentCard, { title: "Kamera Absen", children: [_jsx("video", { ref: videoRef, autoPlay: true, className: "w-full rounded-xl bg-black" }), _jsx("canvas", { ref: canvasRef, className: "hidden" }), !stream ? (_jsx("button", { onClick: startCamera, className: "bg-green-600 text-white w-full mt-3 py-2 rounded-xl", children: "Aktifkan Kamera" })) : (_jsx("button", { onClick: stopCamera, className: "bg-red-600 text-white w-full mt-3 py-2 rounded-xl", children: "Matikan Kamera" })), _jsx("button", { onClick: takePhoto, disabled: isVerifying, className: `w-full mt-3 py-2 rounded-xl text-white ${isVerifying
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700"}`, children: isVerifying ? "Memverifikasi Wajah..." : "Ambil Foto & Verifikasi" }), photoData && isVerified && (_jsx("div", { className: "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-center mt-3", children: "Memverifikasi wajah..." })), isVerified && (_jsx("div", { className: "bg-green-100 text-green-700 px-4 py-2 rounded-xl text-center mt-3", children: "Wajah terverifikasi Absensi disimpan otomatis" })), photoData && (_jsx("img", { src: photoData, className: "w-full rounded-xl mt-3", alt: "Preview" }))] }))] }));
}
