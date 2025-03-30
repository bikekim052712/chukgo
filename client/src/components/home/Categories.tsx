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
} from "lucide-react";

// 레슨 유형 카테고리
const lessonCategories = [
  {
    name: "개인레슨",
    description: "1:1 맞춤형 축구 지도",
    icon: <User className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/individual",
  },
  {
    name: "그룹레슨",
    description: "친구들과 함께하는 그룹 훈련",
    icon: <Users className="h-6 w-6 text-[#4263eb]" />,
    href: "/lessons/group",
  },
  {
    name: "골키퍼레슨",
    description: "전문 골키퍼 기술 트레이닝",
    icon: <ShieldCheck className="h-6 w-6 text-[#0ca678]" />,
    href: "/lessons/goalkeeper",
  },
  {
    name: "달리기",
    description: "체력 및 스피드 향상 훈련",
    icon: <Timer className="h-6 w-6 text-[#f59f00]" />,
    href: "/lessons/running",
  },
  {
    name: "기타레슨",
    description: "특별 기술 및 맞춤형 훈련",
    icon: <Sparkles className="h-6 w-6 text-[#e64980]" />,
    href: "/lessons/other",
  },
];

// 연령대별 카테고리
const ageCategories = [
  {
    name: "유아 (4-7세)",
    description: "놀이를 통한 기초 운동능력 향상",
    icon: <Baby className="h-6 w-6 text-[#12b886]" />,
    href: "/ages/toddler",
  },
  {
    name: "초등 저학년",
    description: "즐거운 축구 입문 프로그램",
    icon: <Backpack className="h-6 w-6 text-[#fd7e14]" />,
    href: "/ages/elementary-lower",
  },
  {
    name: "초등 고학년",
    description: "체계적인 기술 훈련 시작",
    icon: <School className="h-6 w-6 text-[#7950f2]" />,
    href: "/ages/elementary-upper",
  },
  {
    name: "중학생",
    description: "포지션별 전문성 강화",
    icon: <Flag className="h-6 w-6 text-[#1c7ed6]" />,
    href: "/ages/middle-school",
  },
  {
    name: "고등학생",
    description: "전술 이해 및 경기력 향상",
    icon: <Leaf className="h-6 w-6 text-[#fa5252]" />,
    href: "/ages/high-school",
  },
  {
    name: "성인",
    description: "취미 및 전문 축구 트레이닝",
    icon: <UserCircle className="h-6 w-6 text-[#4c6ef5]" />,
    href: "/ages/adult",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 레슨 유형 섹션 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2">레슨 유형</h2>
          <p className="text-gray-600 text-sm mb-6">
            원하는 레슨 스타일을 선택하여 축구 실력을 향상시켜보세요
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {lessonCategories.map((category: {
              name: string;
              description: string;
              icon: React.ReactNode;
              href: string;
            }) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 transition duration-200 hover:shadow-md hover:border-gray-300 text-center h-full"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 bg-gray-100 rounded-full">
                  {category.icon}
                </div>
                <h3 className="text-sm font-bold mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500 leading-snug">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* 연령대별 섹션 */}
        <div>
          <h2 className="text-2xl font-bold mb-2">연령대별 맞춤 레슨</h2>
          <p className="text-gray-600 text-sm mb-6">
            각 연령대에 맞는 최적화된 커리큘럼으로 체계적인 축구 교육을 제공합니다
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {ageCategories.map((category: {
              name: string;
              description: string;
              icon: React.ReactNode;
              href: string;
            }) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 transition duration-200 hover:shadow-md hover:border-gray-300 text-center h-full"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 bg-gray-100 rounded-full">
                  {category.icon}
                </div>
                <h3 className="text-sm font-bold mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500 leading-snug">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}