import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PROVINCES, DISTRICTS } from "@/lib/constants";
import { MapPin } from "lucide-react";

export default function RegionalCoachFinder() {
  const [, navigate] = useLocation();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [showProvinces, setShowProvinces] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);

  // 광역시/도 선택 시 해당 지역의 구/군 목록 업데이트
  useEffect(() => {
    if (selectedProvince && DISTRICTS[selectedProvince]) {
      setDistrictList(DISTRICTS[selectedProvince]);
      setSelectedDistrict(null); // 시/도 변경 시 구/군 선택 초기화
      setShowDistricts(true);
    } else {
      setDistrictList([]);
      setSelectedDistrict(null);
      setShowDistricts(false);
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
    }
  };

  const bgImage = 'linear-gradient(to right, rgba(93, 63, 211, 0.9), rgba(93, 63, 211, 0.7)), url("data:image/jpeg;base64,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")';

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden" style={{ backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Card className="bg-white/95 shadow-xl w-full md:max-w-2xl mx-auto my-8 md:my-12 md:ml-12 overflow-hidden border-0 relative z-10">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">전국 지역별 축구 코치 찾기</h2>
            <p className="text-gray-600">광역시/도를 선택하고 해당 지역의 코치를 찾아보세요</p>
          </div>

          <div className="mb-6">
            <div 
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => setShowProvinces(!showProvinces)}
            >
              <MapPin className="h-5 w-5 text-[#5D3FD3]" />
              <span className="text-gray-700 font-medium">
                {selectedProvince 
                  ? selectedDistrict 
                    ? `${selectedProvince} ${selectedDistrict}`
                    : selectedProvince
                  : "지역을 선택해주세요"}
              </span>
            </div>
            
            {/* 광역시/도 선택 */}
            {showProvinces && (
              <div className="mb-4 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-gray-500 mb-2">광역시/도 선택</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {PROVINCES.map((province) => (
                    <Button
                      key={province}
                      variant={selectedProvince === province ? "default" : "outline"}
                      className={`text-sm h-9 w-full ${
                        selectedProvince === province
                        ? "bg-[#5D3FD3] hover:bg-[#4A00E0]"
                        : "text-gray-700 hover:text-[#5D3FD3]"
                      }`}
                      onClick={() => {
                        setSelectedProvince(province);
                        if (!DISTRICTS[province] || DISTRICTS[province].length === 0) {
                          setShowProvinces(false);
                        }
                      }}
                    >
                      {province}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 구/군 선택 (광역시/도 선택 시 표시) */}
            {selectedProvince && districtList.length > 0 && showDistricts && (
              <div className="mb-4 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-gray-500 mb-2">구/군 선택</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {districtList.map((district) => (
                    <Button
                      key={district}
                      variant={selectedDistrict === district ? "default" : "outline"}
                      className={`text-sm h-9 w-full ${
                        selectedDistrict === district
                        ? "bg-[#5D3FD3] hover:bg-[#4A00E0]"
                        : "text-gray-700 hover:text-[#5D3FD3]"
                      }`}
                      onClick={() => {
                        setSelectedDistrict(district);
                        setShowDistricts(false);
                        setShowProvinces(false);
                      }}
                    >
                      {district}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 찾기 버튼 */}
          <Button 
            className="w-full bg-[#5D3FD3] hover:bg-[#4A00E0] py-6 text-lg"
            disabled={!selectedProvince}
            onClick={handleFindCoach}
          >
            코치 찾기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}