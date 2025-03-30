import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown, MapPin } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 네비게이션 아이템
  const navItems = [
    { name: "홈", href: "/" },
    { name: "코치 찾기", href: "/coaches" },
    { name: "레슨 목록", href: "/lessons" },
    { name: "레슨 후기", href: "/reviews" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full z-50 top-0 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="rounded-full bg-[#5D3FD3] w-8 h-8 flex items-center justify-center mr-2">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="12,6 7,12 12,18 17,12"></polygon>
                </svg>
              </div>
              <span className="text-[#5D3FD3] font-bold text-xl">축고</span>
            </Link>
          </div>
          
          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`text-sm font-medium hover:text-[#5D3FD3] transition-colors ${
                  (item.href === location || 
                   (item.href !== '/' && location.startsWith(item.href)))
                    ? 'text-[#5D3FD3]'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* 데스크톱 로그인/회원가입/코치가입 버튼 */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/login" 
              className="text-sm text-gray-700 hover:text-[#5D3FD3] font-medium px-2 py-2"
            >
              로그인
            </Link>
            <Link 
              href="/signup" 
              className="text-sm text-gray-700 hover:text-[#5D3FD3] font-medium px-2 py-2"
            >
              회원가입
            </Link>
            <Button asChild className="bg-[#5D3FD3] hover:bg-[#4A00E0] text-white text-sm font-medium rounded-md h-9">
              <Link href="/coach-signup">코치가입</Link>
            </Button>
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`py-2 text-sm font-medium transition-colors ${
                    (item.href === location || 
                     (item.href !== '/' && location.startsWith(item.href)))
                      ? 'text-[#5D3FD3]'
                      : 'text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col space-y-2">
                <Link 
                  href="/login" 
                  className="py-2 text-sm font-medium text-gray-700"
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
                <Link 
                  href="/signup" 
                  className="py-2 text-sm font-medium text-gray-700"
                  onClick={closeMobileMenu}
                >
                  회원가입
                </Link>
                <Button asChild className="bg-[#5D3FD3] hover:bg-[#4A00E0] text-white justify-center">
                  <Link href="/coach-signup" onClick={closeMobileMenu}>코치가입</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
