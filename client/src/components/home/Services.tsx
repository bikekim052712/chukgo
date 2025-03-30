import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Users, ShieldCheck, Timer, Sparkles } from "lucide-react";

// 서비스 데이터
const services = [
  {
    id: 1,
    title: "개인레슨",
    icon: <User className="h-5 w-5 text-[#6b21ff]" />,
    image: "https://images.unsplash.com/photo-1531056733296-dc38bf20709a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "1:1 맞춤형 축구 지도 프로그램",
    count: "2,500명",
    href: "/lessons/individual",
    tag: "인기",
    tagColor: "bg-purple-100 text-purple-800",
  },
  {
    id: 2,
    title: "그룹레슨",
    icon: <Users className="h-5 w-5 text-[#4263eb]" />,
    image: "https://images.unsplash.com/photo-1610633389918-7d5b62977dc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "친구들과 함께하는 소규모 그룹 훈련",
    count: "550명",
    href: "/lessons/group",
    tag: "추천",
    tagColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    title: "골키퍼레슨",
    icon: <ShieldCheck className="h-5 w-5 text-[#0ca678]" />,
    image: "https://images.unsplash.com/photo-1614632537423-5e1b2fe673e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "전문적인 골키퍼 기술 훈련 프로그램",
    count: "180명",
    href: "/lessons/goalkeeper",
    tag: "전문",
    tagColor: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "달리기",
    icon: <Timer className="h-5 w-5 text-[#f59f00]" />,
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "체력 및 스피드 향상을 위한 특화 트레이닝",
    count: "320명",
    href: "/lessons/running",
    tag: "인기상승",
    tagColor: "bg-yellow-100 text-yellow-800",
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-3">축고 인기 레슨</h2>
            <p className="text-gray-600">가장 많은 학부모님들이 선택한 축구 레슨 프로그램</p>
          </div>
          <Button asChild variant="outline" className="border-[#6b21ff] text-[#6b21ff] hover:bg-[#f9f7ff]">
            <Link href="/lessons">
              전체 레슨 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={service.href}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${service.tagColor}`}>
                      {service.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-lg">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      매월 {service.count} 신청
                    </span>
                    <div className="flex items-center text-[#6b21ff] font-medium text-sm">
                      자세히 보기
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}