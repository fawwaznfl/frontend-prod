import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function DualBarValue({ title, count, countSuffix, amount, amountLabel, onCountChange, onAmountChange, }) {
    const [countDisplay, setCountDisplay] = useState("");
    const [amountDisplay, setAmountDisplay] = useState("");
    useEffect(() => {
        setCountDisplay(count > 0 ? String(count) : "");
    }, [count]);
    useEffect(() => {
        setAmountDisplay(amount > 0 ? amount.toLocaleString("id-ID") : "");
    }, [amount]);
    return (_jsxs("div", { className: "flex flex-col space-y-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: title }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [onCountChange ? (_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: countDisplay, onChange: (e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            setCountDisplay(raw);
                            onCountChange(raw ? Number(raw) : 0);
                        }, className: "flex-1 bg-orange-400 px-4 py-2 text-black outline-none" })) : (_jsx("div", { className: "flex-1 bg-orange-400 px-4 py-2 text-black", children: count.toLocaleString("id-ID") })), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: countSuffix })] }), _jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [onAmountChange ? (_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: amountDisplay, onChange: (e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const num = Number(raw) || 0;
                            setAmountDisplay(raw ? num.toLocaleString("id-ID") : "");
                            onAmountChange(num);
                        }, className: "flex-1 bg-white px-4 py-2 text-black outline-none" })) : (_jsx("div", { className: "flex-1 bg-white px-4 py-2 text-black", children: amount.toLocaleString("id-ID") })), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: amountLabel })] })] }));
}
