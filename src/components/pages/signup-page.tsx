"use client";
import Image from "next/image";
import groupcf from "../../../public/groupcf.png"; 
import logo from "../../../public/logo.png"; 
import bgImage from "../../../public/nen.png"; 

export default function SignupPage() {
  return (
    <div className="relative flex h-screen">
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
    className="object-cover -z-10"
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

const RightSection = () => (
  <div className="w-1/2 flex flex-col justify-center items-center space-y-2">
    <h1 className="text-4xl font-bold mb-6">Đăng Ký</h1>
    <InputField label="Họ và tên" type="text" />
    <InputField label="Email" type="email" />
    <InputField label="Số điện thoại" type="tel" />
    <InputField label="Mật khẩu" type="password" />
    <InputField label="Xác nhận mật khẩu" type="password" />
    <div className="h-2"></div>
    <SignupButton />
    <div className="h-2"></div>
    <LoginPrompt />
  </div>
);

const SignupButton = () => (
  <button className="bg-gradient-to-r from-[#1E4522] to-[#3A683D] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition">
    Đăng Ký
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"></path>
    </svg>
  </button>
);

const LoginPrompt = () => (
  <p className="text-sm">
    Đã có tài khoản?{" "}
    <a href="#" className="text-green-600 font-semibold">Đăng Nhập</a>
  </p>
);

interface InputFieldProps {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}

const InputField = ({ label, placeholder, textarea, type }: InputFieldProps) => (
  <div className="w-4/6">
    <label className="block font-medium mb-1">{label}</label>
    {textarea ? (
      <textarea
        placeholder={placeholder}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
        rows={4}
      ></textarea>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 bg-transparent text-black rounded-full border border-black focus:outline-none placeholder:text-gray-500"
      />
    )}
  </div>
);
