import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronRight, X } from "lucide-react";
import { PROVINCES, DISTRICTS } from "@/lib/constants";

export default function Hero() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 전체 선택된 위치 문자열 생성 (검색에 사용)
  const getFullLocation = () => {
    if (!selectedProvince) return "";
    
    if (selectedProvince === "세종특별자치시") return "세종시";
    
    if (!selectedDistrict) return "";
    
    return `${selectedProvince.slice(0, 2)} ${selectedDistrict}`;
  };

  // 코치 검색 URL 생성
  const getSearchUrl = () => {
    const fullLocation = getFullLocation();
    if (!fullLocation) return "/coaches";
    return `/coaches?location=${encodeURIComponent(fullLocation)}`;
  };

  // 도/광역시 항목 클릭 핸들러
  const handleProvinceClick = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict("");
    setSearchQuery("");
  };

  // 시군구 항목 클릭 핸들러
  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    setSearchQuery(`${selectedProvince.slice(0, 2)} ${district}`);
  };

  // 초기화 버튼 핸들러
  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSearchQuery("");
  };

  return (
    <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-[#FAFAFE]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 타이틀 영역 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-[#5D3FD3]">축고</span>에서 찾는<br/>최고의 축구 코치
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              검증된 축구 코치와 함께 맞춤형 레슨으로 더 빠른 실력 향상을 경험하세요. 
            </p>
          </div>
          
          {/* 검색 박스 */}
          <div className="bg-white rounded-xl shadow-lg mb-8 max-w-3xl mx-auto">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">전국 지역별 축구 코치 찾기</h3>
              <p className="text-sm text-gray-500 mt-1">광역시/도를 선택하고 해당 지역의 코치를 찾아보세요</p>
            </div>
            
            <div className="p-5">
              {/* 지역 선택 UI */}
              <div className="mb-4">
                {searchQuery ? (
                  <div className="flex items-center justify-between bg-[#F0EBFF] px-4 py-3 rounded-lg mb-2">
                    <div className="flex items-center">
                      <MapPin size={18} className="text-[#5D3FD3] mr-2" />
                      <p className="text-sm font-medium text-gray-700">{searchQuery}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleReset}
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-lg mb-2 flex items-center">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <p className="text-sm text-gray-500">지역을 선택해주세요</p>
                  </div>
                )}
              </div>

              {/* 지역 검색 영역 - 2단 레이아웃 */}
              <div className="flex">
                {/* 좌측: 광역시/도 목록 */}
                <div className="w-1/2 pr-2 border-r">
                  <div className="overflow-y-auto max-h-64">
                    {PROVINCES.map(province => (
                      <button
                        key={province}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 flex items-center justify-between ${
                          selectedProvince === province 
                            ? 'bg-[#F0EBFF] text-[#5D3FD3] font-medium' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => handleProvinceClick(province)}
                      >
                        <span>{province}</span>
                        {province !== "세종특별자치시" && (
                          <ChevronRight size={16} className={selectedProvince === province ? "text-[#5D3FD3]" : "text-gray-400"} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 우측: 선택한 광역시/도의 시군구 목록 또는 안내 메시지 */}
                <div className="w-1/2 pl-2">
                  {selectedProvince ? (
                    selectedProvince === "세종특별자치시" ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-4">세종시는 단일 행정구역입니다</p>
                        <Button 
                          className="bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white w-full"
                          asChild
                        >
                          <Link href="/coaches?location=세종시">
                            <Search size={16} className="mr-2" />
                            세종시 코치 찾기
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-gray-500 mb-2">{selectedProvince} 시/군/구</p>
                        <div className="overflow-y-auto max-h-60 pr-1">
                          {DISTRICTS[selectedProvince]?.map(district => (
                            <button
                              key={district}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                                selectedDistrict === district 
                                  ? 'bg-[#F0EBFF] text-[#5D3FD3] font-medium' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => handleDistrictClick(district)}
                            >
                              {district}
                            </button>
                          ))}
                        </div>
                      </>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      <p className="text-sm text-gray-400 text-center">
                        왼쪽에서 광역시/도를<br />선택해주세요
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 코치 찾기 버튼 (시군구 선택 시에만 활성화) */}
              {selectedDistrict && (
                <div className="mt-4">
                  <Button 
                    className="bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white w-full"
                    asChild
                  >
                    <Link href={getSearchUrl()}>
                      <Search size={18} className="mr-2" />
                      {searchQuery} 축구 코치 찾기
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
