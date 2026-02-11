import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import EditableBarValue from "../../components/Payroll/EditableBarValue";
import BarValue from "../../components/Payroll/BarValue";
import DualBarValue from "../../components/Payroll/DualBarValue";
import BonusBars from "../../components/Payroll/BonusBars";
const getTerlambatSuffix = (satuan) => {
    switch (satuan) {
        case "menit":
            return "/ Menit";
        case "jam":
            return "/ Jam";
        default:
            return "/ Hari";
    }
};
const formatRupiah = (value) => {
    if (!value)
        return "";
    const num = typeof value === "number" ? value : Number(value);
    return num.toLocaleString("id-ID");
};
const parseRupiah = (value) => {
    return Number(value.replace(/\D/g, "")) || 0;
};
const formatTanggalIndonesia = (dateString) => {
    if (!dateString)
        return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
const DualBarValueEditableBottom = ({ title, topValue, topLabel, bottomValue, bottomLabel, onBottomChange, }) => {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        setDisplay(bottomValue > 0 ? formatRupiah(bottomValue) : "");
    }, [bottomValue]);
    return (_jsxs("div", { className: "flex flex-col space-y-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: title }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [_jsx("div", { className: "flex-1 bg-orange-400 px-4 py-2 text-black", children: topValue.toLocaleString("id-ID") }), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: topLabel })] }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: display, onChange: (e) => {
                            const raw = e.target.value;
                            const parsed = parseRupiah(raw);
                            setDisplay(parsed ? formatRupiah(parsed) : "");
                            onBottomChange(parsed);
                        }, className: "flex-1 bg-white px-4 py-2 text-black outline-none" }), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: bottomLabel })] })] }));
};
const Input = ({ label, value, type = "text", disabled = false, onChange, }) => (_jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: label }), _jsx("input", { type: type, value: value, disabled: disabled, onChange: onChange, className: "rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" })] }));
const Select = ({ label, value, options, disabled = false, onChange, }) => (_jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: label }), _jsxs("select", { value: value, disabled: disabled, onChange: onChange, className: "rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100", children: [_jsx("option", { value: "", children: "Pilih" }), options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })] }));
export default function HitungGajiPegawai() {
    const { pegawaiId } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startDateParam = searchParams.get("start_date");
    const endDateParam = searchParams.get("end_date");
    const persentaseParam = searchParams.get("persentase");
    const [form, setForm] = useState({
        pegawai: "",
        jabatan: "",
        bulan: "",
        tanggal_bergabung: "",
        tahun: 0,
        rekening: "",
        tanggal_mulai: "",
        tanggal_akhir: "",
        persentase_kehadiran: 0,
        gaji_pokok: 0,
        makan_transport: 0,
        uang_makan: 0,
        bonus_kehadiran: 0,
        potongan: 0,
        total_reimbursement: 0,
        mangkir_count: 0,
        mangkir: 0,
        lembur_count: 0,
        lembur: 0,
        izin_masuk_count: 0,
        izin: 0,
        bonus_pribadi: 0,
        bonus_team: 0,
        bonus_jackpot: 0,
        terlambat_count: 0,
        terlambat: 0,
        kehadiran_count: 0,
        kehadiran: 0,
        saldo_kasbon_count: 0,
        saldo_kasbon: 0,
        tunjangan_bpjs_kesehatan_count: 0,
        tunjangan_bpjs_kesehatan: 0,
        tunjangan_bpjs_ketenagakerjaan_count: 0,
        tunjangan_bpjs_ketenagakerjaan: 0,
        tunjangan_pajak_count: 0,
        tunjangan_pajak: 0,
        tunjangan_hari_raya: 0,
        potongan_bpjs_kesehatan_count: 0,
        potongan_bpjs_kesehatan: 0,
        potongan_bpjs_ketenagakerjaan_count: 0,
        potongan_bpjs_ketenagakerjaan: 0,
        thr: 0,
        thr_count: 0,
        loss: 0,
        terlambat_satuan: "hari",
    });
    const fetchData = async () => {
        if (!pegawaiId || !startDateParam || !endDateParam)
            return;
        const res = await api.get(`/rekap-absensi/pegawai/${pegawaiId}`, {
            params: {
                start_date: startDateParam,
                end_date: endDateParam,
            },
        });
        const d = res.data.data;
        setForm((prev) => ({
            ...prev,
            company_id: d.company_id,
            pegawai: d.nama_pegawai,
            jabatan: d.jabatan,
            bulan: d.bulan,
            tahun: d.tahun,
            tanggal_mulai: formatTanggalIndonesia(d.start_date),
            rekening: d.rekening || "",
            tanggal_bergabung: d.tgl_join,
            tanggal_akhir: formatTanggalIndonesia(d.end_date),
            gaji_pokok: Number(d.gaji_pokok) || 0,
            makan_transport: Number(d.makan_transport) || 0,
            total_reimbursement: Number(d.total_reimbursement) || 0,
            mangkir_count: Number(d.mangkir_count) || 0,
            mangkir: Number(d.mangkir) || 0,
            lembur_count: Number(d.lembur_count) || 0,
            lembur: Number(d.lembur) || 0,
            izin_masuk_count: Number(d.izin_masuk_count) || 0,
            izin: Number(d.izin) || 0,
            bonus_pribadi: Number(d.bonus_pribadi) || 0,
            bonus_team: Number(d.bonus_team) || 0,
            bonus_jackpot: Number(d.bonus_jackpot) || 0,
            terlambat_count: Number(d.terlambat_count) || 0,
            terlambat: Number(d.terlambat) || 0,
            kehadiran_count: Number(d.kehadiran_count) || 0,
            kehadiran: Number(d.kehadiran) || 0,
            saldo_kasbon_count: Number(d.bayar_kasbon_periode) || 0,
            saldo_kasbon: Number(d.saldo_kasbon) || 0,
            tunjangan_bpjs_kesehatan_count: Number(d.tunjangan_bpjs_kesehatan_count) || 0,
            tunjangan_bpjs_kesehatan: Number(d.tunjangan_bpjs_kesehatan) || 0,
            tunjangan_bpjs_ketenagakerjaan_count: Number(d.tunjangan_bpjs_ketenagakerjaan_count) || 0,
            tunjangan_bpjs_ketenagakerjaan: Number(d.tunjangan_bpjs_ketenagakerjaan) || 0,
            tunjangan_pajak_count: Number(d.tunjangan_pajak_count) || 0,
            tunjangan_pajak: Number(d.tunjangan_pajak) || 0,
            potongan_bpjs_kesehatan_count: Number(d.potongan_bpjs_kesehatan_count) || 0,
            potongan_bpjs_kesehatan: Number(d.potongan_bpjs_kesehatan) || 0,
            potongan_bpjs_ketenagakerjaan_count: Number(d.potongan_bpjs_ketenagakerjaan_count) || 0,
            potongan_bpjs_ketenagakerjaan: Number(d.potongan_bpjs_ketenagakerjaan) || 0,
            thr: Number(d.thr) || 0,
            thr_count: Number(d.thr_count) || 0,
            terlambat_satuan: d.terlambat_satuan || "hari",
            persentase_kehadiran: persentaseParam
                ? Number(persentaseParam)
                : d.persentase_kehadiran,
        }));
    };
    useEffect(() => {
        const init = async () => {
            try {
                await fetchData();
            }
            finally {
                setLoading(false);
            }
        };
        init();
    }, [pegawaiId]);
    const bulanOptions = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ].map((b) => ({ label: b, value: b }));
    const currentYear = new Date().getFullYear();
    const tahunOptions = Array.from({ length: 7 }, (_, i) => {
        const year = currentYear - 3 + i;
        return { label: year.toString(), value: year };
    });
    if (loading)
        return _jsx("p", { children: "Loading..." });
    const handleSimpanPayroll = async () => {
        const confirm = await Swal.fire({
            title: "Simpan Payroll?",
            text: "Pastikan data sudah benar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const payload = {
                pegawai_id: Number(pegawaiId),
                bulan: form.bulan,
                tahun: form.tahun,
                rekening: form.rekening,
                // PENAMBAHAN
                gaji_pokok: form.gaji_pokok,
                uang_transport: form.makan_transport,
                reimbursement: form.total_reimbursement,
                lembur: form.lembur_count,
                uang_lembur: form.lembur,
                kehadiran_100: form.kehadiran_count,
                bonus_kehadiran: form.kehadiran,
                bonus_pribadi: form.bonus_pribadi,
                bonus_team: form.bonus_team,
                bonus_jackpot: form.bonus_jackpot,
                thr: form.thr_count,
                tunjangan_hari_raya: form.thr,
                tunjangan_bpjs_kesehatan: form.tunjangan_bpjs_kesehatan,
                tunjangan_bpjs_ketenagakerjaan: form.tunjangan_bpjs_ketenagakerjaan,
                tunjangan_pajak: form.tunjangan_pajak,
                // PENGURANGAN
                terlambat: form.terlambat_count,
                uang_terlambat: form.terlambat,
                mangkir: form.mangkir_count,
                uang_mangkir: form.mangkir,
                izin: form.izin_masuk_count,
                uang_izin: form.izin,
                bayar_kasbon: form.saldo_kasbon_count,
                potongan_bpjs_kesehatan: form.potongan_bpjs_kesehatan,
                potongan_bpjs_ketenagakerjaan: form.potongan_bpjs_ketenagakerjaan,
                loss: form.loss,
                total_tambah: totalPenjumlahan,
                total_pengurangan: totalPengurangan,
                gaji_diterima: grandTotal,
                periode_awal: startDateParam,
                periode_akhir: endDateParam,
                status: "final",
                keterangan: `Payroll ${form.bulan} ${form.tahun}`,
            };
            await api.post("/payrolls", payload);
            Swal.fire({
                icon: "success",
                title: "Payroll Tersimpan 🎉",
                text: "Data payroll berhasil disimpan",
                confirmButtonText: "Oke",
                confirmButtonColor: "#2563eb",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/payroll");
                }
            });
        }
        catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Gagal Menyimpan 😢",
                text: "Terjadi kesalahan saat menyimpan payroll",
                confirmButtonText: "Tutup",
                confirmButtonColor: "#dc2626",
            });
        }
    };
    // HITUNG PENJUMLAHAN
    const totalPenjumlahan = form.gaji_pokok +
        form.makan_transport +
        form.total_reimbursement +
        (form.lembur_count * form.lembur) +
        form.bonus_pribadi +
        form.bonus_team +
        form.bonus_jackpot +
        (form.kehadiran_count * form.kehadiran) +
        form.tunjangan_bpjs_kesehatan +
        form.tunjangan_bpjs_ketenagakerjaan +
        form.tunjangan_pajak +
        (form.thr_count * form.thr);
    // HITUNG PENGURANGAN 
    const totalPengurangan = (form.mangkir_count * form.mangkir) +
        (form.izin_masuk_count * form.izin) +
        (form.terlambat_count * form.terlambat) +
        form.saldo_kasbon_count +
        form.potongan_bpjs_kesehatan +
        form.potongan_bpjs_ketenagakerjaan +
        form.loss;
    // HITUNG GRAND TOTAL
    const grandTotal = totalPenjumlahan - totalPengurangan;
    // USER INTERFACE
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "Hitung Gaji Pegawai", description: "Perhitungan gaji pegawai berdasarkan kehadiran" }), _jsx(PageHeader, { pageTitle: "Hitung Gaji Pegawai" }), _jsx(ComponentCard, { children: _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsx(Input, { label: "Pegawai", value: form.pegawai, disabled: true }), _jsx(Select, { label: "Bulan", value: form.bulan, options: bulanOptions, onChange: (e) => setForm({ ...form, bulan: e.target.value }) }), _jsx(Select, { label: "Tahun", value: form.tahun, options: tahunOptions, onChange: (e) => setForm({ ...form, tahun: Number(e.target.value) }) }), _jsx(Input, { label: "Persentase Kehadiran", value: `${form.persentase_kehadiran}%`, disabled: true }), _jsx(Input, { label: "Jabatan", value: form.jabatan, disabled: true }), _jsx(Input, { label: "Nomor Rekening", value: form.rekening, disabled: true }), _jsx(Input, { label: "Tanggal Mulai", value: form.tanggal_mulai, disabled: true }), _jsx(Input, { label: "Tanggal Akhir", value: form.tanggal_akhir, disabled: true }), _jsx(EditableBarValue, { title: "Gaji Pokok", value: form.gaji_pokok, onChange: (val) => setForm((prev) => ({ ...prev, gaji_pokok: val })) }), _jsx(EditableBarValue, { title: "Uang Transport", value: form.makan_transport, onChange: (val) => setForm((prev) => ({ ...prev, makan_transport: val })) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(BarValue, { title: "Reimbursement", value: form.total_reimbursement, suffix: "Total Reimbursement", onChange: (val) => setForm((prev) => ({ ...prev, total_reimbursement: val })) }) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "Mangkir", count: form.mangkir_count, countSuffix: "/ Kali", amount: form.mangkir, amountLabel: "Uang Mangkir", onCountChange: (val) => setForm((prev) => ({ ...prev, mangkir_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, mangkir: val })) }) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "Lembur", count: form.lembur_count, countSuffix: "/ Jam", amount: form.lembur, amountLabel: "Uang Lembur", onCountChange: (val) => setForm((prev) => ({ ...prev, lembur_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, lembur: val })) }) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "Izin Masuk", count: form.izin_masuk_count, countSuffix: "/ Kali", amount: form.izin, amountLabel: "Uang Izin", onCountChange: (val) => setForm((prev) => ({ ...prev, izin_masuk_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, izin: val })) }) }), _jsxs("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: [_jsx("h3", { className: "mb-4 text-base text-gray-800", children: "Bonus Pegawai" }), _jsx(BonusBars, { labelPribadi: "Bonus Pribadi", pribadi: form.bonus_pribadi, onPribadiChange: (val) => setForm((prev) => ({ ...prev, bonus_pribadi: val })), labelTeam: "Bonus Team", team: form.bonus_team, onTeamChange: (val) => setForm((prev) => ({ ...prev, bonus_team: val })), labelJackpot: "Bonus Jackpot", jackpot: form.bonus_jackpot, onJackpotChange: (val) => setForm((prev) => ({ ...prev, bonus_jackpot: val })) })] }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "Terlambat", count: form.terlambat_count, countSuffix: getTerlambatSuffix(form.terlambat_satuan), amount: form.terlambat, amountLabel: `Uang Terlambat / ${form.terlambat_satuan ?? "hari"}`, onCountChange: (val) => setForm((prev) => ({ ...prev, terlambat_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, terlambat: val })) }) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "100% Kehadiran", count: form.kehadiran_count, countSuffix: "/ Kali", amount: form.kehadiran, amountLabel: "Uang 100% Kehadiran", onCountChange: (val) => setForm((prev) => ({ ...prev, kehadiran_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, kehadiran: val })) }) }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValueEditableBottom, { title: "Kasbon", topValue: form.saldo_kasbon, topLabel: "Total Kasbon", bottomValue: form.saldo_kasbon_count, bottomLabel: "Bayar Kasbon", onBottomChange: (val) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        saldo_kasbon_count: Math.min(val, prev.saldo_kasbon),
                                    }));
                                } }) }), _jsxs("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: [_jsx("h3", { className: "mb-4 text-base text-gray-800", children: "Tunjangan BPJS dan Pajak" }), _jsx(BonusBars, { labelPribadi: "BPJS Kesehatan", pribadi: form.tunjangan_bpjs_kesehatan, onPribadiChange: (val) => setForm((prev) => ({ ...prev, tunjangan_bpjs_kesehatan: val })), labelTeam: "BPJS Ketenagakerjaan", team: form.tunjangan_bpjs_ketenagakerjaan, onTeamChange: (val) => setForm((prev) => ({ ...prev, tunjangan_bpjs_ketenagakerjaan: val })), labelJackpot: "Tunjangan Pajak", jackpot: form.tunjangan_pajak, onJackpotChange: (val) => setForm((prev) => ({ ...prev, tunjangan_pajak: val })) })] }), _jsxs("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: [_jsx(BarValue, { title: "Potongan BPJS", value: form.potongan_bpjs_kesehatan, suffix: "Potongan BPJS Kesehatan", onChange: (val) => setForm((prev) => ({ ...prev, potongan_bpjs_kesehatan: val })) }), _jsx(BarValue, { value: form.potongan_bpjs_ketenagakerjaan, suffix: "Potongan BPJS Ketenagakerjaan", onChange: (val) => setForm((prev) => ({ ...prev, potongan_bpjs_ketenagakerjaan: val })) })] }), _jsx("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: _jsx(DualBarValue, { title: "Tunjangan Hari Raya", count: form.thr_count, countSuffix: "/ Kali", amount: form.thr, amountLabel: "Uang THR", onCountChange: (val) => setForm((prev) => ({ ...prev, thr_count: val })), onAmountChange: (val) => setForm((prev) => ({ ...prev, thr: val })) }) }), _jsxs("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: [_jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Loss" }), _jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: form.loss ? formatRupiah(form.loss) : "", onChange: (e) => {
                                                const parsed = parseRupiah(e.target.value);
                                                setForm((prev) => ({
                                                    ...prev,
                                                    loss: parsed,
                                                }));
                                            }, className: "rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsx("div", { className: "mt-4 flex justify-end gap-3", children: _jsx("button", { type: "button", onClick: handleSimpanPayroll, className: "rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600", children: "Simpan" }) })] }), _jsxs("div", { className: "col-span-2 grid grid-cols-2 gap-6 mt-4", children: [_jsxs("div", { className: "rounded-2xl border bg-white p-6 shadow-sm text-center", children: [_jsx("p", { className: "text-sm font-semibold text-green-600", children: "TOTAL PENJUMLAHAN" }), _jsxs("p", { className: "mt-2 text-xl font-bold text-gray-800", children: ["Rp ", totalPenjumlahan.toLocaleString("id-ID")] })] }), _jsxs("div", { className: "rounded-2xl border bg-white p-6 shadow-sm text-center", children: [_jsx("p", { className: "text-sm font-semibold text-red-600", children: "TOTAL PENGURANGAN" }), _jsxs("p", { className: "mt-2 text-xl font-bold text-gray-800", children: ["Rp ", totalPengurangan.toLocaleString("id-ID")] })] }), _jsxs("div", { className: "col-span-2 rounded-2xl border bg-white p-8 shadow-sm text-center", children: [_jsx("p", { className: "text-base font-semibold text-blue-600", children: "GRAND TOTAL" }), _jsxs("p", { className: "mt-3 text-2xl font-extrabold text-gray-900", children: ["Rp ", grandTotal.toLocaleString("id-ID")] })] })] })] }) })] }));
}
