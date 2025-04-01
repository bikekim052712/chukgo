import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-20 pb-16 md:pt-24 md:pb-20 bg-no-repeat bg-cover bg-center relative" 
             style={{ 
               backgroundImage: "url('https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
             }}>
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5D3FD3]/80 to-[#7C66DC]/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 타이틀 영역 */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
              <span className="text-white font-extrabold">축고</span>에서 찾는 <span className="text-white font-extrabold">축구 레슨 코치</span>
            </h1>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              검증된 축구 코치와 함께 맞춤형 레슨으로 더 빠른 실력 향상을 경험하세요. 
            </p>
          </div>
          
          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-white text-[#5D3FD3] hover:bg-gray-100"
              asChild
            >
              <Link href="/coaches">
                모든 코치 보기
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
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
