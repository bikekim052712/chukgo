import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  MapPin,
  Search,
  Filter,
  ChevronRight,
  User as UserIcon,
  Sliders,
  Calendar,
  CheckCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoachWithUser } from "@shared/schema";
import { LOCATIONS } from "@/lib/constants";

export default function CoachList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  
  const { data: coaches, isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ['/api/coaches'],
  });
  
  // Set URL parameters from location on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationParam = params.get('location');
    
    if (locationParam) {
      setLocationFilter(locationParam);
    }
  }, []);
  
  // Filter coaches based on search term and filters
  const filteredCoaches = coaches?.filter((coach) => {
    // Filter by name
    const nameMatch = coach.user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by location
    const locationMatch = !locationFilter || locationFilter === "all_regions" || coach.location.includes(locationFilter);
    
    // Filter by specialization
    const specializationMatch = !specialization || 
      (coach.specializations && coach.specializations.some(spec => spec.includes(specialization)));
    
    // Filter by tab
    let tabMatch = true;
    if (activeTab === "youth") {
      tabMatch = coach.specializations?.includes("유소년") || false;
    } else if (activeTab === "adult") {
      tabMatch = coach.specializations?.includes("성인") || false;
    } else if (activeTab === "female") {
      tabMatch = coach.specializations?.includes("여성 특화") || false;
    } else if (activeTab === "professional") {
      tabMatch = coach.specializations?.includes("프로") || false;
    }
    
    return nameMatch && locationMatch && specializationMatch && tabMatch;
  });
  
  // Sort coaches
  const sortedCoaches = filteredCoaches ? [...filteredCoaches].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortBy === "reviews") {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    } else if (sortBy === "price_low") {
      return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    } else if (sortBy === "price_high") {
      return (b.hourlyRate || 0) - (a.hourlyRate || 0);
    }
    return 0;
  }) : [];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">축구 코치 목록</h1>
        <p className="text-neutral-600">
          다양한 전문 코치들을 만나보세요. 나에게 맞는 코치를 찾아 축구 실력을 향상시키세요.
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
                  <label className="block text-sm font-medium mb-2">코치 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      placeholder="코치 이름 검색"
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
                      <SelectItem value="all_regions">모든 지역</SelectItem>
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Accordion type="single" collapsible className="border-b-0">
                  <AccordionItem value="specialization" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="text-sm font-medium">전문 분야</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === ""}
                            onChange={() => setSpecialization("")}
                          />
                          <span className="text-sm">전체</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "개인 레슨"}
                            onChange={() => setSpecialization("개인 레슨")}
                          />
                          <span className="text-sm">개인 레슨</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "그룹 레슨"}
                            onChange={() => setSpecialization("그룹 레슨")}
                          />
                          <span className="text-sm">그룹 레슨</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "팀 코칭"}
                            onChange={() => setSpecialization("팀 코칭")}
                          />
                          <span className="text-sm">팀 코칭</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "유소년"}
                            onChange={() => setSpecialization("유소년")}
                          />
                          <span className="text-sm">유소년</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "성인"}
                            onChange={() => setSpecialization("성인")}
                          />
                          <span className="text-sm">성인</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            className="mr-2" 
                            checked={specialization === "여성 특화"}
                            onChange={() => setSpecialization("여성 특화")}
                          />
                          <span className="text-sm">여성 특화</span>
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
                      setLocationFilter("all_regions");
                      setSpecialization("");
                    }}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coach List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <CoachSkeleton key={i} />
              ))}
            </div>
          ) : filteredCoaches && filteredCoaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
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
                  setLocationFilter("all_regions");
                  setSpecialization("");
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
          <div className="flex items-center">
            <div className="flex items-center bg-blue-600 px-2 py-1 rounded">
              <span className="font-medium text-white text-xs">{rating}</span>
              <div className="w-10 h-1 ml-1 rounded-full overflow-hidden bg-blue-800">
                <div className="bg-white h-full" style={{width: `${(parseFloat(rating) / 5) * 100}%`}}></div>
              </div>
            </div>
            <span className="text-neutral-500 text-xs ml-1">({coach.reviewCount || 0})</span>
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
