import React from "react";
import { Link } from "wouter";
import { 
  User, 
  Users,  
  ShieldCheck, 
  Timer,
  Sparkles,
  Baby,
  School,
  Backpack,
  Leaf,
  Flag,
  UserCircle,
  ChevronRight
} from "lucide-react";

// 레슨 유형 카테고리
const lessonCategories = [
  {
    name: "개인레슨",
    description: "1:1 맞춤형 축구 지도",
    icon: <User className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lessons/individual",
  },
  {
    name: "그룹레슨",
    description: "친구들과 함께하는 그룹 훈련",
    icon: <Users className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lessons/group",
  },
  {
    name: "골키퍼레슨",
    description: "전문 골키퍼 기술 트레이닝",
    icon: <ShieldCheck className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lessons/goalkeeper",
  },
  {
    name: "달리기",
    description: "체력 및 스피드 향상 훈련",
    icon: <Timer className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lessons/running",
  },
];

// 연령대별 카테고리
const ageCategories = [
  {
    name: "초등 저학년",
    description: "기초 기술 익히기",
    icon: <Backpack className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/ages/elementary-lower",
  },
  {
    name: "초등 고학년",
    description: "체계적인 기술 훈련",
    icon: <School className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/ages/elementary-upper",
  },
  {
    name: "중학생",
    description: "포지션별 전문 훈련",
    icon: <Flag className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/ages/middle-school",
  },
  {
    name: "고등학생",
    description: "전술 이해와 프로 수준 기술",
    icon: <Sparkles className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/ages/high-school",
  },
  {
    name: "성인",
    description: "취미 및 프로 지망생 맞춤 훈련",
    icon: <UserCircle className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/ages/adult",
  },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">다양한 레슨 옵션</h2>
              <p className="text-gray-600">
                나에게 딱 맞는 맞춤형 축구 레슨을 찾아보세요
              </p>
            </div>
            <Link href="/lessons" className="flex items-center text-[#5D3FD3] font-medium mt-4 md:mt-0 text-sm">
              모든 레슨 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* 레슨 카테고리 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {lessonCategories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-[#F0EBFF] rounded-full flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 연령대별 섹션 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">연령대별 맞춤 레슨</h2>
              <p className="text-gray-600">
                각 연령에 최적화된 커리큘럼으로 효과적인 축구 교육
              </p>
            </div>
            <Link href="/ages" className="flex items-center text-[#5D3FD3] font-medium mt-4 md:mt-0 text-sm">
              모든 연령대 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* 연령대별 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {ageCategories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-[#F0EBFF] rounded-full flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}