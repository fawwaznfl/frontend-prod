import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useCamera } from "../../../hooks/useCamera";
import api from "../../../api/axios";
import Swal from "sweetalert2";
export default function FaceEnroll() {
    const { videoRef, capture } = useCamera();
    const [photos, setPhotos] = useState([]);
    const MAX = 5;
    const takePhoto = async () => {
        if (photos.length >= MAX)
            return;
        const photo = await capture();
        setPhotos(prev => [...prev, photo]);
    };
    const submit = async () => {
        if (photos.length < 3) {
            Swal.fire("Minimal 3 foto", "Ambil wajah dari beberapa sudut", "warning");
            return;
        }
        const formData = new FormData();
        photos.forEach((p, i) => formData.append("photos[]", p, `face-${i}.jpg`));
        await api.post("/face/enroll", formData);
        Swal.fire("Berhasil", "Wajah berhasil direkam", "success");
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("video", { ref: videoRef, autoPlay: true, className: "rounded-xl" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: takePhoto, className: "btn", children: ["Ambil Foto (", photos.length, "/", MAX, ")"] }), _jsx("button", { onClick: submit, disabled: photos.length < 3, className: "btn-primary", children: "Simpan Wajah" })] })] }));
}
