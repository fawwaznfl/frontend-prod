import api from "../api/axios";
export const getSelfAbsensi = () => api.get("/absensi/self");
export const absenMasuk = (payload) => api.post("/absensi/masuk", payload);
export const absenPulang = (payload) => api.post("/absensi/pulang", payload);
