import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Star, Shield, Users } from "lucide-react";
import { LOCATIONS } from "@/lib/constants";

export default function Hero() {
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-[#FAFAFE]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 2단 레이아웃: 텍스트 영역 + 이미지 영역 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* 왼쪽: 텍스트 & 검색 영역 */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                <span className="text-[#5D3FD3]">축고</span>에서 찾는<br/>최고의 축구 코치
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                검증된 축구 코치와 함께 맞춤형 레슨으로 더 빠른 실력 향상을 경험하세요. 
              </p>
              
              {/* 검색 박스 */}
              <div className="bg-white rounded-xl shadow-md p-5 mb-8">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base font-medium text-gray-700">전국 도시/군/구별 축구 코치 찾기</h3>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* 위치 선택 */}
                    <div className="relative flex-grow">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MapPin size={18} />
                      </div>
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] focus:border-transparent appearance-none"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      >
                        <option value="">지역을 선택하세요</option>
                        {LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* 검색 버튼 */}
                    <Button 
                      className="bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white py-3 px-6"
                      asChild
                    >
                      <Link href={selectedLocation ? `/coaches?location=${selectedLocation}` : "/coaches"}>
                        <Search size={18} className="mr-2" />
                        코치 찾기
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 키워드 태그 */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                <span className="bg-white text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">#개인레슨</span>
                <span className="bg-white text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">#그룹레슨</span>
                <span className="bg-white text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">#주말레슨</span>
                <span className="bg-white text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">#초등생</span>
                <span className="bg-white text-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">#청소년</span>
              </div>
              
              {/* 통계 지표 */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#F0EBFF] rounded-full flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-[#5D3FD3]" />
                  </div>
                  <div>
                    <p className="font-bold">300+</p>
                    <p className="text-xs text-gray-500">검증된 코치</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#F0EBFF] rounded-full flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-[#5D3FD3]" />
                  </div>
                  <div>
                    <p className="font-bold">4.9/5</p>
                    <p className="text-xs text-gray-500">평균 평점</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#F0EBFF] rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-[#5D3FD3]" />
                  </div>
                  <div>
                    <p className="font-bold">5,000+</p>
                    <p className="text-xs text-gray-500">만족한 학생</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 이미지 영역 */}
            <div className="w-full lg:w-1/2 relative">
              {/* 배경 원형 요소 */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F0EBFF] rounded-full -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#F0EBFF] rounded-full -z-10"></div>
              
              {/* 메인 이미지 */}
              <div className="bg-white rounded-3xl shadow-lg p-4 relative z-10">
                <div className="aspect-w-1 aspect-h-1 w-full bg-[#F5F3FF] rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* 축구 코치 이미지 대신 축구 아이콘으로 대체 */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                        <svg viewBox="0 0 24 24" width="50" height="50" stroke="#5D3FD3" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="12,7 8,12 12,17 16,12" />
                        </svg>
                      </div>
                      <p className="text-[#5D3FD3] font-medium">축고 앱 설치하기</p>
                    </div>
                  </div>
                </div>
                
                {/* 플로팅 카드 - 상단 */}
                <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-md p-3 flex items-center">
                  <div className="w-10 h-10 bg-[#F0EBFF] rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-[#5D3FD3]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">유연한 일정</p>
                    <p className="text-xs text-gray-500">맞춤형 레슨 일정 선택</p>
                  </div>
                </div>
                
                {/* 플로팅 카드 - 하단 */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-md p-3 flex items-center">
                  <div className="w-10 h-10 bg-[#F0EBFF] rounded-full flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-[#5D3FD3]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">검증된 코치</p>
                    <p className="text-xs text-gray-500">투명한 리뷰 시스템</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
