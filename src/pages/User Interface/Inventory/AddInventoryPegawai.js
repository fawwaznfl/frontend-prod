import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import { ArrowLeft } from "lucide-react";
export default function AddInventoryPegawai() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [loading, setLoading] = useState(false);
    const [divisi, setDivisi] = useState([]);
    const [filteredDivisi, setFilteredDivisi] = useState([]);
    const generateKodeBarang = () => {
        const random = Math.floor(10000 + Math.random() * 90000);
        return `BRG-${random}`;
    };
    const [form, setForm] = useState({
        kode_barang: generateKodeBarang(),
        nama_barang: "",
        stok: "",
        satuan: "",
        divisi_id: "",
        keterangan: "",
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async () => {
        if (!form.nama_barang || !form.stok || !form.satuan) {
            Swal.fire("Oops", "Lengkapi data wajib", "warning");
            return;
        }
        if (!user?.id || !user?.company_id) {
            Swal.fire("Error", "User tidak valid, silakan login ulang", "error");
            return;
        }
        try {
            setLoading(true);
            const payload = {
                ...form,
                pegawai_id: user.id,
                company_id: user.company_id,
                status: "tersedia",
            };
            await api.post("/inventory", payload);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Inventory berhasil ditambahkan",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/inventory-pegawai");
        }
        catch (err) {
            console.error(err?.response?.data);
            Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchDivisi = async () => {
            try {
                const res = await api.get("/pegawai/divisi");
                const data = res.data.data || [];
                // filter by company pegawai
                const fd = data.filter((d) => d.company_id == user.company_id);
                setDivisi(data);
                setFilteredDivisi(fd);
            }
            catch (error) {
                console.error("Gagal fetch divisi", error);
                Swal.fire("Error", "Gagal memuat data divisi", "error");
            }
        };
        if (user?.company_id) {
            fetchDivisi();
        }
    }, [user?.company_id]);
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-b-3xl", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-2", children: _jsx(ArrowLeft, {}) }), _jsx("h1", { className: "text-lg font-semibold text-center flex-1", children: "Tambah Inventory" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Pegawai" }), _jsx("input", { type: "text", readOnly: true, value: user?.name || "-", className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Kode Barang" }), _jsx("input", { type: "text", name: "kode_barang", value: form.kode_barang, readOnly: true, className: "w-full border rounded-xl px-4 py-3 bg-gray-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Divisi" }), _jsxs("select", { name: "divisi_id", value: form.divisi_id, onChange: handleChange, className: "w-full border rounded-xl px-4 py-3", children: [_jsx("option", { value: "", children: "Pilih Divisi" }), filteredDivisi.length === 0 ? (_jsx("option", { disabled: true, children: "Tidak ada divisi" })) : (filteredDivisi.map((d) => (_jsx("option", { value: d.id, children: d.nama || d.nama_divisi }, d.id))))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Nama Barang" }), _jsx("input", { name: "nama_barang", value: form.nama_barang, onChange: handleChange, placeholder: "Nama barang", className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Stok" }), _jsx("input", { type: "number", name: "stok", value: form.stok, onChange: handleChange, placeholder: "Jumlah stok", className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Satuan" }), _jsx("input", { name: "satuan", value: form.satuan, onChange: handleChange, placeholder: "pcs / unit / box", className: "w-full border rounded-xl px-4 py-3" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-600", children: "Keterangan" }), _jsx("textarea", { name: "keterangan", value: form.keterangan, onChange: handleChange, rows: 4, placeholder: "Keterangan tambahan", className: "w-full border rounded-xl px-4 py-3" })] })] }), _jsx("button", { disabled: loading, onClick: handleSubmit, className: "w-full bg-indigo-600 text-white py-3 rounded-full shadow-md disabled:opacity-60", children: loading ? "Menyimpan..." : "Simpan Inventory" })] })] }));
}
