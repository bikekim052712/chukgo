import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CoachWithUser } from "@shared/schema";

export default function Coaches() {
  const { data: coaches, isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ['/api/coaches/top'],
  });

  return (
    <section id="coaches" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">인기 축구 코치</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          검증된 전문 코치들과 함께 축구 실력을 향상시키세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <Button variant="link" asChild className="text-primary hover:text-primary-dark">
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
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition duration-300">
      <div className="h-[160px] md:h-[140px] lg:h-[160px] overflow-hidden">
        <img 
          src={coach.user.profileImage || "https://via.placeholder.com/400x220?text=No+Image"} 
          alt={coach.user.fullName} 
          className="w-full h-full object-cover"
        />
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
        
        <p className="text-xs text-neutral-600 mb-2">
          <MapPin className="inline-block h-3.5 w-3.5 text-neutral-400 mr-1" /> {coach.location}
        </p>
        
        <p className="text-xs mb-3 line-clamp-1">
          {coach.user.bio}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {coach.specializations?.slice(0, 2).map((specialization, index) => (
            <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-600 text-xs py-0">
              {specialization}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-sm">₩{coach.hourlyRate?.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 font-normal">/시간</span>
          </p>
          <Button asChild size="sm" className="h-8 text-xs px-3">
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
