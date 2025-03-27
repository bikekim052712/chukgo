import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative text-white py-20 md:py-32 mb-12 bg-black">
      <div className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">전문 코치와 함께하는 축구 레슨</h1>
          <p className="text-lg md:text-xl mb-8">초보부터 전문가까지, 나에게 맞는 맞춤형 축구 교육을 만나보세요</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-[#F9A826] hover:bg-[#FBBA50] text-neutral-800">
              <Link href="#search">레슨 찾기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40">
              <Link href="#how-it-works">이용 방법</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
