import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import BottomNav from "../../../components/common/BottomNav";
import api from "../../../api/axios";
export default function NotificationPegawai() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            //console.log("Notifikasi pegawai:", res.data);
            setItems(Array.isArray(res.data) ? res.data : []);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, []);
    // ✅ Klik untuk mark as read
    const handleClick = async (item) => {
        console.log("Item clicked:", item);
        // Cek apakah ini notifikasi personal (punya user_id)
        const isPersonalNotification = item.user_id != null;
        // Cek apakah sudah dibaca (gunakan is_read dari backend)
        const isUnread = !item.is_read && !item.read_at;
        if (isUnread && isPersonalNotification) {
            // ✅ OPTIMISTIC UPDATE: Update UI dulu
            setItems(prevItems => prevItems.map(i => i.id === item.id
                ? { ...i, is_read: true, read_at: new Date().toISOString() }
                : i));
            // Kirim request ke backend
            try {
                await api.post(`/notifications/${item.id}/read`);
            }
            catch (err) {
                console.error("Gagal mark as read:", err);
                // Rollback jika gagal
                fetchNotifications();
            }
        }
        else if (!isPersonalNotification) {
            console.log("Notifikasi broadcast, tidak bisa di-mark as read");
        }
    };
    // USER INTERFACE
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-28", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 pb-10 rounded-b-[32px] shadow-lg pt-8", children: _jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: () => navigate("/home-pegawai"), className: "p-2 mr-2", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 text-center", children: _jsx("h1", { className: "text-lg font-semibold", children: "Notifikasi" }) }), _jsx(Bell, { className: "w-5 h-5 opacity-80" })] }) }), _jsx("div", { className: "mx-5 -mt-10", children: _jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-lg border border-gray-100", children: [_jsxs("p", { className: "text-sm font-medium text-gray-800", children: [items.filter((i) => !i.is_read && !i.read_at).length, " notifikasi belum dibaca"] }), _jsx("p", { className: "text-xs text-gray-400", children: "Ketuk notifikasi untuk menandai sebagai dibaca" })] }) }), _jsxs("div", { className: "px-5 mt-5 space-y-3", children: [loading && (_jsx("div", { className: "text-center text-gray-400 py-10", children: "Memuat notifikasi..." })), !loading && items.length === 0 && (_jsx("div", { className: "text-center text-gray-400 py-10", children: "Tidak ada notifikasi" })), items.map((item) => {
                        const unread = !item.is_read && !item.read_at;
                        const notif = item.notification;
                        return (_jsx("button", { onClick: () => handleClick(item), className: `w-full text-left p-4 rounded-2xl shadow-sm border transition
                ${unread
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-white border-gray-100 hover:bg-gray-50"}
              `, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${unread ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}
                  `, children: notif?.type?.includes("approved") ? (_jsx("span", { className: "text-lg", children: "\u2713" })) : notif?.type?.includes("rejected") ? (_jsx("span", { className: "text-lg", children: "\u2717" })) : notif?.type?.includes("meeting") ? (_jsx("span", { className: "text-lg", children: "\uD83D\uDCC5" })) : notif?.type?.includes("contract") ? (_jsx("span", { className: "text-lg", children: "\uD83D\uDCC4" })) : (_jsx(Bell, { className: "w-4 h-4" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-gray-800", children: notif?.title }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5 line-clamp-2", children: notif?.message }), _jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: new Date(item.created_at).toLocaleString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }) })] }), unread && (_jsx("span", { className: "w-2 h-2 mt-1 rounded-full bg-indigo-500 shrink-0" }))] }) }, item.id));
                    })] }), _jsx(BottomNav, {})] }));
}
