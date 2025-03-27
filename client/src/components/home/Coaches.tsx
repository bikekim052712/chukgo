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
            Array(3).fill(0).map((_, i) => (
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
      <div className="h-[220px] md:h-[180px] lg:h-[220px] overflow-hidden">
        <img 
          src={coach.user.profileImage || "https://via.placeholder.com/400x220?text=No+Image"} 
          alt={coach.user.fullName} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">{coach.user.fullName} 코치</h3>
          <div className="flex items-center text-[#F9A826]">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-medium">{rating}</span>
            <span className="text-neutral-500 text-sm ml-1">({coach.reviewCount || 0})</span>
          </div>
        </div>
        
        <p className="text-sm text-neutral-600 mb-3">
          <MapPin className="inline-block h-4 w-4 text-neutral-400 mr-1" /> {coach.location}
        </p>
        
        <p className="text-sm mb-4 line-clamp-2">
          {coach.user.bio}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {coach.specializations?.map((specialization, index) => (
            <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-600">
              {specialization}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-lg">₩{coach.hourlyRate?.toLocaleString()}</span>
            <span className="text-sm text-neutral-500 font-normal">/시간</span>
          </p>
          <Button asChild size="sm">
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
      <Skeleton className="h-[220px] md:h-[180px] lg:h-[220px] w-full" />
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <Skeleton className="h-4 w-40 mb-3" />
        
        <Skeleton className="h-16 w-full mb-4" />
        
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
