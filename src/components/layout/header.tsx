"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "../../../public/logo.png";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

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
  const { isAuthenticated, logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="font-medium">{user?.name || 'User'}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-white rounded-md p-2 shadow-lg border border-gray-200"
            sideOffset={5}
            align="end"
          >
            <DropdownMenu.Item
              className="flex items-center px-4 py-2 text-sm outline-none cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => router.push("/edit-profile")}
            >
              Chỉnh sửa thông tin
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex items-center px-4 py-2 text-sm outline-none cursor-pointer hover:bg-gray-100 rounded-md text-red-600"
              onClick={handleLogout}
            >
              Đăng xuất
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }

  return (
    <div className="flex gap-6">
      <Button onClick={() => router.push("/signup")} className="w-max px-10 rounded-full select-none">Đăng ký</Button>
      <Button onClick={() => router.push("/login")} className="w-max px-10 rounded-full bg-white text-black hover:bg-gray-100 border border-black select-none">Đăng nhập</Button>
    </div>
  );
} 