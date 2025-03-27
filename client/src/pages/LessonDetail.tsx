import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Clock, GraduationCap, Calendar, Star } from "lucide-react";
import { LessonWithDetails } from "@shared/schema";

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id);
  
  const { data: lesson, isLoading } = useQuery<LessonWithDetails>({
    queryKey: [`/api/lessons/${lessonId}`],
  });
  
  if (isLoading) {
    return <LessonDetailSkeleton />;
  }
  
  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">레슨을 찾을 수 없습니다</h1>
          <p className="text-neutral-600 mb-6">요청하신 레슨 정보를 찾을 수 없습니다.</p>
          <Button asChild>
            <Link href="/lessons">레슨 목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }
  
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
  
  // Rating is stored as 0-50 (0-5 stars with decimal)
  const rating = lesson.coach.rating ? (lesson.coach.rating / 10).toFixed(1) : "0.0";
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lesson Detail Card */}
        <div className="lg:col-span-2">
          <div className="relative h-[300px] rounded-xl overflow-hidden mb-6">
            <img 
              src={lesson.image || "https://via.placeholder.com/800x300?text=No+Image"} 
              alt={lesson.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{lesson.title}</h1>
                <Badge className="bg-[#F9A826] hover:bg-[#F9A826] text-black">
                  {lesson.lessonType?.name || "레슨"}
                </Badge>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">레슨 개요</TabsTrigger>
              <TabsTrigger value="details">상세 정보</TabsTrigger>
              <TabsTrigger value="reviews">후기</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>레슨 개요</CardTitle>
                  <CardDescription>레슨 소개 및 주요 정보</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">소개</h3>
                    <p className="text-neutral-600">{lesson.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-neutral-500">장소</p>
                        <p className="font-medium">{lesson.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                      <Users className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-neutral-500">그룹 크기</p>
                        <p className="font-medium">최대 {lesson.groupSize}명</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                      <Clock className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-neutral-500">수업 시간</p>
                        <p className="font-medium">{lesson.duration}분</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-neutral-500">난이도</p>
                        <p className="font-medium">{lesson.skillLevel?.name || "모든 레벨"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">무엇을 배우게 되나요?</h3>
                    <ul className="list-disc list-inside text-neutral-600 space-y-1">
                      {lesson.tags?.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      )) || (
                        <>
                          <li>축구의 기본 규칙과 이해</li>
                          <li>기초적인 볼 컨트롤과 패스 기술</li>
                          <li>포지션별 역할과 움직임</li>
                          <li>팀플레이와 전술적 이해</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">준비물</h3>
                    <ul className="list-disc list-inside text-neutral-600 space-y-1">
                      <li>축구화 (또는 운동화)</li>
                      <li>운동복</li>
                      <li>신가드 (정강이 보호대)</li>
                      <li>물병</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>상세 정보</CardTitle>
                  <CardDescription>레슨 진행 방식 및 커리큘럼</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">레슨 진행 방식</h3>
                    <p className="text-neutral-600 mb-4">
                      이 레슨은 {lesson.duration}분 동안 진행되며, 다음과 같은 구성으로 진행됩니다:
                    </p>
                    <ul className="list-disc list-inside text-neutral-600 space-y-1">
                      <li>워밍업 (15분): 부상 방지를 위한 준비운동</li>
                      <li>기술 훈련 (30분): 주요 기술 연습 및 드릴</li>
                      <li>실전 연습 (30분): 실제 게임 상황에서의 응용</li>
                      <li>마무리 (15분): 정리운동 및 피드백</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">레슨 일정</h3>
                    <p className="text-neutral-600 mb-2">
                      레슨은 주 1회, 총 4주 과정으로 진행됩니다. 정확한 일정은 예약 시 선택할 수 있습니다.
                    </p>
                    <p className="text-neutral-600">
                      * 날씨 등의 이유로 레슨이 취소될 경우, 추가 보강 수업이 제공됩니다.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">수강 대상</h3>
                    <p className="text-neutral-600">
                      {lesson.skillLevel?.name === "입문" && "축구를 처음 접하거나 기초부터 배우고 싶은 분들을 위한 수업입니다."}
                      {lesson.skillLevel?.name === "초급" && "기본적인 축구 규칙을 알고 간단한 기술을 배워본 분들을 위한 수업입니다."}
                      {lesson.skillLevel?.name === "중급" && "기본기가 갖춰진 분들이 더 높은 수준의 기술과 전술을 배울 수 있는 수업입니다."}
                      {lesson.skillLevel?.name === "고급" && "심화된 기술과 전문적인 전술 훈련을 원하는 경험자를 위한 수업입니다."}
                      {!lesson.skillLevel?.name && "모든 수준의 학습자가 참여할 수 있습니다. 개인의 수준에 맞게 맞춤형 교육이 제공됩니다."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">취소 및 환불 정책</h3>
                    <ul className="list-disc list-inside text-neutral-600 space-y-1">
                      <li>레슨 48시간 전까지: 100% 환불</li>
                      <li>레슨 24-48시간 전: 50% 환불</li>
                      <li>레슨 24시간 이내: 환불 불가</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>수강생 후기</CardTitle>
                  <CardDescription>실제 수강생들의 후기를 확인해보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-neutral-500">아직 후기가 없습니다.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Booking and Coach Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>레슨 예약</CardTitle>
              <CardDescription>원하는 일정에 레슨을 예약하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="font-bold text-2xl text-primary mb-1">
                  {getPriceDisplay().split(' ')[0]}
                  <span className="text-sm text-neutral-500 font-normal ml-1">
                    {getPriceDisplay().split(' ').slice(1).join(' ')}
                  </span>
                </p>
              </div>
              
              <Button asChild className="w-full mb-4">
                <Link href={`/booking/${lesson.id}`}>
                  <Calendar className="mr-2 h-4 w-4" /> 레슨 예약하기
                </Link>
              </Button>
              
              <p className="text-sm text-neutral-500 text-center">
                * 예약 확정 후 결제 정보가 안내됩니다
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>코치 정보</CardTitle>
              <CardDescription>이 레슨의 담당 코치입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={lesson.coach.user.profileImage || "https://via.placeholder.com/64x64?text=Coach"} 
                    alt={lesson.coach.user.fullName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-medium">{lesson.coach.user.fullName} 코치</h3>
                  <div className="flex items-center text-xs text-[#F9A826]">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="ml-1">{rating}</span>
                    <span className="text-neutral-500 ml-1">({lesson.coach.reviewCount || 0})</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    <MapPin className="inline-block h-3 w-3 text-neutral-400 mr-1" /> {lesson.coach.location}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                {lesson.coach.user.bio}
              </p>
              
              <Button variant="outline" asChild className="w-full">
                <Link href={`/coaches/${lesson.coach.id}`}>코치 프로필 보기</Link>
              </Button>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-neutral-100 rounded-lg">
            <h3 className="font-medium mb-2">도움이 필요하신가요?</h3>
            <p className="text-sm text-neutral-600 mb-3">
              레슨에 대해 궁금한 점이 있으시면 문의해주세요.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="#contact">문의하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lesson Detail Skeleton */}
        <div className="lg:col-span-2">
          <Skeleton className="h-[300px] w-full rounded-xl mb-6" />
          
          <div className="mb-6">
            <Skeleton className="h-10 w-60" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-32 w-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Booking and Coach Info Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-6" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Skeleton className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
