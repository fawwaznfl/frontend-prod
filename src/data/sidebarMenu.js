import { jsx as _jsx } from "react/jsx-runtime";
import { AbsensiIcon, CompanyIcon, ContractIcon, CutiIcon, DivisionIcon, DokumenPegawaiIcon, GridIcon, InformationIcon, InventoryIcon, KeuanganIcon, LaporanIcon, LocationIcon, OvertimeIcon, PenugasanIcon, PeopleMinusIcon, RapatIcon, RekapDataIcon, RoleIcon, ShiftIcon, UserAddIcon, UserCircleIcon, VisitIcon, } from "../icons";
// Base menu per role
export const getSidebarMenu = (role) => {
    const baseMenu = [
        { icon: _jsx(GridIcon, {}), name: "Dashboard", path: "/dashboard" },
        { icon: _jsx(UserAddIcon, {}), name: "Pegawai", path: "/pegawai" },
        { icon: _jsx(ShiftIcon, {}), name: "Request Shift", path: "/shift-request-approval" },
        { icon: _jsx(RoleIcon, {}), name: "Role", path: "/role" },
        { icon: _jsx(ContractIcon, {}), name: "Kontrak", path: "/kontrak" },
        { icon: _jsx(PeopleMinusIcon, {}), name: "Pegawai Keluar", path: "/pegawai-keluar" },
        { icon: _jsx(DivisionIcon, {}), name: "Divisi", path: "/divisi" },
        { icon: _jsx(ShiftIcon, {}), name: "Shift", path: "/shift" },
        { icon: _jsx(LocationIcon, {}), name: "Lokasi", path: "/lokasi" },
        { icon: _jsx(RekapDataIcon, {}), name: "Rekap Data", path: "/rekap-data" },
        { icon: _jsx(CutiIcon, {}), name: "Cuti", path: "/cuti" },
        {
            name: "Absensi",
            icon: _jsx(AbsensiIcon, {}),
            subItems: [
                { name: "Absen", path: "/pegawai/dashboard" },
                { name: "Data Absen", path: "/data-absen" },
                { name: "Absen Dinas Luar", path: "/dinas-luar" },
                { name: "Data Dinas Luar", path: "/data-dinas-luar" },
            ],
        },
        {
            name: "OverTime",
            icon: _jsx(OvertimeIcon, {}),
            subItems: [
                { name: "Lembur", path: "/lembur" },
                { name: "Data Lembur", path: "/data-lembur" },
            ],
        },
        { icon: _jsx(VisitIcon, {}), name: "Kunjungan", path: "/kunjungan" },
        { icon: _jsx(PenugasanIcon, {}), name: "Penugasan", path: "/penugasan" },
        { icon: _jsx(RapatIcon, {}), name: "Rapat", path: "/rapat" },
        { icon: _jsx(LaporanIcon, {}), name: "Laporan Kerja", path: "/laporan-kerja" },
        { icon: _jsx(InventoryIcon, {}), name: "Inventory", path: "/inventory" },
        {
            name: "Keuangan",
            icon: _jsx(KeuanganIcon, {}),
            subItems: [
                { name: "Payroll", path: "/payroll" },
                { name: "Kasbon", path: "/kasbon" },
                { name: "Reimbursement", path: "/reimbursement" },
                { name: "Kategori Reimbursement", path: "/kategori-reimbursement" },
            ],
        },
        { icon: _jsx(DokumenPegawaiIcon, {}), name: "Dokumen Pegawai", path: "/dokumen-pegawai" },
        { icon: _jsx(InformationIcon, {}), name: "Informasi dan Berita", path: "/berita" },
        { icon: _jsx(UserCircleIcon, {}), name: "User Profile", path: "/profile" },
    ];
    // Tambah menu Company hanya untuk superadmin
    if (role === "superadmin") {
        baseMenu.splice(1, 0, { icon: _jsx(CompanyIcon, {}), name: "Company", path: "/company" });
    }
    return baseMenu;
};
// Others menu
export const othersMenu = [];
