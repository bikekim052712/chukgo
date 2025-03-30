import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// 서비스 데이터
const services = [
  {
    id: 1,
    title: "축구 레슨 예약",
    image: "https://images.unsplash.com/photo-1540991825428-5b54b09f7338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "개인/그룹 맞춤형 축구 레슨",
    count: "2,500명",
    href: "/lessons",
  },
  {
    id: 2,
    title: "축구 클리닉",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "포지션별 전문 클리닉",
    count: "550건",
    href: "/clinics",
  },
  {
    id: 3,
    title: "축구 캠프",
    image: "https://images.unsplash.com/photo-1524514587686-e2909d726e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "방학/주말 캠프 프로그램",
    count: "120개",
    href: "/camps",
  },
  {
    id: 4,
    title: "골키퍼 전문",
    image: "https://images.unsplash.com/photo-1614632537423-5e1b2fe673e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "골키퍼 집중 훈련 프로그램",
    count: "180명",
    href: "/goalkeeper",
  }
];

export default function Services() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">축고 인기 서비스</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition duration-300">
              <div className="h-40 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b21ff] font-medium">
                    매월 {service.count} 신청
                  </span>
                  <Button asChild variant="ghost" size="sm" className="text-gray-500 p-0 h-auto hover:bg-transparent">
                    <Link href={service.href} className="flex items-center gap-1">
                      <span className="text-sm">보러가기</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}