import { Link } from "wouter";
import { 
  User, 
  Users, 
  Bell, 
  Tent, 
  ShieldCheck, 
  Brain, 
  Trophy,
  Activity,
  Dribbble,
  Shirt 
} from "lucide-react";

// 카테고리 데이터
const categories = [
  {
    name: "개인 레슨",
    icon: <User className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/individual",
  },
  {
    name: "그룹 레슨",
    icon: <Users className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/group",
  },
  {
    name: "클리닉/특강",
    icon: <Bell className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/clinic",
  },
  {
    name: "캠프",
    icon: <Tent className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/camp",
  },
  {
    name: "골키퍼",
    icon: <ShieldCheck className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/goalkeeper",
  },
  {
    name: "기술 훈련",
    icon: <Dribbble className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/skills",
  },
  {
    name: "전술 훈련",
    icon: <Brain className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/tactics",
  },
  {
    name: "체력 훈련",
    icon: <Activity className="h-6 w-6 text-[#6b21ff]" />,
    href: "/lessons/fitness",
  },
  {
    name: "유니폼 제작",
    icon: <Shirt className="h-6 w-6 text-[#6b21ff]" />,
    href: "/services/uniform",
  },
  {
    name: "기타",
    icon: <Trophy className="h-6 w-6 text-[#6b21ff]" />,
    href: "/services/other",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">어떤 축구 레슨을 찾으시나요?</h2>
        
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href}
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-md transition duration-300 text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 bg-[#f5f0ff] rounded-full">
                {category.icon}
              </div>
              <span className="text-sm font-medium text-gray-800">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}