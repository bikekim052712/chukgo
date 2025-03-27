import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Star
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonWithDetails } from "@shared/schema";

export default function Lessons() {
  const { data: lessons, isLoading } = useQuery<LessonWithDetails[]>({
    queryKey: ['/api/lessons/recommended'],
  });

  return (
    <section id="lessons" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">추천 레슨 프로그램</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          목표와 수준에 맞는 다양한 축구 레슨 프로그램을 만나보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <Button variant="link" asChild className="text-primary hover:text-primary-dark">
            <Link href="/lessons">
              모든 레슨 보기 <span className="ml-2">→</span>
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

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition duration-300">
      <div className="h-36 overflow-hidden relative">
        <img 
          src={lesson.image || "https://via.placeholder.com/400x192?text=No+Image"} 
          alt={lesson.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white font-bold text-sm line-clamp-1">{lesson.title}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
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
        
        <div className="mb-2">
          <p className="text-xs text-neutral-600 mb-1">
            <MapPin className="inline-block h-3 w-3 text-neutral-400 mr-1" /> {lesson.location}
          </p>
          <p className="text-xs text-neutral-600 mb-1">
            <Users className="inline-block h-3 w-3 text-neutral-400 mr-1" /> 최대 {lesson.groupSize}명 {
              lesson.groupSize <= 5 ? "소그룹" :
              lesson.groupSize <= 8 ? "그룹" : "팀"
            }
          </p>
          <p className="text-xs text-neutral-600">
            <GraduationCap className="inline-block h-3 w-3 text-neutral-400 mr-1" /> {lesson.skillLevel?.name || "모든 레벨"} 대상
          </p>
        </div>
        
        <p className="text-xs mb-3 line-clamp-1">
          {lesson.description}
        </p>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-sm">{getPriceDisplay().split(' ')[0]}</span>
            <span className="text-xs text-neutral-500 font-normal">
              {getPriceDisplay().split(' ').slice(1).join(' ')}
            </span>
          </p>
          <Button asChild size="sm" className="h-8 text-xs px-3">
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
