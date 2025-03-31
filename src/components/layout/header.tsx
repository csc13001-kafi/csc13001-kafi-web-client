"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "../../../public/logo.png";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react";

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
  const { isAuthenticated, logout, user, token, getUserInfo } = useAuthStore();
  const [displayName, setDisplayName] = useState<string>('User');
  const [initial, setInitial] = useState<string>('U');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Run once on component mount to fetch user data if needed
  useEffect(() => {
    const fetchUserDataOnMount = async () => {
      console.log("Header Account component mounted");
      
      if (isAuthenticated && token) {
        console.log("User is authenticated with token");
        
        // If no user data at all, try to fetch it
        if (!user) {
          console.log("No user data, fetching from API...");
          try {
            await getUserInfo();
          } catch (error) {
            console.error("Failed to fetch user data on mount:", error);
          }
        }
        // If user exists but no name, also try to fetch more complete data
        else if (user && !user.username) {
          console.log("User exists but missing name, fetching more data...");
          try {
            await getUserInfo();
          } catch (error) {
            console.error("Failed to fetch additional user data:", error);
            
            // If we still don't have a name, use email or set a default
            if (user.email) {
              console.log("Using email as fallback for name:", user.email);
              setDisplayName(user.email.split('@')[0]);
              setInitial((user.email[0] || 'U').toUpperCase());
            }
          }
        }
      }
    };
    
    fetchUserDataOnMount();
  }, [isAuthenticated, token, user, getUserInfo, setDisplayName, setInitial]);

  // This effect updates the displayed name whenever user data changes
  useEffect(() => {
    if (user) {
      console.log("User data updated in header:", user);
      // First try to get the name from user object
      if (user.name) {
        console.log("Setting display name to:", user.name);
        setDisplayName(user.name);
        setInitial((user.name[0] || 'U').toUpperCase());
      } 
      // If no name, try to use username
      else if (user.username) {
        console.log("Setting display name to username:", user.username);
        setDisplayName(user.username);
        setInitial((user.username[0] || 'U').toUpperCase());
      }
      // Fall back to email if available
      else if (user.email) {
        console.log("Setting display name to email:", user.email);
        setDisplayName(user.email.split('@')[0]);
        setInitial((user.email[0] || 'U').toUpperCase());
      }
    } else {
      console.log("No user data available");
      setDisplayName('User');
      setInitial('U');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      // Show loading state
      setIsLoggingOut(true);
      
      // Call the async logout function
      await logout();
      
      // Redirect to login page after successful logout
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect to login page even if there's an error
      router.push("/login");
    } finally {
      // Clear loading state
      setIsLoggingOut(false);
    }
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {initial}
            </div>
            <span className="font-medium">{displayName}</span>
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
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất"
              )}
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