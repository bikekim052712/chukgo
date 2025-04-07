import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown, MapPin, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // 로그아웃 처리
  const handleLogout = () => {
    logoutMutation.mutate();
    closeMobileMenu();
  };

  // 네비게이션 아이템
  const navItems = [
    { name: "홈", href: "/" },
    { name: "코치 찾기", href: "/coaches/search" },
    { name: "레슨 신청", href: "/lesson-request" },
    { name: "레슨 후기", href: "/reviews" },
    { name: "보험보장분석", href: "/insurance-analysis" },
    { name: "커뮤니티", href: "https://cafe.naver.com/forland", external: true },
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
              item.external ? (
                <a 
                  key={item.name} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-[#5D3FD3] transition-colors text-gray-700"
                >
                  {item.name}
                </a>
              ) : (
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
              )
            ))}
          </nav>
          
          {/* 데스크톱 로그인/로그아웃 버튼 */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <User className="h-4 w-4 text-[#5D3FD3]" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.fullName || user.username}
                    {user.isAdmin && <span className="ml-1 text-xs text-[#5D3FD3]">(관리자)</span>}
                    {user.isCoach && <span className="ml-1 text-xs text-[#5D3FD3]">(코치)</span>}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center space-x-1 h-9"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium">
                  <Link href="/auth" className="text-gray-700 hover:text-[#5D3FD3]">로그인/회원가입</Link>
                </div>
                <Button asChild className="bg-[#5D3FD3] hover:bg-[#4A00E0] text-white text-sm font-medium rounded-md h-9">
                  <Link href="/coach-signup">코치가입</Link>
                </Button>
              </div>
            )}
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
                item.external ? (
                  <a 
                    key={item.name} 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 text-sm font-medium transition-colors text-gray-700 hover:text-[#5D3FD3]"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </a>
                ) : (
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
                )
              ))}
              
              <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col space-y-2">
                {user ? (
                  <>
                    <div className="py-2 flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#5D3FD3]" />
                      <span className="text-sm font-medium text-gray-700">
                        {user.fullName || user.username}
                        {user.isAdmin && <span className="ml-1 text-xs text-[#5D3FD3]">(관리자)</span>}
                        {user.isCoach && <span className="ml-1 text-xs text-[#5D3FD3]">(코치)</span>}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center space-x-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="py-2 text-sm font-medium text-gray-700">
                      <Link 
                        href="/auth" 
                        className="text-gray-700 hover:text-[#5D3FD3]"
                        onClick={closeMobileMenu}
                      >
                        로그인/회원가입
                      </Link>
                    </div>
                    <Button asChild className="bg-[#5D3FD3] hover:bg-[#4A00E0] text-white justify-center">
                      <Link href="/coach-signup" onClick={closeMobileMenu}>코치가입</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
