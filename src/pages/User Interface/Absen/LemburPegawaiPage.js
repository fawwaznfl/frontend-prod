import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { Clock } from "lucide-react";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function LemburPegawaiPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [absenStatus, setAbsenStatus] = useState("masuk");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const pegawai_id = user.id;
    const [stream, setStream] = useState(null);
    const [currentTime, setCurrentTime] = useState("");
    const [shiftToday, setShiftToday] = useState(null);
    const today = new Date().toISOString().slice(0, 10);
    const [location, setLocation] = useState({
        lat: null,
        lon: null,
    });
    const [photoData, setPhotoData] = useState(null);
    // CLOCK REALTIME
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("id-ID", { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTanggal = (date) => date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    useEffect(() => {
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
    const verifyFace = async (photoBlob) => {
        setIsVerifying(true);
        try {
            const formData = new FormData();
            formData.append("file", photoBlob, "face.jpg");
            formData.append("pegawai_id", pegawai_id);
            const res = await api.post("/face/verify", formData, { headers: { "Content-Type": "multipart/form-data" } });
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
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg");
        const blob = base64ToBlob(data);
        // 🔥 VERIFIKASI WAJAH
        const verified = await verifyFace(blob);
        if (verified) {
            setPhotoData(data);
            setIsVerified(true);
            stopCamera();
        }
        else {
            setPhotoData(null);
            setIsVerified(false);
        }
    };
    function base64ToBlob(base64) {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
        return new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
    }
    const handleSubmitAbsen = async () => {
        if (!photoData) {
            return Swal.fire("Error", "Ambil foto terlebih dahulu", "error");
        }
        if (!isVerified) {
            return Swal.fire("Error", "Wajah belum terverifikasi", "error");
        }
        if (!location.lat || !location.lon) {
            return Swal.fire("Error", "Lokasi belum terdeteksi", "error");
        }
        try {
            const blob = base64ToBlob(photoData);
            const formData = new FormData();
            formData.append("pegawai_id", pegawai_id);
            formData.append("tanggal_lembur", today);
            formData.append("lokasi", `${location.lat},${location.lon}`);
            formData.append("foto", blob, "lembur.jpg");
            await api.post("/lembur/auto", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Berhasil", "Absen lembur berhasil disimpan", "success")
                .then(() => navigate("/home-pegawai"));
            setAbsenStatus((prev) => prev === "masuk" ? "pulang" : "selesai");
        }
        catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl", children: [_jsx("span", { className: "text-xl", children: "\u2190" }), " Kembali"] }), _jsx("h1", { className: "text-2xl font-bold text-center", children: absenStatus === "masuk"
                    ? "Absen Masuk Lembur"
                    : absenStatus === "pulang"
                        ? "Absen Pulang Pegawai"
                        : "Absensi Selesai" }), _jsx(ComponentCard, { title: "Masuk Lembur", children: shiftToday ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "Tanggal:" }), " ", formatTanggal(new Date())] }), _jsxs("p", { children: [_jsx("strong", { children: "Shift:" }), " ", shiftToday.shift.nama] }), _jsxs("p", { children: [_jsx("strong", { children: "Jam Masuk:" }), " ", shiftToday.shift.jam_masuk] }), _jsxs("p", { children: [_jsx("strong", { children: "Jam Pulang:" }), " ", shiftToday.shift.jam_pulang] })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center text-center py-6 space-y-2", children: [_jsx("span", { className: "text-4xl", children: "\uD83D\uDCC5" }), _jsx("p", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200", children: formatTanggal(new Date()) })] })) }), _jsx(ComponentCard, { title: "Jam Sekarang", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-6 h-6" }), _jsx("p", { className: "text-lg font-semibold", children: currentTime })] }) }), absenStatus !== "selesai" && (_jsxs(ComponentCard, { title: "Lokasi Pegawai", children: [location.lat ? (_jsxs("p", { children: ["Lat: ", location.lat, " \u2014 Lon: ", location.lon] })) : (_jsx("p", { className: "text-gray-500", children: "Lokasi belum terdeteksi" })), _jsx("button", { onClick: handleGetLocation, className: "bg-blue-600 w-full py-2 mt-3 text-white rounded-xl", children: "Deteksi Lokasi" })] })), absenStatus !== "selesai" && (_jsxs(ComponentCard, { title: "Kamera Absen", children: [_jsx("video", { ref: videoRef, autoPlay: true, className: "w-full rounded-xl bg-black" }), _jsx("canvas", { ref: canvasRef, className: "hidden" }), !stream ? (_jsx("button", { onClick: startCamera, className: "bg-green-600 text-white w-full mt-3 py-2 rounded-xl", children: "Aktifkan Kamera" })) : (_jsx("button", { onClick: stopCamera, className: "bg-red-600 text-white w-full mt-3 py-2 rounded-xl", children: "Matikan Kamera" })), _jsx("button", { onClick: takePhoto, disabled: isVerifying, className: `w-full mt-3 py-2 rounded-xl text-white ${isVerifying
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700"}`, children: isVerifying ? "Memverifikasi Wajah..." : "Ambil Foto & Verifikasi" }), photoData && isVerified && (_jsx("div", { className: "bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm text-center mt-3", children: "Wajah Terverifikasi! Silakan simpan absen lembur." })), _jsx("button", { onClick: handleSubmitAbsen, disabled: !isVerified, className: `w-full mt-3 py-2 rounded-xl text-white ${isVerified
                            ? "bg-blue-700 hover:bg-blue-800"
                            : "bg-gray-400 cursor-not-allowed"}`, children: "Simpan Absen" }), photoData && (_jsx("img", { src: photoData, className: "w-full rounded-xl mt-3" }))] }))] }));
}
