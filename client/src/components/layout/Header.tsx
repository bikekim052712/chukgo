import { useState } from "react";
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
    { name: "이용방법", href: "/how-to-use" },
  ];

  return (
    <header className="bg-white fixed w-full z-50 top-0 shadow-sm">
      {/* 메인 헤더 */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-12">
              <span className="text-[#6b21ff] font-bold text-2xl">축고</span>
            </Link>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-10">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`text-sm hover:text-[#6b21ff] transition-colors ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#6b21ff] font-bold'
                          : 'text-gray-700'
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
            <Button asChild variant="ghost" className="text-sm font-medium rounded-md h-9 px-4">
              <Link href="/login">로그인</Link>
            </Button>
            
            <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white text-sm font-medium rounded-md px-4 py-2 h-9">
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`block py-2 transition-colors text-sm ${
                        (item.href === location || 
                         (item.href.startsWith('#') && location === '/' + item.href) || 
                         (item.href !== '/' && location.startsWith(item.href)))
                          ? 'text-[#6b21ff] font-bold'
                          : 'text-gray-700'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 mt-4">              
              <Button variant="outline" asChild className="justify-center text-sm">
                <Link href="/login" onClick={closeMobileMenu}>로그인</Link>
              </Button>
              
              <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] w-full justify-center text-sm">
                <Link href="/coach-signup" onClick={closeMobileMenu}>코치가입</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 축구 코치 검색 섹션 */}
      <div className="bg-white pt-8 pb-10 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">내 지역에 맞는 축구 코치 찾기</h2>
              <p className="text-gray-600 text-sm max-w-lg mx-auto">지역과 시/군/구를 선택하여 가까운 지역의 축구 코치를 찾아보세요</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">지역 선택</label>
                  <div className="relative">
                    <select 
                      id="region"
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b21ff] focus:border-transparent"
                      onChange={handleRegionChange}
                      value={selectedRegion}
                    >
                      <option value="">지역을 선택하세요</option>
                      <option value="서울특별시">서울특별시</option>
                      <option value="부산광역시">부산광역시</option>
                      <option value="경기도">경기도</option>
                      <option value="인천광역시">인천광역시</option>
                      <option value="대전광역시">대전광역시</option>
                      <option value="대구광역시">대구광역시</option>
                      <option value="울산광역시">울산광역시</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/3">
                  <label htmlFor="subregion" className="block text-sm font-medium text-gray-700 mb-1">시/군/구 선택</label>
                  <div className="relative">
                    <select 
                      id="subregion"
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b21ff] focus:border-transparent"
                      disabled={!selectedRegion}
                    >
                      <option value="">시/군/구를 선택하세요</option>
                      {selectedRegion && subregions[selectedRegion as keyof typeof subregions]?.map((subregion) => (
                        <option key={subregion} value={subregion}>{subregion}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Button className="w-full bg-[#6b21ff] hover:bg-[#5a18dd] font-medium h-10 px-6 text-white">
                    축구 코치 찾기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
