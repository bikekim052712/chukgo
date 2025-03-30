import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Star, Award, Medal } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#f9f7ff] to-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* 메인 헤더 텍스트 */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-[#6b21ff] block mb-1">축고</span>
            <span className="block">아이의 성장을 위한</span>
            <span className="block">최고의 축구 코치</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            검증된 전문 축구 코치들과 함께 맞춤형 레슨으로 미래의 축구 스타를 키워보세요
          </p>
        </div>
        
        {/* 검색 바 */}
        <div className="max-w-3xl mx-auto mb-16 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-2 border border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-3">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="내 주변 축구 코치 찾기"
                  className="w-full bg-transparent border-none focus:outline-none text-lg"
                />
              </div>
              <div className="p-2">
                <Button className="w-full md:w-auto py-6 px-8 text-lg bg-[#6b21ff] hover:bg-[#5a18dd] text-white rounded-lg font-medium transition-all">
                  검색하기
                </Button>
              </div>
            </div>
          </div>
          
          {/* 키워드 태그 */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">#개인레슨</span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">#그룹레슨</span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">#골키퍼레슨</span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">#주말레슨</span>
            <span className="bg-white text-sm text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">#초등생</span>
          </div>
        </div>
        
        {/* 키 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="h-6 w-6 text-[#6b21ff]" />
            </div>
            <h3 className="text-lg font-bold mb-2">검증된 전문 코치</h3>
            <p className="text-gray-600">자격증과 경력이 확인된 전문 축구 코치들만 활동합니다</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-[#6b21ff]" />
            </div>
            <h3 className="text-lg font-bold mb-2">맞춤형 일정</h3>
            <p className="text-gray-600">아이의 일정에 맞춰 편리하게 레슨을 예약하세요</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-[#6b21ff]" />
            </div>
            <h3 className="text-lg font-bold mb-2">투명한 후기</h3>
            <p className="text-gray-600">실제 학부모의 솔직한 후기로 최적의 코치를 선택하세요</p>
          </div>
        </div>
        
        {/* 배너 */}
        <div className="relative bg-gradient-to-r from-[#6b21ff] to-[#8b5cf6] rounded-2xl overflow-hidden max-w-6xl mx-auto">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')]"></div>
          <div className="flex flex-col md:flex-row items-center p-10 md:p-16 relative z-10">
            <div className="md:flex-1 mb-8 md:mb-0 text-white">
              <Award className="h-12 w-12 mb-6 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">6월 신규 회원 특별 혜택</h2>
              <p className="text-gray-100 mb-8 text-lg">
                첫 레슨 20% 할인 및 무료 상담 혜택을 놓치지 마세요!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-white hover:bg-gray-100 text-[#6b21ff] font-bold px-8 py-6 text-lg">
                  <Link href="/coaches">시작하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
