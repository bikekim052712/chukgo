import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* 메인 헤더 텍스트 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">더 나은 생활을 위한 변화</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">어떤 서비스가 필요하세요?</p>
        </div>
        
        {/* 검색 바 */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="축구 코치를 찾아보세요!"
              className="pl-5 pr-4 py-4 border border-gray-300 rounded-md text-lg w-full focus:outline-none focus:border-[#6b21ff] focus:ring-1 focus:ring-[#6b21ff] shadow-sm"
            />
            <Button className="absolute right-2 top-2 bg-[#6b21ff] hover:bg-[#5a18dd] text-white px-6">
              검색
            </Button>
          </div>
        </div>
        
        {/* 배너 */}
        <div className="relative bg-[#f5f1ff] rounded-2xl overflow-hidden max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center p-8 md:p-10">
            <div className="md:flex-1 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4 text-[#6b21ff]">우리 아이에게 딱 맞는 축구 코치를 만나보세요</h2>
              <p className="text-gray-700 mb-6">
                검증된 전문 코치진과 체계적인 커리큘럼으로 아이의 축구 실력과 자신감을 키워주세요
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-[#6b21ff] hover:bg-[#5a18dd] text-white">
                  <Link href="/coaches">코치 찾기</Link>
                </Button>
              </div>
            </div>
            <div className="md:flex-1 flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="유소년 축구 코칭" 
                className="w-full max-w-sm rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
