import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUnreadCount } from "../../api/notification";
export default function NotificationBell({ onClick }) {
    const [unread, setUnread] = useState(0);
    useEffect(() => {
        fetchUnread();
    }, []);
    const fetchUnread = async () => {
        const res = await getUnreadCount();
        setUnread(res.data.unread);
    };
    return (_jsxs("div", { className: "relative cursor-pointer", onClick: onClick, children: [_jsx(Bell, { size: 22 }), unread > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full", children: unread }))] }));
}
