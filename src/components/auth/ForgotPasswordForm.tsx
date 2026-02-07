import { useState, FormEvent } from "react";
import Label from "../form/Label";
import { useNavigate } from "react-router-dom";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      Swal.fire("Error", "Email wajib diisi!", "error");
      return;
    }

    try {
      await api.post("/forgot-password", { email });
      // kalau sukses, langsung arahkan ke reset password
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Lupa Password
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>{" "}
                </Label>
                <Input placeholder="Masukan Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Button type="submit" className="w-full" size="sm">
                  Lanjut
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}