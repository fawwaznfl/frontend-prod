import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function BarValue({ title, value, suffix, onChange, }) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        setDisplay(value ? value.toLocaleString("id-ID") : "");
    }, [value]);
    return (_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: title }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [_jsx("input", { type: "text", inputMode: "numeric", value: display, placeholder: "0", onChange: (e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const num = Number(raw) || 0;
                            setDisplay(raw ? num.toLocaleString("id-ID") : "");
                            onChange?.(num);
                        }, className: "flex-1 bg-orange-400 px-4 py-2 text-black outline-none" }), suffix && (_jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: suffix }))] })] }));
}
