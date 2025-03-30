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
      
      {/* 검색 바 (숨고 스타일) */}
      <div className="bg-[#f8f9fa] shadow-sm border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="py-3 max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="flex relative border border-gray-300 rounded-md shadow-sm bg-white">
                  <select 
                    className="appearance-none pl-8 pr-8 py-2 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#6b21ff] focus:border-[#6b21ff]"
                    onChange={handleRegionChange}
                    value={selectedRegion}
                  >
                    <option value="">지역 선택</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="경기도">경기도</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                  </select>
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
                
                {showSubregions && (
                  <div className="flex relative border border-gray-300 rounded-md shadow-sm ml-2 bg-white">
                    <select className="appearance-none pl-3 pr-8 py-2 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#6b21ff] focus:border-[#6b21ff]">
                      <option value="">시/군/구</option>
                      {selectedRegion && subregions[selectedRegion as keyof typeof subregions]?.map((subregion) => (
                        <option key={subregion} value={subregion}>{subregion}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="코치 이름, 레슨 종류 (예: 개인레슨, 골키퍼)"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#6b21ff] focus:border-[#6b21ff] shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <Button className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white text-xs h-auto py-2 px-4">
                코치 찾기
              </Button>
            </div>
            
            {/* 인기 검색어 */}
            <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
              <div className="flex gap-1 items-center">
                <span className="text-gray-400">인기 검색어:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[#6b21ff] hover:underline cursor-pointer">개인레슨</span>
                  <span className="text-[#6b21ff] hover:underline cursor-pointer">그룹레슨</span>
                  <span className="text-[#6b21ff] hover:underline cursor-pointer">골키퍼</span>
                  <span className="text-[#6b21ff] hover:underline cursor-pointer">주말레슨</span>
                  <span className="text-[#6b21ff] hover:underline cursor-pointer">성인축구</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
