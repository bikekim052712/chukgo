import { Link } from "wouter";
import { 
  User, 
  Users,  
  ShieldCheck, 
  Timer,
  Sparkles,
  GraduationCap,
} from "lucide-react";

// 레슨 카테고리 데이터 - 요청대로 개인레슨, 그룹레슨, 골키퍼레슨, 달리기, 기타레슨으로 구성
const categories = [
  {
    name: "개인레슨",
    description: "1:1 맞춤형 축구 지도",
    icon: <User className="h-7 w-7 text-[#6b21ff]" />,
    href: "/lessons/individual",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  },
  {
    name: "그룹레슨",
    description: "친구들과 함께하는 그룹 훈련",
    icon: <Users className="h-7 w-7 text-[#4263eb]" />,
    href: "/lessons/group",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    name: "골키퍼레슨",
    description: "전문 골키퍼 기술 트레이닝",
    icon: <ShieldCheck className="h-7 w-7 text-[#0ca678]" />,
    href: "/lessons/goalkeeper",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
  },
  {
    name: "달리기",
    description: "체력 및 스피드 향상 훈련",
    icon: <Timer className="h-7 w-7 text-[#f59f00]" />,
    href: "/lessons/running",
    bgColor: "bg-yellow-50",
    hoverColor: "hover:bg-yellow-100",
  },
  {
    name: "기타레슨",
    description: "특별 기술 및 맞춤형 훈련",
    icon: <Sparkles className="h-7 w-7 text-[#e64980]" />,
    href: "/lessons/other",
    bgColor: "bg-pink-50",
    hoverColor: "hover:bg-pink-100",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 font-sans">어떤 축구 레슨을 찾으시나요?</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          원하는 레슨 유형을 선택하고 전문 코치와 함께 축구 실력을 향상시켜보세요
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href}
              className={`flex flex-col items-center p-6 ${category.bgColor} ${category.hoverColor} rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 text-center h-full`}
            >
              <div className={`w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-xl shadow-sm`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}