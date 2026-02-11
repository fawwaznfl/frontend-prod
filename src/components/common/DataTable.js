import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
export function DataTable({ columns, data, searchPlaceholder = "Search...", disableSearch = false, // <-- DEFAULT FALSE
 }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    // FILTER (only run if search enabled)
    const filteredData = useMemo(() => {
        if (disableSearch || !search)
            return data;
        return data.filter((item) => columns.some((col) => {
            if (!col.accessor)
                return false;
            return String(item[col.accessor] ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());
        }));
    }, [search, data, columns, disableSearch]);
    // SORT
    const sortedData = useMemo(() => {
        if (!sortKey)
            return filteredData;
        return [...filteredData].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (valA < valB)
                return sortOrder === "asc" ? -1 : 1;
            if (valA > valB)
                return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder]);
    // PAGINATION
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);
    const handleSort = (key) => {
        if (!key)
            return;
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }
        else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };
    return (_jsxs("div", { className: "w-full mt-4", children: [!disableSearch && (_jsx("div", { className: "mb-3", children: _jsx("input", { type: "text", placeholder: searchPlaceholder, value: search, onChange: (e) => setSearch(e.target.value), className: "w-full p-2 border rounded-lg" }) })), _jsx("div", { className: "overflow-x-auto border rounded-lg", children: _jsxs("table", { className: "min-w-full bg-white", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-gray-100", children: columns.map((col, index) => (_jsx("th", { style: { width: col.width }, className: `p-3 text-left ${col.accessor ? "cursor-pointer" : ""}`, onClick: () => handleSort(col.accessor), children: _jsxs("div", { className: "flex items-center gap-1", children: [col.header, sortKey === col.accessor && (_jsx("span", { children: sortOrder === "asc" ? "▲" : "▼" }))] }) }, index))) }) }), _jsxs("tbody", { children: [paginatedData.map((item, rowIndex) => (_jsx("tr", { className: "border-t hover:bg-gray-50", children: columns.map((col, colIndex) => (_jsx("td", { className: "p-3", children: col.cell
                                            ? col.cell(item, (page - 1) * pageSize + rowIndex)
                                            : col.accessor
                                                ? String(item[col.accessor] ?? "-")
                                                : "-" }, colIndex))) }, rowIndex))), paginatedData.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "text-center p-4 text-gray-500", children: "No data found" }) }))] })] }) }), _jsxs("div", { className: "flex justify-between items-center mt-3 px-1", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Page ", page, " of ", totalPages] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "px-3 py-1 border rounded disabled:text-gray-400", children: "Prev" }), _jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages, className: "px-3 py-1 border rounded disabled:text-gray-400", children: "Next" })] })] })] }));
}
