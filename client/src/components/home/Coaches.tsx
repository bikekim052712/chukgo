import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, MapPin, Medal, GraduationCap, ShieldCheck, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CoachWithUser } from "@shared/schema";

export default function Coaches() {
  const { data: coaches, isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ['/api/coaches/top'],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">인기 축구 코치</h2>
              <p className="text-gray-600">
                최고의 평점을 받은 축고의 인기 축구 코치를 만나보세요
              </p>
            </div>
            <Link 
              href="/coaches" 
              className="flex items-center text-[#5D3FD3] font-medium text-sm mt-4 md:mt-0"
            >
              모든 코치 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="auto-slide-container">
            {isLoading ? (
              <div className="flex gap-5 pb-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80">
                    <CoachSkeleton />
                  </div>
                ))}
              </div>
            ) : coaches && coaches.length > 0 ? (
              <>
                <div className="auto-slide-content">
                  {/* 첫 번째 세트 */}
                  {[...coaches, ...coaches, ...coaches].map((coach, index) => (
                    <div key={`${coach.id}-${index}`} className="flex-shrink-0 w-80 mx-2.5">
                      <CoachCard coach={coach} />
                    </div>
                  ))}
                </div>
                <div className="auto-slide-content auto-slide-clone">
                  {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
                  {[...coaches, ...coaches, ...coaches].map((coach, index) => (
                    <div key={`clone-${coach.id}-${index}`} className="flex-shrink-0 w-80 mx-2.5">
                      <CoachCard coach={coach} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 w-full">
                <p className="text-gray-500">등록된 코치가 없습니다.</p>
              </div>
            )}
          </div>
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {/* 코치 이미지 */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {coach.user.profileImage ? (
          <img 
            src={coach.user.profileImage} 
            alt={coach.user.fullName || "코치 프로필"} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F3FF]">
            <div className="w-20 h-20 bg-[#5D3FD3] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {coach.user.fullName ? coach.user.fullName.charAt(0) : "C"}
            </div>
          </div>
        )}
        
        {/* 자격증 배지 */}
        {hasCertification && (
          <div className="absolute top-3 right-3 bg-[#5D3FD3] text-white text-xs py-1 px-3 rounded-full flex items-center shadow-sm">
            <ShieldCheck className="w-3 h-3 mr-1" /> 자격증 보유
          </div>
        )}
      </div>
      
      {/* 코치 정보 */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">{coach.user.fullName} 코치</h3>
          <div className="flex items-center">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium text-sm text-yellow-700">{rating}</span>
              <span className="text-gray-500 text-xs ml-1">({coach.reviewCount || 0})</span>
            </div>
          </div>
        </div>
        
        {/* 위치 */}
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
          <p className="text-sm text-gray-600">{coach.location || "위치 정보 없음"}</p>
        </div>
        
        {/* 전문 분야 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getExperienceBadge(coach.experience) && (
            <span className="bg-[#F0EBFF] text-[#5D3FD3] text-xs px-2.5 py-1 rounded-full flex items-center">
              <GraduationCap className="mr-1 h-3 w-3" />
              {getExperienceBadge(coach.experience)}
            </span>
          )}
          {coach.specializations?.slice(0, 2).map((specialization, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
              {specialization}
            </span>
          ))}
        </div>
        
        {/* 코치 소개 */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {coach.user.bio || "유소년 선수들의 기초 실력 향상과 자신감 향상에 중점을 두고 지도합니다."}
        </p>
        
        {/* 가격 및 버튼 */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-[#5D3FD3]">
              <span className="text-lg">₩{coach.hourlyRate?.toLocaleString() || '40,000'}</span>
              <span className="text-xs text-gray-500 font-normal ml-1">/시간</span>
            </p>
          </div>
          <Link href={`/coaches/${coach.id}`}>
            <Button variant="outline" className="border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#F0EBFF]">
              프로필 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CoachSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="h-48 w-full" />
      
      {/* 내용 스켈레톤 */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        
        <Skeleton className="h-5 w-40 mb-3" />
        
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-4" />
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
