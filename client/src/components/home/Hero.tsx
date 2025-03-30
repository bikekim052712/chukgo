import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { PROVINCES, DISTRICTS } from "@/lib/constants";

export default function Hero() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 지역을 선택했을 때 해당 시군구 목록 업데이트
  useEffect(() => {
    if (selectedProvince) {
      setFilteredDistricts(DISTRICTS[selectedProvince] || []);
      setSelectedDistrict(""); // 지역 변경 시 선택된 시군구 초기화
    } else {
      setFilteredDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedProvince]);

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

  // 시군구 항목 클릭 핸들러
  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    setSearchQuery(`${selectedProvince.slice(0, 2)} ${district}`);
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
            
            <div className="flex flex-col md:flex-row p-5">
              {/* 좌측: 지역 선택 */}
              <div className="w-full md:w-4/12 md:border-r border-gray-100 md:pr-4">
                <p className="text-sm font-medium mb-2 text-gray-700">광역시/도</p>
                <div className="h-60 md:h-48 overflow-y-auto pr-2 space-y-1">
                  {PROVINCES.map(province => (
                    <button
                      key={province}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedProvince === province 
                          ? 'bg-[#F0EBFF] text-[#5D3FD3] font-medium' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setSelectedProvince(province)}
                    >
                      {province}
                    </button>
                  ))}
                </div>
              </div>

              {/* 우측: 시군구 선택 및 검색 */}
              <div className="w-full md:w-8/12 md:pl-4 mt-4 md:mt-0">
                {selectedProvince ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {selectedProvince === "세종특별자치시" ? "세종시" : `${selectedProvince} 내 지역`}
                      </p>
                      {selectedProvince !== "세종특별자치시" && (
                        <button 
                          className="text-xs text-[#5D3FD3]"
                          onClick={() => setSelectedDistrict("")}
                        >
                          초기화
                        </button>
                      )}
                    </div>
                    
                    {selectedProvince === "세종특별자치시" ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">세종시는 단일 행정구역입니다</p>
                        <Button 
                          className="bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white mt-4 w-full"
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
                        <div className="h-40 overflow-y-auto mb-4 grid grid-cols-2 gap-1">
                          {filteredDistricts.map(district => (
                            <button
                              key={district}
                              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
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
                        
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            readOnly
                            placeholder="지역을 선택하세요"
                            className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] focus:border-transparent"
                          />
                          
                          <Button 
                            className={`absolute right-0 top-0 h-full rounded-l-none bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white px-4 ${
                              !selectedDistrict ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!selectedDistrict}
                            asChild={!!selectedDistrict}
                          >
                            {selectedDistrict ? (
                              <Link href={getSearchUrl()}>
                                <Search size={18} className="mr-2" />
                                코치 찾기
                              </Link>
                            ) : (
                              <span>
                                <Search size={18} className="mr-2" />
                                코치 찾기
                              </span>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <MapPin size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-1">찾으시는 지역의 광역시/도를 선택해주세요</p>
                    <p className="text-gray-400 text-xs">왼쪽에서 지역을 선택하시면 상세 지역이 표시됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
