"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 
import { useAuthStore } from "@/stores/auth-store";

export default function RecoveryPasswordPage() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <BackgroundImage />
      <LeftSection />
      <RightSection />
    </div>
  );
}

const BackgroundImage = () => (
  <Image
    src={bgImage}
    alt="Background"
    fill
    className="object-cover w-full h-full fixed inset-0 -z-10"
    priority
  />
);

const LeftSection = () => (
  <div className="w-1/2 flex flex-col justify-center items-center relative">
    <Logo />
    <CoffeeSelectionImage />
  </div>
);

const Logo = () => (
  <div className="absolute top-8 left-36 flex items-center space-x-2">
    <Image src={logo} alt="Kafi Logo" width={400} height={400} />
  </div>
);

const CoffeeSelectionImage = () => (
  <div className="mt-96 -ml-32">
    <Image
      src={groupcf}
      alt="Coffee Selection"
      width={950}
      height={950}
      className="object-cover"
    />
  </div>
);

const RightSection = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError("Vui lòng nhập mã xác nhận từ email");
      return;
    }
    
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/2 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-4xl font-bold mb-6">Đặt Lại Mật Khẩu</h1>
      
      {error && (
        <div className="w-4/6 text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="w-4/6 space-y-4">
          <div className="text-green-600 text-sm mb-2">
            Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển đến trang đăng nhập...
          </div>
        </div>
      ) : (
        <>
          <div className="w-4/6 text-sm mb-4">
            Nhập mã xác nhận đã được gửi đến email của bạn và mật khẩu mới.
          </div>
          
          <InputField 
            label="Mã xác nhận" 
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          
          <InputField 
            label="Mật khẩu mới" 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          
          <InputField 
            label="Xác nhận mật khẩu" 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
            {!isLoading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            )}
          </button>
          
          <BackToLoginLink />
        </>
      )}
    </form>
  );
};

const BackToLoginLink = () => (
  <p className="mt-6 text-sm">
    <Link href="/login" className="text-green-600 font-semibold">Quay lại đăng nhập</Link>
  </p>
);

interface InputFieldProps {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField = ({ label, placeholder, textarea, type, value, onChange }: InputFieldProps) => (
  <div className="w-4/6">
    <label className="block font-medium mb-1">{label}</label>
    {textarea ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
        rows={4}
      ></textarea>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
      />
    )}
  </div>
);
