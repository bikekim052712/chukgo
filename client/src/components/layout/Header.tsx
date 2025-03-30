import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "전체보기", href: "#categories" },
    { name: "코치찾기", href: "/coaches" },
    { name: "이용", href: "/how-to-use" },
    { name: "커뮤니티", href: "/community" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[60px]">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <span className="text-[#6b21ff] font-bold text-2xl">축고</span>
            </Link>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`text-sm hover:text-[#6b21ff] transition-colors ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#6b21ff] font-medium'
                          : 'text-neutral-800'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-[#6b21ff]">로그인</Link>
              <span className="text-gray-300">|</span>
              <Link href="/signup" className="text-sm text-gray-600 hover:text-[#6b21ff]">회원가입</Link>
              
              <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white text-sm rounded-md px-4 py-2 h-9">
                <Link href="/coach-signup">코치가입</Link>
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`block py-2 transition-colors ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#6b21ff] font-medium'
                          : 'text-neutral-800'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-200 mt-4">
              <div className="flex justify-between">
                <Link href="/login" className="text-sm text-gray-600" onClick={closeMobileMenu}>로그인</Link>
                <Link href="/signup" className="text-sm text-gray-600" onClick={closeMobileMenu}>회원가입</Link>
              </div>
              
              <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] w-full justify-center mt-2">
                <Link href="/coach-signup" onClick={closeMobileMenu}>코치가입</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* 검색 바 (숨고 스타일) */}
      <div className="bg-gray-100 py-3 border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="어떤 유소년 축구 코치를 찾으시나요?"
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:border-[#6b21ff] focus:ring-1 focus:ring-[#6b21ff] shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
