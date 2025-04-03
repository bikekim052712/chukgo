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
import { MapPin, Star, Award, Book, Calendar } from "lucide-react";
import { CoachWithUser, Lesson, LessonWithDetails } from "@shared/schema";

export default function CoachProfile() {
  const { id } = useParams<{ id: string }>();
  const coachId = parseInt(id);
  
  const { data: coach, isLoading: isLoadingCoach } = useQuery<CoachWithUser>({
    queryKey: [`/api/coaches/${coachId}`],
  });
  
  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: [`/api/coaches/${coachId}/lessons`],
  });
  
  if (isLoadingCoach) {
    return <CoachProfileSkeleton />;
  }
  
  if (!coach) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">코치를 찾을 수 없습니다</h1>
          <p className="text-neutral-600 mb-6">요청하신 코치 정보를 찾을 수 없습니다.</p>
          <Button asChild>
            <Link href="/coaches">코치 목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Rating is stored as 0-50 (0-5 stars with decimal)
  const rating = coach.rating ? (coach.rating / 10).toFixed(1) : "0.0";
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coach Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="aspect-square overflow-hidden">
              <img 
                src={coach.user.profileImage || "https://via.placeholder.com/400x400?text=No+Image"} 
                alt={coach.user.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{coach.user.fullName} 코치</h1>
                <div className="flex items-center text-[#F9A826]">
                  <Star className="h-1.5 w-1.5 fill-current" />
                  <span className="ml-1 font-medium">{rating}</span>
                  <span className="text-neutral-500 text-sm ml-1">({coach.reviewCount || 0})</span>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-6">
                <MapPin className="inline-block h-4 w-4 text-neutral-400 mr-1" /> {coach.location}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {coach.specializations?.map((specialization, index) => (
                  <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-600">
                    {specialization}
                  </Badge>
                ))}
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mb-6">
                <p className="font-bold text-xl text-primary mb-1">
                  ₩{coach.hourlyRate?.toLocaleString()}<span className="text-sm text-neutral-500 font-normal">/시간</span>
                </p>
              </div>
              
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" /> 레슨 예약하기
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Coach Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">코치 소개</TabsTrigger>
              <TabsTrigger value="lessons">레슨 프로그램</TabsTrigger>
              <TabsTrigger value="reviews">후기</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>코치 소개</CardTitle>
                  <CardDescription>전문 경력 및 자격 사항</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">소개</h3>
                    <p className="text-neutral-600">{coach.user.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">경력</h3>
                    <p className="text-neutral-600">{coach.experience}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">자격증</h3>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-[#F9A826] mr-2" />
                      <p className="text-neutral-600">{coach.certifications}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">레슨 스타일</h3>
                    <ul className="list-disc list-inside text-neutral-600">
                      <li>체계적이고 단계적인 교육 프로그램</li>
                      <li>학습자의 수준과 목표에 맞춘 맞춤형 교육</li>
                      <li>실전 경험을 바탕으로 한 효과적인 훈련 방식</li>
                      <li>긍정적인 피드백과 동기부여 중심 코칭</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lessons">
              <Card>
                <CardHeader>
                  <CardTitle>레슨 프로그램</CardTitle>
                  <CardDescription>{coach.user.fullName} 코치의 레슨 프로그램</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingLessons ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : lessons && lessons.length > 0 ? (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{lesson.title}</h3>
                            <Badge>{lesson.price.toLocaleString()}원</Badge>
                          </div>
                          <p className="text-sm text-neutral-600 mb-3">{lesson.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-neutral-500">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1" /> {lesson.location}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="inline-flex items-center">
                                <Book className="h-3 w-3 mr-1" /> {lesson.groupSize}명까지
                              </span>
                            </div>
                            <Button asChild size="sm">
                              <Link href={`/lessons/${lesson.id}`}>자세히 보기</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-neutral-500">등록된 레슨이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>수강생 후기</CardTitle>
                  <CardDescription>{coach.user.fullName} 코치의 수강생 후기</CardDescription>
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
      </div>
    </div>
  );
}

function CoachProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coach Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
              
              <Skeleton className="h-5 w-32 mb-6" />
              
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-16" />
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mb-6">
                <Skeleton className="h-7 w-32 mb-1" />
              </div>
              
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
        
        {/* Coach Details Skeleton */}
        <div className="lg:col-span-2">
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
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-16 w-full" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-5 w-48" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
