import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  MapPin, 
  Users, 
  GraduationCap, 
  Star,
  Clock,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonWithDetails } from "@shared/schema";

export default function Lessons() {
  const { data: lessons, isLoading } = useQuery<LessonWithDetails[]>({
    queryKey: ['/api/lessons/recommended'],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">인기 레슨 프로그램</h2>
              <p className="text-gray-600">
                유소년 선수들이 좋아하는 인기 축구 레슨을 소개합니다
              </p>
            </div>
            <Link 
              href="/lessons" 
              className="flex items-center text-[#5D3FD3] font-medium text-sm mt-4 md:mt-0"
            >
              모든 레슨 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="auto-slide-container">
            {isLoading ? (
              <div className="flex gap-5 pb-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80">
                    <LessonSkeleton />
                  </div>
                ))}
              </div>
            ) : lessons && lessons.length > 0 ? (
              <>
                <div className="auto-slide-content">
                  {/* 첫 번째 세트 */}
                  {[...lessons, ...lessons, ...lessons].map((lesson, index) => (
                    <div key={`${lesson.id}-${index}`}>
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </div>
                <div className="auto-slide-content auto-slide-clone">
                  {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
                  {[...lessons, ...lessons, ...lessons].map((lesson, index) => (
                    <div key={`clone-${lesson.id}-${index}`}>
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 w-full">
                <p className="text-gray-500">등록된 레슨이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: LessonWithDetails }) {
  const rating = lesson.coach.rating ? (lesson.coach.rating / 10).toFixed(1) : "0.0";
  
  // Format price for display - e.g. "₩180,000 /4주 과정" or "₩50,000 /회"
  const getPriceDisplay = () => {
    let priceText = `₩${lesson.price.toLocaleString()}`;
    
    // Determine price type based on lesson
    if (lesson.title.includes("과정") || lesson.title.includes("프로그램") || lesson.title.includes("클래스")) {
      if (lesson.title.includes("4주")) {
        return `${priceText} /4주 과정`;
      } else if (lesson.title.includes("8주")) {
        return `${priceText} /8주 과정`;
      } else {
        return `${priceText} /월 4회`;
      }
    }
    
    // Default hourly pricing
    return `${priceText} /회`;
  };
  
  // 레슨 유형에 따른 대상 연령대 설정
  const getAgeGroup = () => {
    if (lesson.title.includes("유치부") || lesson.title.includes("미취학")) return "5-7세";
    if (lesson.title.includes("초등 저학년") || lesson.title.includes("초등부")) return "8-10세";
    if (lesson.title.includes("초등 고학년")) return "11-13세";
    if (lesson.title.includes("중등") || lesson.title.includes("중학생")) return "14-16세";
    if (lesson.title.includes("고등") || lesson.title.includes("고교생")) return "17-19세";
    return "전 연령";
  };
  
  // 레슨 특징 태그 생성
  const getLessonTags = () => {
    const tags = [];
    
    if (lesson.title.includes("기초") || lesson.title.includes("입문")) {
      tags.push("기초 훈련");
    }
    
    if (lesson.title.includes("드리블") || lesson.description?.includes("드리블")) {
      tags.push("드리블 특화");
    }
    
    if (lesson.title.includes("골키퍼") || lesson.description?.includes("골키퍼")) {
      tags.push("골키퍼 훈련");
    }
    
    if (lesson.title.includes("경기") || lesson.description?.includes("경기") || lesson.description?.includes("시합")) {
      tags.push("실전 경기");
    }
    
    if (lesson.groupSize <= 3) {
      tags.push("1:1 맞춤");
    }
    
    return tags.slice(0, 2); // 최대 2개까지만 표시
  };

  // 레슨 난이도 색상 결정
  const getDifficultyColor = () => {
    if (!lesson.skillLevel) return "#9CA3AF"; // 기본 회색
    
    const levelName = lesson.skillLevel.name.toLowerCase();
    if (levelName.includes("초보") || levelName.includes("입문")) {
      return "#4ADE80"; // 연두색 (쉬움)
    } else if (levelName.includes("중급")) {
      return "#FCD34D"; // 노란색 (중간)
    } else if (levelName.includes("고급") || levelName.includes("전문")) {
      return "#F87171"; // 빨간색 (어려움)
    }
    
    return "#9CA3AF"; // 기본 회색
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {/* 레슨 이미지 */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {lesson.image ? (
          <img 
            src={lesson.image} 
            alt={lesson.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F3FF]">
            <Calendar className="h-16 w-16 text-[#5D3FD3]" />
          </div>
        )}
        
        {/* 연령대 배지 */}
        {getAgeGroup() !== "전 연령" && (
          <div className="absolute top-3 right-3 bg-[#5D3FD3] text-white text-xs py-1 px-3 rounded-full flex items-center shadow-sm">
            <Users className="w-3 h-3 mr-1" /> {getAgeGroup()}
          </div>
        )}
        
        {/* 난이도 표시 */}
        <div className="absolute left-3 top-3 flex items-center bg-white/80 backdrop-blur-sm text-xs py-0.5 px-2 rounded-full">
          <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: getDifficultyColor() }}></span>
          <span className="font-medium">{lesson.skillLevel?.name || "모든 레벨"}</span>
        </div>
      </div>
      
      {/* 레슨 정보 */}
      <div className="p-5">
        {/* 제목 */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{lesson.title}</h3>
        
        {/* 코치 정보 */}
        <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 mr-2">
            {lesson.coach.user.profileImage ? (
              <img 
                src={lesson.coach.user.profileImage} 
                alt={lesson.coach.user.fullName || "코치"} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-[#5D3FD3] flex items-center justify-center text-white text-xs font-bold">
                {lesson.coach.user.fullName ? lesson.coach.user.fullName.charAt(0) : "C"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{lesson.coach.user.fullName} 코치</p>
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-xs font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 레슨 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {getLessonTags().map((tag, index) => (
            <span key={index} className="text-xs bg-[#F0EBFF] text-[#5D3FD3] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {lesson.lessonType && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {lesson.lessonType.name}
            </span>
          )}
        </div>
        
        {/* 레슨 세부 정보 */}
        <div className="grid grid-cols-2 gap-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-xs">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span className="truncate">{lesson.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs">
            <Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>최대 {lesson.groupSize}명</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>{lesson.skillLevel?.name || "전체 레벨"}</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>{lesson.duration}분 수업</span>
          </div>
        </div>
        
        {/* 가격 및 버튼 */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#5D3FD3] font-bold">
              <span className="text-lg">{getPriceDisplay().split(' ')[0]}</span>
              <span className="text-xs text-gray-500 font-normal ml-1">
                {getPriceDisplay().split(' ').slice(1).join(' ')}
              </span>
            </p>
          </div>
          <Link href={`/lessons/${lesson.id}`}>
            <Button className="bg-[#5D3FD3] hover:bg-[#4C2CB3] text-white">
              자세히 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="h-48 w-full" />
      
      {/* 내용 스켈레톤 */}
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
          <Skeleton className="w-7 h-7 rounded-full mr-2" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>
        
        <div className="flex gap-1.5 mb-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 mb-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
