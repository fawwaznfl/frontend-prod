import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import api from "../../../api/axios";
import BottomNav from "../../../components/common/BottomNav";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
export default function FaceRecognitionRegisterPegawai() {
    const navigate = useNavigate();
    const [pegawai, setPegawai] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [previewFoto] = useState(null);
    const [saving, setSaving] = useState(false);
    const hasShownAlert = useRef(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photos, setPhotos] = useState([]);
    const [cameraOn, setCameraOn] = useState(false);
    const [cameraFinished, setCameraFinished] = useState(false);
    const startCamera = async () => {
        if (cameraFinished)
            return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraOn(true);
            }
        }
        catch {
            alert("Izin kamera ditolak");
        }
    };
    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            setCameraOn(false);
        }
    };
    const capturePhoto = () => {
        if (photos.length >= 3)
            return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas)
            return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob)
                return;
            const file = new File([blob], `face_${photos.length + 1}.jpg`, {
                type: "image/jpeg",
            });
            setPhotos((prev) => {
                const next = [...prev, file];
                if (next.length >= 3) {
                    stopCamera();
                    setCameraFinished(true);
                }
                return next;
            });
        }, "image/jpeg");
    };
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = `${API_URL}/storage`;
    useEffect(() => {
        fetchProfile();
    }, []);
    const fetchProfile = async () => {
        try {
            const res = await api.get("/profile");
            const data = res.data.data;
            setPegawai(data);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSaveFace = async () => {
        if (photos.length !== 3) {
            Swal.fire({
                icon: "warning",
                title: "Belum Lengkap",
                text: "Harus mengambil 3 foto wajah",
            });
            return;
        }
        setSaving(true);
        Swal.fire({
            title: "Menyimpan...",
            text: "Mohon tunggu sebentar",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            const formData = new FormData();
            formData.append("pegawai_id", String(pegawai.id));
            photos.forEach((photo) => {
                formData.append("files[]", photo);
            });
            await api.post("/face/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Berhasil 🎉",
                text: "Wajah berhasil diregistrasi",
                timer: 1800,
                showConfirmButton: false,
            });
            setTimeout(() => {
                navigate(-1);
            }, 1800);
        }
        catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.response?.data?.message ||
                    "Terjadi kesalahan saat menyimpan data wajah",
            });
        }
        finally {
            setSaving(false);
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
            Sebelum mendaftarkan <b>Face Recognition</b>, harap perhatikan panduan berikut:
          </p>

          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;gap:8px">
              <span>📸</span>
              <span>Ambil <b>3 foto wajah</b> dari sudut berbeda (Depan, Kiri, Kanan)</span>
            </div>

            <div style="display:flex;gap:8px">
              <span>1</span>
              <span>Klik tombol <b>Aktifkan Kamera</b></span>
            </div>

            <div style="display:flex;gap:8px">
              <span>2</span>
              <span>
                <b>Foto Depan:</b> Silahkan lihat ke kamera dan klik tombol ambil Foto
              </span>
            </div>

            <div style="display:flex;gap:8px">
              <span>3</span>
              <span>
                <b>Foto Kiri:</b> Silahkan menghadap ke sebelah kiri dan klik tombol ambil foto
              </span>
            </div>

            <div style="display:flex;gap:8px">
              <span>4</span>
              <span>
                <b>Foto Kanan:</b> Silahkan menghadap ke sebelah kanan dan klik tombol ambil foto
              </span>
            </div>

            <div style="display:flex;gap:8px">
              <span>5</span>
              <span>
                Setelah lengkap, klik Simpan Perubahan
              </span>
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
    return (_jsxs("div", { className: "sticky top-0 z-20 bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Face Recognition" })] }) }), _jsx("div", { className: "px-4 pt-4 pb-24 space-y-4 overflow-y-auto", style: {
                    height: "calc(100vh - 200px)",
                }, children: loading ? (_jsx("div", { className: "text-center text-gray-400 text-sm mt-10", children: "Memuat data..." })) : (_jsx(_Fragment, { children: _jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: user.foto_karyawan, className: "w-14 h-14 rounded-xl object-cover bg-indigo-100" }), !previewFoto && !pegawai?.foto_karyawan && (_jsx("div", { className: "w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center", children: _jsx(User, { className: "text-indigo-600" }) })), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: pegawai?.name }), _jsx("p", { className: "text-xs text-gray-500", children: pegawai?.divisi?.nama || "-" })] })] }), _jsx("hr", {}), _jsx("p", { className: "text-sm text-gray-500", children: "Ambil 3 foto wajah dari sudut berbeda (Depan, Kanan, dan Kiri)" }), _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-500 bg-black", children: _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover" }) }), !cameraOn && !cameraFinished && (_jsx("button", { type: "button", onClick: startCamera, className: "bg-indigo-600 text-white px-5 py-2 rounded-xl", children: "Aktifkan Kamera" })), _jsxs("button", { type: "button", onClick: capturePhoto, disabled: !cameraOn || photos.length >= 3, className: `px-4 py-2 rounded-xl text-white ${cameraOn && photos.length < 3
                                            ? "bg-green-600"
                                            : "bg-gray-400 cursor-not-allowed"}`, children: ["Ambil Foto (", photos.length, "/3)"] }), _jsx("canvas", { ref: canvasRef, className: "hidden" })] }), cameraFinished && (_jsx("p", { className: "text-green-600 text-sm font-medium text-center mt-2", children: "Foto wajah lengkap, siap disimpan" })), photos.length > 0 && (_jsx("div", { className: "flex gap-3 justify-center mt-4", children: photos.map((photo, idx) => (_jsx("img", { src: URL.createObjectURL(photo), className: "w-20 h-20 rounded-full border-2 border-indigo-500 object-cover" }, idx))) })), _jsx("button", { onClick: handleSaveFace, disabled: photos.length !== 3 || saving, className: "\n                w-full mt-4 rounded-xl py-3\n                bg-indigo-600 text-white text-sm font-medium\n                disabled:bg-gray-300\n            ", children: saving ? "Menyimpan..." : "Simpan Perubahan" })] }) })) }), _jsx(BottomNav, {})] }));
}
