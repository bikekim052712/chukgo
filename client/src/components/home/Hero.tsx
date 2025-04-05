import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { PROVINCES, DISTRICTS } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  const [, navigate] = useLocation();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [showDistrictSelector, setShowDistrictSelector] = useState(false);

  // 광역시/도 선택 시 해당 지역의 구/군 목록 업데이트
  useEffect(() => {
    if (selectedProvince && DISTRICTS[selectedProvince]) {
      setDistrictList(DISTRICTS[selectedProvince]);
      setSelectedDistrict(null); // 시/도 변경 시 구/군 선택 초기화
      setShowDistrictSelector(true);
    } else {
      setDistrictList([]);
      setSelectedDistrict(null);
      setShowDistrictSelector(false);
    }
  }, [selectedProvince]);

  // 코치 찾기 버튼 클릭 시 해당 지역의 코치 목록 페이지로 이동
  const handleFindCoach = () => {
    if (selectedProvince) {
      let queryParams = `province=${encodeURIComponent(selectedProvince)}`;
      if (selectedDistrict) {
        queryParams += `&district=${encodeURIComponent(selectedDistrict)}`;
      }
      navigate(`/coaches/search?${queryParams}`);
    } else {
      navigate('/coaches/search');
    }
  };

  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 bg-no-repeat bg-cover bg-center relative" 
             style={{ 
               backgroundImage: "url('https://images.pexels.com/photos/8985402/pexels-photo-8985402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
             }}>
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/80 to-[#60A5FA]/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 타이틀 영역 */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-white drop-shadow-lg tracking-tight whitespace-nowrap">
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-extrabold text-shadow-lg">축고</span>
                <span className="absolute -inset-1 bg-[#2563EB] opacity-50 rounded blur-sm"></span>
              </span><span className="mx-1">에서</span> <span className="mx-1">찾는</span> 
              <span className="relative inline-block ml-1">
                <span className="relative z-10 text-white font-extrabold text-shadow-lg">"축구 레슨 코치"</span>
                <span className="absolute -inset-1 bg-[#3B82F6] opacity-50 rounded blur-sm"></span>
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 drop-shadow-lg tracking-wide inline-block bg-black/20 px-4 py-1 rounded">
              한국 최대 유소년 축구 플랫폼
            </h2>
            <p className="text-white text-lg max-w-3xl mx-auto drop-shadow-md bg-blue-900/30 px-6 py-2 rounded-lg inline-block">
              검증된 축구 코치와 함께 맞춤형 레슨으로 더 빠른 실력 향상을 경험하세요. 
            </p>
          </div>
          
          {/* 지역 선택 영역 */}
          <Card className="bg-white/95 backdrop-blur-sm w-full max-w-4xl mx-auto overflow-hidden border-0 shadow-xl mt-8 mb-6 bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-5 md:p-7">
              <div className="mb-3 text-center">
                <h3 className="text-lg md:text-xl font-bold text-blue-600">지역별 축구 코치 찾기</h3>
                <p className="text-sm text-gray-600">원하는 지역을 선택하고 가장 가까운 축구 코치를 찾아보세요</p>
              </div>

              <div className="relative p-4 bg-white rounded-lg shadow-inner border border-blue-100 mb-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-blue-600" />광역시/도
                    </span>
                    {selectedProvince && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedProvince(null)}
                      >
                        초기화
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-2">
                    {PROVINCES.map((province) => (
                      <Button
                        key={province}
                        variant={selectedProvince === province ? "default" : "outline"}
                        className={`text-xs sm:text-sm h-9 px-1 ${
                          selectedProvince === province
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                        } transition-all duration-200 shadow-sm hover:shadow`}
                        onClick={() => setSelectedProvince(province)}
                      >
                        {province.length > 5 ? province.substring(0, 5) : province}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {showDistrictSelector && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-600" />{selectedProvince} 내 지역
                      </span>
                      {selectedDistrict && (
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                          onClick={() => setSelectedDistrict(null)}
                        >
                          초기화
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {districtList.map((district) => (
                        <Button
                          key={district}
                          variant={selectedDistrict === district ? "default" : "outline"}
                          className={`text-xs sm:text-sm h-9 px-1 ${
                            selectedDistrict === district
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                          } transition-all duration-200 shadow-sm hover:shadow`}
                          onClick={() => setSelectedDistrict(district)}
                        >
                          {district}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={handleFindCoach}
              >
                {selectedProvince 
                  ? `${selectedProvince}${selectedDistrict ? ` ${selectedDistrict}` : ''}의 코치 찾기` 
                  : '모든 지역 코치 찾기'}
              </Button>
            </CardContent>
          </Card>
          
          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-base shadow-lg px-8 py-6"
              asChild
            >
              <Link href="/coaches/search">
                모든 코치 보기
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white border-2 hover:bg-white/20 font-semibold text-base shadow-lg px-8 py-6"
              asChild
            >
              <Link href="/coach-signup">
                코치로 등록하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
