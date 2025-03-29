import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative text-white py-20 md:py-32 mb-12 bg-black">
      <div className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515937644369-24743998deae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="bg-primary/90 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">한국 최대 유소년 축구 레슨 플랫폼</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">우리 아이에게 딱 맞는<br />축구 코치 찾기</h1>
          <p className="text-lg md:text-xl mb-8">검증된 전문 코치진과 체계적인 커리큘럼으로<br />아이의 축구 실력과 자신감을 키워주세요</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link href="#search">코치 찾기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40">
              <Link href="#how-it-works">이용 방법</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
              <span>100% 검증된 코치진</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              <span>투명한 리뷰 시스템</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              <span>내 지역 맞춤 매칭</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
