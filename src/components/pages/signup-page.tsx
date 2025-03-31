"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 
import { useAuthStore } from "@/stores/auth-store";

export default function SignupPage() {
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signup, isLoading, error: authError, clearError } = useAuthStore();
  const router = useRouter();

  // Clear any previous errors when the component mounts
  useEffect(() => {
    clearError();
    return () => {
      // Also clear errors when unmounting
      clearError();
    };
  }, [clearError]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await signup(name, email, phone, password);
      // Check if registration was successful
      const { error, isAuthenticated } = useAuthStore.getState();
      
      if (error) {
        setError(error);
      } else if (isAuthenticated) {
        // Logout the user after successful signup
        const { logout } = useAuthStore.getState();
        logout();
        
        setSuccess(true);
        
        router.push("/login");
      }
    } catch {
      setError("An error occurred during registration");
    }
  };

  // Clear errors when navigating away using the Link component
  const handleNavigation = () => {
    // Clear both local and store errors
    setError(null);
    clearError();
  };

  return (
    <form onSubmit={handleSignup} className="w-1/2 flex flex-col justify-center items-center space-y-2">
      <h1 className="text-4xl font-bold mb-6">Đăng Ký</h1>
      
      {(error || authError) && (
        <div className="w-4/6 text-red-500 text-sm mb-2">
          {error || authError}
        </div>
      )}

      {success && (
        <div className="w-4/6 text-green-600 text-sm mb-2">
          Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
        </div>
      )}
      
      {!success && (
        <>
          <InputField 
            label="Họ và tên" 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <InputField 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <InputField 
            label="Số điện thoại" 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          
          <InputField 
            label="Mật khẩu" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <InputField 
            label="Xác nhận mật khẩu" 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <div className="h-2"></div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
            {!isLoading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            )}
          </button>
          
          <div className="h-2"></div>
          
          <LoginPrompt onNavigate={handleNavigation} />
        </>
      )}
    </form>
  );
};

const LoginPrompt = ({ onNavigate }: { onNavigate: () => void }) => (
  <p className="text-sm">
    Đã có tài khoản?{" "}
    <Link href="/login" onClick={onNavigate} className="text-green-600 font-semibold">Đăng Nhập</Link>
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
