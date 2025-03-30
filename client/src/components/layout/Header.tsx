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
    { name: "레슨요청", href: "#categories" },
    { name: "코치찾기", href: "/coaches" },
    { name: "레슨후기", href: "/reviews" },
    { name: "커뮤니티", href: "/community" },
    { name: "이용방법", href: "/how-to-use" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[60px]">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#6b21ff] rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">축</span>
                </div>
                <span className="text-[#6b21ff] font-bold text-2xl">축고</span>
              </div>
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
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg shadow-sm overflow-hidden">
              <Link href="/login" className="text-sm font-medium px-4 py-2 hover:bg-gray-200 transition-colors">로그인</Link>
              <div className="w-[1px] h-6 bg-gray-300"></div>
              <Link href="/signup" className="text-sm font-medium px-4 py-2 hover:bg-gray-200 transition-colors">회원가입</Link>
            </div>
            
            <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white text-sm rounded-md px-4 py-2 h-9 ml-2">
              <Link href="/coach-signup">코치가입</Link>
            </Button>
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
              <div className="flex bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                <Link href="/login" className="flex-1 text-center text-sm font-medium py-2 hover:bg-gray-200 transition-colors" onClick={closeMobileMenu}>로그인</Link>
                <div className="w-[1px] bg-gray-300"></div>
                <Link href="/signup" className="flex-1 text-center text-sm font-medium py-2 hover:bg-gray-200 transition-colors" onClick={closeMobileMenu}>회원가입</Link>
              </div>
              
              <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] w-full justify-center mt-2">
                <Link href="/coach-signup" onClick={closeMobileMenu}>코치가입</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* 검색 바 */}
      <div className="bg-[#f8f5ff] shadow-sm border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="py-3 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-2 border border-gray-100 flex flex-row items-center">
              <div className="flex-1 flex items-center gap-2 px-3">
                <div className="relative w-40">
                  <select className="w-full appearance-none bg-white border-none rounded-lg text-sm text-gray-800 font-medium py-2 pl-3 pr-8 focus:outline-none">
                    <option value="">지역 전체</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
                
                <div className="flex-1 flex items-center">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="내 주변 축구 코치 찾기"
                    className="w-full px-1 py-2 text-base border-none focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              
              <Button className="bg-[#6b21ff] hover:bg-[#5a18dd] min-w-[100px] h-10 text-white font-medium">
                검색
              </Button>
            </div>
            
            {/* 인기 검색어 */}
            <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
              <div className="flex gap-1 items-center">
                <span>인기 검색어:</span>
                <div className="flex gap-2">
                  <span className="text-[#6b21ff] font-medium hover:underline cursor-pointer">개인레슨</span>
                  <span className="text-[#6b21ff] font-medium hover:underline cursor-pointer">그룹레슨</span>
                  <span className="text-[#6b21ff] font-medium hover:underline cursor-pointer">골키퍼</span>
                  <span className="text-[#6b21ff] font-medium hover:underline cursor-pointer">주말레슨</span>
                </div>
              </div>
              <Link href="/search" className="text-gray-600 hover:underline">상세검색</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
