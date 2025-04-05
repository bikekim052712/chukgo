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
    href: "/lesson-request?type=individual",
  },
  {
    name: "그룹레슨",
    description: "친구들과 함께하는 그룹 훈련",
    icon: <Users className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?type=group",
  },
  {
    name: "골키퍼레슨",
    description: "전문 골키퍼 기술 트레이닝",
    icon: <ShieldCheck className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?type=goalkeeper",
  },
  {
    name: "달리기레슨",
    description: "체력 및 스피드 향상 훈련",
    icon: <Timer className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?type=running",
  },
  {
    name: "피지컬레슨",
    description: "축구 전문 체력 및 근력 향상",
    icon: <Sparkles className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?type=physical",
  },
];

// 연령대별 카테고리
const ageCategories = [
  {
    name: "초등학생",
    description: "체계적인 기본기 훈련",
    icon: <School className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?age=elementary",
  },
  {
    name: "중학생",
    description: "포지션별 전문 훈련",
    icon: <Backpack className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?age=middle-school",
  },
  {
    name: "고등학생",
    description: "전술 및 경기 운영 훈련",
    icon: <Flag className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?age=high-school",
  },
  {
    name: "성인",
    description: "취미 및 프로 지망생 맞춤형",
    icon: <UserCircle className="h-6 w-6 text-[#5D3FD3]" />,
    href: "/lesson-request?age=adult",
  },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">특화된 축구 레슨 유형</h2>
              <p className="text-gray-600">
                목표와 수준에 맞는 최적의 레슨 방식을 선택하세요
              </p>
            </div>
            <Link href="/lesson-request" className="flex items-center text-[#5D3FD3] font-medium mt-4 md:mt-0 text-sm">
              모든 레슨 유형 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* 레슨 카테고리 카드 - 한 줄로 표시 */}
          <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 mb-16">
            {lessonCategories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex-shrink-0 w-60"
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
              <h2 className="text-2xl font-bold mb-2">연령대별 레슨</h2>
              <p className="text-gray-600">
                각 연령에 최적화된 체계적인 축구 교육 프로그램
              </p>
            </div>
            <Link href="/lesson-request" className="flex items-center text-[#5D3FD3] font-medium mt-4 md:mt-0 text-sm">
              모든 연령대별 레슨 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* 연령대별 카드 - 한 줄로 표시 */}
          <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4">
            {ageCategories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex-shrink-0 w-60"
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