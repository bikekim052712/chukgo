import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown, MapPin } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showSubregions, setShowSubregions] = useState(false);

  // 시/군/구 데이터 (간소화된 예시 데이터)
  const subregions = {
    "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "경기도": ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "여주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
    "부산광역시": ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setShowSubregions(region !== "");
  };

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
              <span className="text-[#6b21ff] font-bold text-xl">축고</span>
            </Link>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`text-xs hover:text-[#6b21ff] transition-colors ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#5a18dd] font-bold'
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
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg shadow-sm overflow-hidden">
              <Link href="/login" className="text-xs font-medium px-2 py-1.5 hover:bg-gray-200 transition-colors">로그인</Link>
              <div className="w-[1px] h-4 bg-gray-300"></div>
              <Link href="/signup" className="text-xs font-medium px-2 py-1.5 hover:bg-gray-200 transition-colors">회원가입</Link>
            </div>
            
            <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white text-xs rounded-md px-3 py-1 h-7 ml-1">
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
                      className={`block py-2 transition-colors text-xs ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#5a18dd] font-bold'
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
      
      {/* 축구 배너 섹션 */}
      <div className="bg-gradient-to-r from-[#f0ebff] to-[#e9f5ff] shadow-sm border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="py-3 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#5a18dd] mb-1">최고의 축구 코치를 만나보세요</h3>
                <p className="text-xs text-gray-600 mb-2">개인 맞춤형 레슨부터 그룹 트레이닝까지, 모든 연령대에 적합한 프로그램</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#6b21ff] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-gray-700">검증된 코치진</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#6b21ff] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-gray-700">맞춤형 커리큘럼</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#6b21ff] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-gray-700">투명한 리뷰 시스템</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-32 h-24">
                <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center relative overflow-hidden border-2 border-[#6b21ff]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-16 w-16 text-[#6b21ff]">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="white" />
                    <path d="M12 4 L12 8 M12 16 L12 20 M4 12 L8 12 M16 12 L20 12 M6 6 L9 9 M15 15 L18 18 M6 18 L9 15 M15 9 L18 6" stroke="currentColor" strokeWidth="1" />
                    <polygon points="12,8 8,15 16,15" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
