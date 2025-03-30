import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PROVINCES, DISTRICTS, SPECIALIZATIONS } from "../lib/constants";
import { CoachWithUser } from "@/../../shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FaStar, FaMapMarkerAlt, FaSearch, FaFilter, FaAward, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function CoachFinder() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [districtsForProvince, setDistrictsForProvince] = useState<string[]>([]);
  const [minRate, setMinRate] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(200000);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [filteredCoaches, setFilteredCoaches] = useState<CoachWithUser[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [maxResults, setMaxResults] = useState<number>(12);
  const [showMore, setShowMore] = useState<boolean>(false);

  // API에서 코치 목록 불러오기
  const { data: coaches = [], isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ["/api/coaches"],
  });

  // 선택된 지역에 따른 구/군 목록 설정
  useEffect(() => {
    if (selectedProvince && DISTRICTS[selectedProvince]) {
      setDistrictsForProvince(DISTRICTS[selectedProvince]);
    } else {
      setDistrictsForProvince([]);
    }
    setSelectedDistrict("");
  }, [selectedProvince]);

  // 검색 및 필터링 적용
  useEffect(() => {
    if (!coaches || coaches.length === 0) {
      setFilteredCoaches([]);
      return;
    }

    let result = [...coaches];

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(coach => {
        const fullName = coach.user?.fullName?.toLowerCase() || "";
        const specializations = coach.specializations?.join(" ").toLowerCase() || "";
        const coachLocation = coach.location?.toLowerCase() || "";
        const bio = coach.user?.bio?.toLowerCase() || "";
        const certifications = coach.certifications?.toLowerCase() || "";
        
        return (
          fullName.includes(query) ||
          specializations.includes(query) ||
          coachLocation.includes(query) ||
          bio.includes(query) ||
          certifications.includes(query)
        );
      });
    }

    // 지역 필터링
    if (selectedProvince) {
      result = result.filter(coach => {
        const location = coach.location || "";
        return selectedDistrict
          ? location.includes(selectedProvince) && location.includes(selectedDistrict)
          : location.includes(selectedProvince);
      });
    }

    // 가격 범위 필터링
    result = result.filter(coach => {
      const rate = coach.hourlyRate || 0;
      return rate >= minRate && rate <= maxRate;
    });

    // 전문 분야 필터링
    if (selectedSpecializations.length > 0) {
      result = result.filter(coach => {
        const specs = coach.specializations || [];
        return selectedSpecializations.some(spec => specs.includes(spec));
      });
    }

    // 최소 평점 필터링
    if (minRating > 0) {
      result = result.filter(coach => (coach.rating || 0) >= minRating);
    }

    // 정렬
    result = sortCoaches(result, sortBy);

    setFilteredCoaches(result);
  }, [
    coaches,
    searchQuery,
    selectedProvince,
    selectedDistrict,
    minRate,
    maxRate,
    selectedSpecializations,
    minRating,
    sortBy
  ]);

  // 정렬 함수
  const sortCoaches = (coachesList: CoachWithUser[], sortCriteria: string) => {
    return [...coachesList].sort((a, b) => {
      switch (sortCriteria) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case "price_low":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "price_high":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSpecializationToggle = (specialization: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setMinRate(0);
    setMaxRate(200000);
    setSelectedSpecializations([]);
    setMinRating(0);
    setSortBy("rating");
  };

  const handleShowMore = () => {
    setMaxResults(prev => prev + 12);
    setShowMore(filteredCoaches.length > maxResults + 12);
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">축구 코치 찾기</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          다양한 전문성과 경험을 갖춘 축구 코치들을 검색하고 비교해보세요. 
          상세한 필터링으로 나에게 딱 맞는 코치를 찾을 수 있습니다.
        </p>
      </div>

      {/* 검색 및 필터링 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        {/* 좌측 필터 패널 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <FaFilter className="mr-2" />
                필터 옵션
              </CardTitle>
              <CardDescription>
                원하는 조건으로 코치를 검색하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 검색 창 */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="코치 이름, 전문 분야 등"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* 지역 선택 */}
              <div className="space-y-2">
                <Label htmlFor="province">지역</Label>
                <Select 
                  value={selectedProvince} 
                  onValueChange={setSelectedProvince}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {PROVINCES.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {districtsForProvince.length > 0 && (
                  <div className="mt-2">
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={setSelectedDistrict}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="세부 지역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 {selectedProvince}</SelectItem>
                        {districtsForProvince.map(district => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* 가격 범위 */}
              <div className="space-y-2">
                <Label>시간당 레슨 비용</Label>
                <div className="pt-5 px-2">
                  <Slider
                    defaultValue={[maxRate]}
                    max={200000}
                    step={10000}
                    onValueChange={(value) => setMaxRate(value[0])}
                  />
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>최대 {maxRate.toLocaleString()}원</span>
                </div>
              </div>

              {/* 최소 평점 */}
              <div className="space-y-2">
                <Label>최소 평점</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating >= rating ? "default" : "outline"}
                      size="sm"
                      className="flex items-center"
                      onClick={() => setMinRating(rating)}
                    >
                      <FaStar className={minRating >= rating ? "text-yellow-300" : "text-gray-300"} />
                      <span className="ml-1">{rating}+</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* 전문 분야 */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specialization">
                  <AccordionTrigger className="text-base">전문 분야</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {SPECIALIZATIONS.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spec-${spec}`}
                            checked={selectedSpecializations.includes(spec)}
                            onCheckedChange={() => handleSpecializationToggle(spec)}
                          />
                          <label
                            htmlFor={`spec-${spec}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {spec}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* 정렬 옵션 */}
              <div className="space-y-2">
                <Label>정렬</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="정렬 방식" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">평점 높은 순</SelectItem>
                    <SelectItem value="reviews">리뷰 많은 순</SelectItem>
                    <SelectItem value="price_low">가격 낮은 순</SelectItem>
                    <SelectItem value="price_high">가격 높은 순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 필터 초기화 버튼 */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleReset}
              >
                필터 초기화
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 우측 코치 목록 */}
        <div className="lg:col-span-3">
          {/* 검색 결과 정보 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {filteredCoaches.length}명의 코치
              </h2>
              <p className="text-sm text-gray-500">
                {selectedProvince ? (selectedDistrict ? `${selectedProvince} ${selectedDistrict}` : selectedProvince) : '전국'} 지역의 코치들
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedSpecializations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSpecializations.map((spec) => (
                    <Badge key={spec} variant="outline" className="font-normal">
                      {spec}
                      <button 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleSpecializationToggle(spec)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 코치 목록 */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CoachSkeleton key={i} />
              ))}
            </div>
          ) : filteredCoaches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.slice(0, maxResults).map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
              {filteredCoaches.length > maxResults && (
                <div className="mt-8 text-center">
                  <Button onClick={handleShowMore} variant="outline" size="lg">
                    더 많은 코치 보기 ({filteredCoaches.length - maxResults}명 더)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-lg">
              <div className="max-w-md mx-auto">
                <FaSearch className="mx-auto text-gray-300 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 mb-6">
                  검색 조건을 변경하거나 필터를 조정해 보세요. 더 많은 결과를 볼 수 있습니다.
                </p>
                <Button onClick={handleReset}>필터 초기화</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 코치 카테고리 섹션 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">코치 카테고리</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "유소년 전문 코치", icon: <FaAward />, color: "bg-blue-100", textColor: "text-blue-800" },
            { title: "성인 축구 코치", icon: <FaAward />, color: "bg-green-100", textColor: "text-green-800" },
            { title: "골키퍼 전문 코치", icon: <FaAward />, color: "bg-purple-100", textColor: "text-purple-800" },
            { title: "피지컬 전문 코치", icon: <FaAward />, color: "bg-red-100", textColor: "text-red-800" },
            { title: "테크닉 전문 코치", icon: <FaAward />, color: "bg-amber-100", textColor: "text-amber-800" },
            { title: "전술 전문 코치", icon: <FaAward />, color: "bg-indigo-100", textColor: "text-indigo-800" },
          ].map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className={`py-8 h-auto text-base justify-start pl-6 border-2 ${category.color} ${category.textColor} hover:opacity-80`}
            >
              <span className="mr-4 text-xl">{category.icon}</span>
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {/* 자주 묻는 질문 */}
      <div className="bg-gray-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>코치의 자격 요건은 어떻게 확인하나요?</AccordionTrigger>
            <AccordionContent>
              축고의 모든 코치는 기본적인 코칭 자격증을 보유하고 있으며, 코치 프로필에서 자격증과 경력을 확인할 수 있습니다. 또한 각 코치는 신원 확인 절차를 거쳤습니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>레슨 비용은 어떻게 지불하나요?</AccordionTrigger>
            <AccordionContent>
              레슨 예약 후 축고 플랫폼을 통해 안전하게 결제할 수 있습니다. 레슨이 완료된 후에만 코치에게 비용이 전달되므로 안전하게 이용할 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>레슨 시간과 장소는 어떻게 정하나요?</AccordionTrigger>
            <AccordionContent>
              코치와 직접 상담 후 상호 협의된 시간과 장소에서 레슨이 진행됩니다. 일부 코치는 자체 훈련장을 보유하고 있으며, 그렇지 않은 경우 지역 내 공용 시설을 이용할 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>레슨을 취소하고 싶으면 어떻게 하나요?</AccordionTrigger>
            <AccordionContent>
              레슨 시작 24시간 전까지 취소 시 100% 환불이 가능합니다. 24시간 이내 취소 시에는 코치의 취소 정책에 따라 환불 금액이 결정됩니다.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: CoachWithUser }) {
  // 코치 경력 텍스트 최대 길이 제한
  const truncateExperience = (experience: string | undefined, maxLength: number = 80) => {
    if (!experience) return "경력 정보 없음";
    return experience.length > maxLength
      ? `${experience.substring(0, maxLength)}...`
      : experience;
  };

  return (
    <Link href={`/coaches/${coach.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coach.user?.profileImage || "https://via.placeholder.com/500x300?text=축고+코치"}
            alt={coach.user?.fullName || "코치 프로필"}
            className="w-full h-full object-cover"
          />
          {coach.certifications && (
            <div className="absolute bottom-2 left-2 bg-purple-700 text-white text-xs px-2 py-1 rounded-full">
              <FaAward className="inline mr-1" />
              자격증 보유
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{coach.user?.fullName || "코치"}</CardTitle>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="font-medium">{coach.rating || "신규"}</span>
              {coach.reviewCount ? (
                <span className="text-gray-400 text-sm ml-1">({coach.reviewCount})</span>
              ) : null}
            </div>
          </div>
          <CardDescription className="flex items-center">
            <FaMapMarkerAlt className="text-gray-400 mr-1" />
            {coach.location || "위치 정보 없음"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {(coach.specializations || []).slice(0, 3).map((spec: string, index: number) => (
              <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {spec}
              </span>
            ))}
            {(coach.specializations || []).length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                +{(coach.specializations || []).length - 3}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 h-10">
            {truncateExperience(coach.experience)}
          </p>
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <div className="w-full flex justify-between items-center">
            <span className="font-bold text-purple-600">
              {coach.hourlyRate?.toLocaleString() || "가격 정보 없음"}원
              <span className="text-xs text-gray-500 font-normal"> / 시간</span>
            </span>
            <Button size="sm">프로필 보기</Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function CoachSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="flex gap-1 mb-2">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="w-full flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-9 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}