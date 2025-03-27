import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Search,
  Filter,
  Star 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonWithDetails, LessonType, SkillLevel } from "@shared/schema";
import { LOCATIONS } from "@/lib/constants";

export default function LessonList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [lessonTypeId, setLessonTypeId] = useState(searchParams.get("lessonTypeId") || "");
  const [skillLevelId, setSkillLevelId] = useState(searchParams.get("skillLevelId") || "");
  const [priceRange, setPriceRange] = useState("all");
  
  const { data: lessonTypes = [] } = useQuery<LessonType[]>({
    queryKey: ["/api/lesson-types"],
  });

  const { data: skillLevels = [] } = useQuery<SkillLevel[]>({
    queryKey: ["/api/skill-levels"],
  });
  
  const { data: lessons, isLoading } = useQuery<LessonWithDetails[]>({
    queryKey: [`/api/lessons/search`, locationFilter, lessonTypeId, skillLevelId],
    queryFn: async ({ queryKey }) => {
      const [_, location, typeId, levelId] = queryKey;
      const params = new URLSearchParams();
      
      if (location) params.append("location", location as string);
      if (typeId) params.append("lessonTypeId", typeId as string);
      if (levelId) params.append("skillLevelId", levelId as string);
      
      const response = await fetch(`/api/lessons/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch lessons");
      return response.json();
    }
  });
  
  // Filter lessons based on search term and price range
  const filteredLessons = lessons?.filter((lesson) => {
    // Filter by title/description
    const textMatch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by price range
    let priceMatch = true;
    if (priceRange === "under100k") {
      priceMatch = lesson.price < 100000;
    } else if (priceRange === "100k-200k") {
      priceMatch = lesson.price >= 100000 && lesson.price <= 200000;
    } else if (priceRange === "over200k") {
      priceMatch = lesson.price > 200000;
    }
    
    return textMatch && priceMatch;
  });
  
  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (locationFilter) params.append("location", locationFilter);
    if (lessonTypeId) params.append("lessonTypeId", lessonTypeId);
    if (skillLevelId) params.append("skillLevelId", skillLevelId);
    
    const newUrl = `/lessons${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [locationFilter, lessonTypeId, skillLevelId]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">축구 레슨 목록</h1>
        <p className="text-neutral-600">
          다양한 레슨 프로그램을 살펴보고 나에게 맞는 레슨을 찾아보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" /> 필터
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">레슨 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      placeholder="레슨 이름 검색"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">지역</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 지역" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">모든 지역</SelectItem>
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">레슨 유형</label>
                  <Select value={lessonTypeId} onValueChange={setLessonTypeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 레슨" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">모든 레슨</SelectItem>
                      {lessonTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">레벨</label>
                  <Select value={skillLevelId} onValueChange={setSkillLevelId}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 레벨" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">모든 레벨</SelectItem>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Accordion type="single" collapsible className="border-b-0">
                  <AccordionItem value="price" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="text-sm font-medium">가격대</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={priceRange === "all"}
                            onChange={() => setPriceRange("all")}
                          />
                          <span className="text-sm">전체</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={priceRange === "under100k"}
                            onChange={() => setPriceRange("under100k")}
                          />
                          <span className="text-sm">10만원 미만</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={priceRange === "100k-200k"}
                            onChange={() => setPriceRange("100k-200k")}
                          />
                          <span className="text-sm">10만원 - 20만원</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={priceRange === "over200k"}
                            onChange={() => setPriceRange("over200k")}
                          />
                          <span className="text-sm">20만원 이상</span>
                        </label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                      setLessonTypeId("");
                      setSkillLevelId("");
                      setPriceRange("all");
                    }}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Lesson List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <LessonSkeleton key={i} />
              ))}
            </div>
          ) : filteredLessons && filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
              <p className="text-neutral-600 mb-6">
                다른 검색어나 필터 조건으로 다시 시도해보세요.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setLessonTypeId("");
                  setSkillLevelId("");
                  setPriceRange("all");
                }}
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
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
      <div className="h-48 overflow-hidden relative">
        <img 
          src={lesson.image || "https://via.placeholder.com/400x192?text=No+Image"} 
          alt={lesson.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white font-bold text-lg line-clamp-1">{lesson.title}</span>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src={lesson.coach.user.profileImage || "https://via.placeholder.com/40x40?text=Coach"} 
              alt={lesson.coach.user.fullName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="font-medium">{lesson.coach.user.fullName} 코치</p>
            <div className="flex items-center text-xs text-[#F9A826]">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1">{rating}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-neutral-600 mb-2">
            <MapPin className="inline-block h-4 w-4 text-neutral-400 mr-1" /> {lesson.location}
          </p>
          <p className="text-sm text-neutral-600 mb-2">
            <Users className="inline-block h-4 w-4 text-neutral-400 mr-1" /> 최대 {lesson.groupSize}명 {
              lesson.groupSize <= 5 ? "소그룹" :
              lesson.groupSize <= 8 ? "그룹" : "팀"
            }
          </p>
          <p className="text-sm text-neutral-600">
            <GraduationCap className="inline-block h-4 w-4 text-neutral-400 mr-1" /> {lesson.skillLevel?.name || "모든 레벨"} 대상
          </p>
        </div>
        
        <p className="text-sm mb-4 line-clamp-2">
          {lesson.description}
        </p>
        
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            <span className="text-lg">{getPriceDisplay().split(' ')[0]}</span>
            <span className="text-sm text-neutral-500 font-normal">
              {getPriceDisplay().split(' ').slice(1).join(' ')}
            </span>
          </p>
          <Button asChild size="sm">
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
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <Skeleton className="h-16 w-full mb-4" />
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
