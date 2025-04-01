import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 bg-no-repeat bg-cover bg-center relative" 
             style={{ 
               backgroundImage: "url('https://images.pexels.com/photos/8985402/pexels-photo-8985402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
             }}>
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#5D3FD3]/90 to-[#7C66DC]/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 타이틀 영역 */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-white drop-shadow-lg tracking-tight">
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-extrabold text-shadow-lg">축고</span>
                <span className="absolute -inset-1 bg-[#5D3FD3] opacity-50 rounded blur-sm"></span>
              </span>에서 찾는 
              <span className="relative inline-block ml-1">
                <span className="relative z-10 text-white font-extrabold text-shadow-lg">축구 레슨 코치</span>
                <span className="absolute -inset-1 bg-[#7C66DC] opacity-50 rounded blur-sm"></span>
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 drop-shadow-lg tracking-wide inline-block bg-black/30 px-4 py-1 rounded">
              한국 최대 유소년 축구 플랫폼
            </h2>
            <p className="text-white text-lg max-w-3xl mx-auto drop-shadow-md bg-black/20 px-6 py-2 rounded-lg inline-block">
              검증된 축구 코치와 함께 맞춤형 레슨으로 더 빠른 실력 향상을 경험하세요. 
            </p>
          </div>
          
          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button 
              size="lg" 
              className="bg-white text-[#5D3FD3] hover:bg-gray-100 font-bold text-base shadow-lg px-8 py-6"
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
