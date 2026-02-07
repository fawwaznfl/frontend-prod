import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";



export default function ResetPasswordForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      Swal.fire("Error", "Password wajib diisi!", "error");
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire("Error", "Password tidak sama!", "error");
      return;
    }

    try {
      await api.post("/reset-password", { email, password, password_confirmation: passwordConfirmation });
      Swal.fire("Sukses", "Password berhasil diubah!", "success");
      navigate("/");
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
              Masukan Password Baru
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Password Baru */}
                <div className="relative"> 
                    <Label>
                    Password Baru <span className="text-error-500">*</span>
                    </Label>
                    <Input
                    placeholder="Password Baru"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10" 
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[68%] -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Konfirmasi Password */}
                <div className="relative">
                <Label>
                    Konfirmasi Password <span className="text-error-500">*</span>
                </Label>
                <Input
                    placeholder="Konfirmasi Password"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute right-3 top-[68%] -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                >
                    {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
                </div>
              <div>
                <Button type="submit" className="w-full" size="sm">
                  Ubah Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}