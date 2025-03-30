import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Users, ShieldCheck, Timer, Medal, Star, MessageSquare } from "lucide-react";

// 서비스 데이터 (이미지 URL은 실제 이미지 대신 색상 배경으로 대체)
const services = [
  {
    id: 1,
    title: "맞춤형 개인 레슨",
    icon: <User className="h-5 w-5 text-[#5D3FD3]" />,
    description: "코치와 1:1로 진행되는 개인 맞춤형 축구 트레이닝",
    features: ["맞춤형 커리큘럼", "빠른 실력 향상", "유연한 일정"],
    price: "50,000원~",
    href: "/lessons/individual",
    color: "#F0EBFF",
  },
  {
    id: 2,
    title: "소규모 그룹 레슨",
    icon: <Users className="h-5 w-5 text-[#5D3FD3]" />,
    description: "친구들과 함께 즐기는 효율적인 그룹 트레이닝",
    features: ["팀워크 향상", "경제적인 가격", "즐거운 분위기"],
    price: "30,000원~",
    href: "/lessons/group",
    color: "#EFF6FF",
  },
  {
    id: 3,
    title: "챔피언 트레이닝",
    icon: <Medal className="h-5 w-5 text-[#5D3FD3]" />,
    description: "고강도 전문 기술 향상을 위한 특별 프로그램",
    features: ["고급 기술 훈련", "경기력 향상", "전술 이해"],
    price: "70,000원~",
    href: "/lessons/champion",
    color: "#ECFDF5",
  }
];

// 왜 축고를 선택해야 하는지에 대한 장점들
const benefits = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-[#5D3FD3]" />,
    title: "검증된 코치진",
    description: "엄격한 심사를 통과한 자격증 보유 전문 코치"
  },
  {
    icon: <Star className="h-6 w-6 text-[#5D3FD3]" />,
    title: "맞춤형 커리큘럼",
    description: "연령과 수준에 맞는 체계적인 커리큘럼 제공"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-[#5D3FD3]" />,
    title: "지속적인 피드백",
    description: "레슨 후 발전 방향과 피드백 제공"
  }
];

export default function Services() {
  return (
    <section className="py-16 bg-[#FAFAFE]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-2">축고의 인기 레슨 프로그램</h2>
              <p className="text-gray-600">
                실력 향상을 위한 다양한 레슨 옵션을 살펴보세요
              </p>
            </div>
            <Link 
              href="/lessons" 
              className="flex items-center text-[#5D3FD3] font-medium text-sm mt-4 md:mt-0"
            >
              모든 프로그램 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* 서비스 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              >
                {/* 헤더 부분 */}
                <div 
                  className="p-6 relative" 
                  style={{ backgroundColor: service.color }}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {service.description}
                  </p>
                  <div className="absolute right-4 top-4 bg-white text-[#5D3FD3] font-medium text-xs px-3 py-1 rounded-full shadow-sm">
                    {service.price}
                  </div>
                </div>
                
                {/* 피처 리스트 */}
                <div className="p-6">
                  <ul className="mb-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700 text-sm mb-2">
                        <div className="w-4 h-4 rounded-full bg-[#F0EBFF] flex items-center justify-center mr-2">
                          <div className="w-2 h-2 rounded-full bg-[#5D3FD3]"></div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={service.href}>
                    <Button 
                      className="w-full bg-white text-[#5D3FD3] border border-[#5D3FD3] hover:bg-[#F0EBFF]"
                      variant="outline"
                    >
                      레슨 자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* 축고의 장점 섹션 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-8 text-center">왜 축고를 선택해야 할까요?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-[#F0EBFF] rounded-full flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}