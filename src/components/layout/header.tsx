"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "../../../public/logo.png";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function Header() {
  return (
    <div className="py-8 px-40 flex justify-between items-center">
      <div className="flex items-center">
        <Image src={logo} alt="Kafi Logo" width={120} height={120} />
      </div>
      <div className="flex items-center gap-8">
        <Navigation />
        <Account />
      </div>
    </div>
  );
}

function Navigation() {
  const router = useRouter();
  
  return (
    <div className="flex gap-8">
      <button 
        onClick={() => router.push("/")} 
        className="hover:text-green-600 transition select-none"
      >
        Trang chủ
      </button>
      <button 
        onClick={() => router.push("/menu")} 
        className="hover:text-green-600 transition select-none"
      >
        Menu
      </button>
      <button 
        onClick={() => router.push("/membership")} 
        className="hover:text-green-600 transition select-none"
      >
        Chương trình thành viên
      </button>
      <button 
        onClick={() => router.push("/feedback")} 
        className="hover:text-green-600 transition select-none"
      >
        Gửi feedback
      </button>
    </div>
  );
}

function Account() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isAuthenticated) {
    return (
      <div className="flex gap-10">
        <Button 
          onClick={() => router.push("/edit-profile")}
          className="w-max px-10 rounded-full bg-green-600 hover:bg-green-700 select-none"
        >
          Tài khoản
        </Button>
        <Button 
          onClick={handleLogout} 
          className="w-max px-10 rounded-full bg-red-500 hover:bg-red-600 select-none"
        >
          Đăng xuất
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <Button onClick={() => router.push("/signup")} className="w-max px-10 rounded-full select-none">Đăng ký</Button>
      <Button onClick={() => router.push("/login")} className="w-max px-10 rounded-full bg-white text-black hover:bg-gray-100 border border-black select-none">Đăng nhập</Button>
    </div>
  );
} 