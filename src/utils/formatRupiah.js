"use strict";
const formatRupiah = (value) => value.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});
