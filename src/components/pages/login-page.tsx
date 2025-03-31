"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function LoginPage() {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, error: authError } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      await login(email, password);
      // Check for auth error after login attempt
      const { error, isAuthenticated } = useAuthStore.getState();
      
      if (error) {
        setError(error);
      } else if (isAuthenticated) {
        router.push("/"); // Redirect to home page instead of dashboard
      }
    } catch {
      setError("An error occurred during login");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-1/2 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-4xl font-bold mb-6">Đăng Nhập</h1>
      
      {(error || authError) && (
        <div className="w-4/6 text-red-500 text-sm mb-2">
          {error || authError}
        </div>
      )}
      
      <InputField 
        label="Email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <InputField 
        label="Mật khẩu" 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <ForgotPasswordLink />
      
      <button 
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? "Đang xử lý..." : "Bắt đầu"}
        {!isLoading && (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        )}
      </button>
      
      <SignUpPrompt />
    </form>
  );
};

const ForgotPasswordLink = () => (
  <div className="w-4/6 text-right text-sm text-gray-600 hover:text-gray-800">
    <Link href="/forgot-password">Quên mật khẩu?</Link>
  </div>
);

const SignUpPrompt = () => (
  <p className="mt-6 text-sm">
    Chưa có tài khoản?{" "}
    <Link href="/signup" className="text-green-600 font-semibold">Đăng Ký</Link>
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
