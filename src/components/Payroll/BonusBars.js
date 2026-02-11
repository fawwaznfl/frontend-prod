import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function BonusBars({ pribadi, team, jackpot, labelPribadi, labelTeam, labelJackpot, onPribadiChange, onTeamChange, onJackpotChange, }) {
    const [p, setP] = useState("");
    const [t, setT] = useState("");
    const [j, setJ] = useState("");
    useEffect(() => {
        setP(pribadi > 0 ? pribadi.toLocaleString("id-ID") : "");
    }, [pribadi]);
    useEffect(() => {
        setT(team > 0 ? team.toLocaleString("id-ID") : "");
    }, [team]);
    useEffect(() => {
        setJ(jackpot > 0 ? jackpot.toLocaleString("id-ID") : "");
    }, [jackpot]);
    const renderBar = (value, display, setDisplay, onChange, label) => (_jsxs("div", { className: "flex overflow-hidden rounded-xl border bg-gray-100", children: [onChange ? (_jsx("input", { type: "text", inputMode: "numeric", placeholder: "0", value: display, onChange: (e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const num = Number(raw) || 0;
                    setDisplay(raw ? num.toLocaleString("id-ID") : "");
                    onChange(num);
                }, className: "flex-1 bg-orange-400 px-4 py-2 text-black outline-none" })) : (_jsx("div", { className: "flex-1 bg-orange-400 px-4 py-2 text-black", children: value.toLocaleString("id-ID") })), _jsx("div", { className: "bg-gray-200 px-4 py-2 text-gray-700 whitespace-nowrap", children: label })] }));
    return (_jsxs("div", { className: "flex flex-col space-y-4", children: [renderBar(pribadi, p, setP, onPribadiChange, labelPribadi), renderBar(team, t, setT, onTeamChange, labelTeam), renderBar(jackpot, j, setJ, onJackpotChange, labelJackpot)] }));
}
