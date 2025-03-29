import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Star,
  Calendar,
  Clock,
  Trophy,
  Sparkles
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonWithDetails } from "@shared/schema";

export default function Lessons() {
  const { data: lessons, isLoading } = useQuery<LessonWithDetails[]>({
    queryKey: ['/api/lessons/recommended'],
  });

  return (
    <section id="lessons" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="text-primary mr-2 h-6 w-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">인기 유소년 레슨 프로그램</h2>
        </div>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          아이의 연령과 수준에 맞춘 체계적인 축구 교육 프로그램을 만나보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <LessonSkeleton key={i} />
            ))
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">등록된 레슨이 없습니다.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/5">
            <Link href="/lessons">
              모든 레슨 프로그램 보기 <span className="ml-2">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: LessonWithDetails }) {
  const rating = lesson.coach.rating ? (lesson.coach.rating / 10).toFixed(1) : "0.0";
  
  // Format price for display - e.g. "₩180,000 /4주 과정" or "₩50,000 /시간"
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
    return `${priceText} /시간`;
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

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-neutral-200">
      <div className="h-36 overflow-hidden relative">
        <img 
          src={lesson.image || "https://via.placeholder.com/400x192?text=No+Image"} 
          alt={lesson.title} 
          className="w-full h-full object-cover"
        />
        {getAgeGroup() !== "전 연령" && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded-full flex items-center">
            <Users className="w-3 h-3 mr-1" /> {getAgeGroup()}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="text-white font-bold text-sm line-clamp-1">{lesson.title}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img 
              src={lesson.coach.user.profileImage || "https://via.placeholder.com/40x40?text=Coach"} 
              alt={lesson.coach.user.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="font-medium text-sm">{lesson.coach.user.fullName} 코치</p>
            <div className="flex items-center text-xs text-[#F9A826]">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1">{rating}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {getLessonTags().map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-none text-xs">
              {tag}
            </Badge>
          ))}
          {lesson.lessonType && (
            <Badge variant="outline" className="bg-neutral-100 text-neutral-600 text-xs py-0">
              {lesson.lessonType.name}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <p className="text-xs text-neutral-600 flex items-center">
            <MapPin className="h-3 w-3 text-neutral-400 mr-1 shrink-0" /> 
            <span className="truncate">{lesson.location}</span>
          </p>
          <p className="text-xs text-neutral-600 flex items-center">
            <Users className="h-3 w-3 text-neutral-400 mr-1 shrink-0" /> 
            <span>최대 {lesson.groupSize}명</span>
          </p>
          <p className="text-xs text-neutral-600 flex items-center">
            <GraduationCap className="h-3 w-3 text-neutral-400 mr-1 shrink-0" /> 
            <span>{lesson.skillLevel?.name || "전체 레벨"}</span>
          </p>
          <p className="text-xs text-neutral-600 flex items-center">
            <Clock className="h-3 w-3 text-neutral-400 mr-1 shrink-0" /> 
            <span>{lesson.duration}분 수업</span>
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-sm">{getPriceDisplay().split(' ')[0]}</span>
            <span className="text-xs text-neutral-500 font-normal">
              {getPriceDisplay().split(' ').slice(1).join(' ')}
            </span>
          </p>
          <Button asChild size="sm" className="h-8 text-xs px-3 bg-primary hover:bg-primary/90">
            <Link href={`/lessons/${lesson.id}`}>레슨 신청</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LessonSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-36 w-full" />
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Skeleton className="w-8 h-8 rounded-full mr-2" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        
        <div className="space-y-1 mb-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        
        <Skeleton className="h-3 w-full mb-3" />
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
