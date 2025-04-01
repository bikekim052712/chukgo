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

  // 광역시/도 선택 시 해당 지역의 구/군 목록 업데이트
  useEffect(() => {
    if (selectedProvince && DISTRICTS[selectedProvince]) {
      setDistrictList(DISTRICTS[selectedProvince]);
      setSelectedDistrict(null); // 시/도 변경 시 구/군 선택 초기화
    } else {
      setDistrictList([]);
      setSelectedDistrict(null);
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

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-purple-100 rounded-lg overflow-hidden p-6">
      <Card className="bg-white w-full mx-auto overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">전국 지역별 축구 코치 찾기</h2>
            <p className="text-gray-600 text-sm">광역시/도를 선택하고 해당 지역의 코치를 찾아보세요</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-purple-600" />
              <span className="text-gray-700 font-medium">지역을 선택해주세요</span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">광역시/도 선택</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {PROVINCES.map((province) => (
                  <Button
                    key={province}
                    variant={selectedProvince === province ? "default" : "outline"}
                    className={`text-xs sm:text-sm h-9 px-1 sm:px-2 ${
                      selectedProvince === province
                      ? "bg-[#5D3FD3] hover:bg-[#4A00E0] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedProvince(province)}
                  >
                    {province.length > 5 ? province.substring(0, 5) : province}
                  </Button>
                ))}
              </div>
            </div>

            {selectedProvince && districtList.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">구/군 선택</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {districtList.map((district) => (
                    <Button
                      key={district}
                      variant={selectedDistrict === district ? "default" : "outline"}
                      className={`text-xs sm:text-sm h-9 px-1 sm:px-2 ${
                        selectedDistrict === district
                        ? "bg-[#5D3FD3] hover:bg-[#4A00E0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
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
            className="w-full bg-[#5D3FD3] hover:bg-[#4A00E0] h-11 text-base font-medium"
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