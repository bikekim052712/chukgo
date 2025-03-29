import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Medal, GraduationCap, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CoachWithUser } from "@shared/schema";

export default function Coaches() {
  const { data: coaches, isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ['/api/coaches/top'],
  });

  return (
    <section id="coaches" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-3">
          <Medal className="text-primary mr-2 h-6 w-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">인기 유소년 축구 코치</h2>
        </div>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          검증된 자격과 풍부한 경험을 갖춘 전문 유소년 축구 코치를 만나보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <CoachSkeleton key={i} />
            ))
          ) : coaches && coaches.length > 0 ? (
            coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">등록된 코치가 없습니다.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/5">
            <Link href="/coaches">
              모든 코치 보기 <span className="ml-2">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CoachCard({ coach }: { coach: CoachWithUser }) {
  // Rating is stored as 0-50 (0-5 stars with decimal)
  const rating = coach.rating ? (coach.rating / 10).toFixed(1) : "0.0";
  
  // 코치의 경력에 따른 뱃지 텍스트 결정
  const getExperienceBadge = (experience: string | null) => {
    if (!experience) return null;
    
    if (experience.includes('10년')) return '10년 이상 경력';
    if (experience.includes('5년')) return '5년+ 경력';
    if (experience.includes('3년')) return '3년+ 경력';
    return '전문 코치';
  };
  
  // 자격증 뱃지 표시 여부
  const hasCertification = coach.certifications && coach.certifications.length > 0;
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-neutral-200">
      <div className="h-[160px] md:h-[140px] lg:h-[160px] overflow-hidden relative">
        <img 
          src={coach.user.profileImage || "https://via.placeholder.com/400x220?text=No+Image"} 
          alt={coach.user.fullName} 
          className="w-full h-full object-cover"
        />
        {hasCertification && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded-full flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> 자격증 보유
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold">{coach.user.fullName} 코치</h3>
          <div className="flex items-center text-[#F9A826]">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="ml-1 font-medium text-sm">{rating}</span>
            <span className="text-neutral-500 text-xs ml-1">({coach.reviewCount || 0})</span>
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <MapPin className="h-3.5 w-3.5 text-neutral-400 mr-1 shrink-0" />
          <p className="text-xs text-neutral-600 truncate">{coach.location}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {getExperienceBadge(coach.experience) && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs">
              <GraduationCap className="mr-1 h-3 w-3" />
              {getExperienceBadge(coach.experience)}
            </Badge>
          )}
          {coach.specializations?.slice(0, 2).map((specialization, index) => (
            <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-600 text-xs py-0">
              {specialization}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs mb-3 line-clamp-2 h-8 text-neutral-600">
          {coach.user.bio || "유소년 선수들의 기초 실력 향상과 자신감 향상에 중점을 두고 지도합니다."}
        </p>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-sm">₩{coach.hourlyRate?.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 font-normal">/시간</span>
          </p>
          <Button asChild size="sm" className="h-8 text-xs px-3 bg-primary hover:bg-primary/90">
            <Link href={`/coaches/${coach.id}`}>프로필 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CoachSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-[160px] md:h-[140px] lg:h-[160px] w-full" />
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3.5 w-14" />
        </div>
        
        <Skeleton className="h-3.5 w-32 mb-2" />
        
        <Skeleton className="h-4 w-full mb-3" />
        
        <div className="flex gap-1 mb-3">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
