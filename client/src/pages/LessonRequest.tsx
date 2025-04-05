import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PROVINCES, DISTRICTS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { CoachWithUser } from "@/../../shared/schema";
import { FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function LessonRequest() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCoaches, setFilteredCoaches] = useState<CoachWithUser[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("");

  // 지역 필터링을 위한 상태
  const [showDistrictSelector, setShowDistrictSelector] = useState(false);
  const [districtsForProvince, setDistrictsForProvince] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // URL에서 age 파라미터 처리
  useEffect(() => {
    // location이 query string을 포함하는지 확인
    if (location.includes('?')) {
      const params = new URLSearchParams(location.split('?')[1]);
      const ageParam = params.get('age');
      
      if (ageParam) {
        setSelectedAge(ageParam);
      }
    }
  }, [location]);
  
  // 연령대에 따른 검색어 설정 - 별도의 useEffect로 분리
  useEffect(() => {
    if (!selectedAge) return;
    
    const ageLabels: Record<string, string> = {
      'elementary': '초등학생',
      'middle-school': '중학생',
      'high-school': '고등학생',
      'adult': '성인'
    };
    
    if (selectedAge in ageLabels && searchQuery === '') {
      setSearchQuery(ageLabels[selectedAge]);
    }
  }, [selectedAge]);

  // 코치 목록 불러오기
  const { data: coaches = [], isLoading } = useQuery<CoachWithUser[]>({
    queryKey: ["/api/coaches"],
  });

  // 선택된 지역에 따른 구/군 목록 설정
  useEffect(() => {
    if (selectedProvince && DISTRICTS[selectedProvince]) {
      setDistrictsForProvince(DISTRICTS[selectedProvince]);
      setShowDistrictSelector(true);
    } else {
      setDistrictsForProvince([]);
      setShowDistrictSelector(false);
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

    // 지역 필터링
    if (selectedProvince) {
      result = result.filter(coach => {
        const location = coach.location || "";
        return selectedDistrict
          ? location.includes(selectedProvince) && location.includes(selectedDistrict)
          : location.includes(selectedProvince);
      });
    }

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(coach => {
        const fullName = coach.user?.fullName?.toLowerCase() || "";
        const specializations = coach.specializations?.join(" ").toLowerCase() || "";
        const coachLocation = coach.location?.toLowerCase() || "";
        
        return (
          fullName.includes(query) ||
          specializations.includes(query) ||
          coachLocation.includes(query)
        );
      });
    }

    setFilteredCoaches(result);
  }, [coaches, selectedProvince, selectedDistrict, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 이미 useEffect에서 처리되고 있음
    toast({
      title: "검색 완료",
      description: `'${searchQuery}'에 대한 검색 결과입니다.`,
    });
  };

  // 페이지 타이틀 생성
  const getPageTitle = () => {
    const ageLabels: Record<string, string> = {
      'elementary': '초등학생',
      'middle-school': '중학생',
      'high-school': '고등학생',
      'adult': '성인'
    };
    
    if (selectedAge && selectedAge in ageLabels) {
      return `${ageLabels[selectedAge]} 맞춤 축구 코치`;
    }
    
    return "지역별 축구 코치 찾기";
  };
  
  // 페이지 설명 생성
  const getPageDescription = () => {
    const ageLabels: Record<string, string> = {
      'elementary': '초등학생',
      'middle-school': '중학생',
      'high-school': '고등학생',
      'adult': '성인'
    };
    
    if (selectedAge && selectedAge in ageLabels) {
      return `${ageLabels[selectedAge]}을 위한 맞춤 축구 트레이닝을 제공하는 최고의 코치를 찾아보세요. 체계적인 커리큘럼으로 실력 향상을 도와드립니다.`;
    }
    
    return "원하는 지역에서 최고의 축구 코치를 찾아보세요. 전문성과 경험을 갖춘 코치들이 여러분의 레슨을 기다리고 있습니다.";
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {getPageDescription()}
        </p>
      </div>

      {/* 검색 및 필터 섹션 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>코치 검색</CardTitle>
          <CardDescription>지역이나 키워드로 코치를 검색할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 검색창 */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="코치 이름, 전문 분야 등으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">검색</Button>
            </form>

            {/* 지역 선택 */}
            <div>
              <Label htmlFor="province">지역 선택</Label>
              <div className="mt-2 grid grid-cols-4 md:grid-cols-8 gap-2">
                {PROVINCES.map((province) => (
                  <Button
                    key={province}
                    variant={selectedProvince === province ? "default" : "outline"}
                    className="h-10 text-sm"
                    onClick={() => {
                      setSelectedProvince(selectedProvince === province ? "" : province);
                    }}
                  >
                    {province}
                  </Button>
                ))}
              </div>
            </div>

            {/* 구/군 선택 */}
            {showDistrictSelector && districtsForProvince.length > 0 && (
              <div className="mt-2">
                <Label htmlFor="district">상세 지역</Label>
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {districtsForProvince.map((district) => (
                    <Button
                      key={district}
                      variant={selectedDistrict === district ? "default" : "outline"}
                      className="h-10 text-sm"
                      onClick={() => {
                        setSelectedDistrict(selectedDistrict === district ? "" : district);
                      }}
                    >
                      {district}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {selectedProvince 
            ? `${selectedProvince} ${selectedDistrict ? selectedDistrict : ''} 지역 코치`
            : '모든 지역 코치'}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CoachSkeleton key={i} />
            ))}
          </div>
        ) : filteredCoaches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">검색 조건에 맞는 코치가 없습니다.</p>
            <p className="text-sm text-gray-400">다른 지역이나 검색어로 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* 추가 안내 */}
      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-purple-900 mb-3">원하는 코치를 찾지 못하셨나요?</h3>
        <p className="text-purple-700 mb-4">
          특정 지역이나 전문성을 가진 코치를 찾고 계시다면, 맞춤 레슨 요청을 통해 적합한 코치를 연결해 드립니다.
        </p>
        <Button asChild className="bg-purple-700 hover:bg-purple-800">
          <Link href="/lesson-request/custom">맞춤 레슨 요청하기</Link>
        </Button>
      </div>

      {/* 레슨 신청 방법 안내 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">레슨 신청 방법</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">1</div>
            <h3 className="text-lg font-bold mb-2">코치 프로필 확인</h3>
            <p className="text-gray-600">
              코치의 전문 분야, 경력, 수업 방식, 후기 등을 꼼꼼히 확인하세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">2</div>
            <h3 className="text-lg font-bold mb-2">레슨 선택 및 예약</h3>
            <p className="text-gray-600">
              원하는 코치의 레슨을 선택하고 날짜와 시간을 예약하세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">3</div>
            <h3 className="text-lg font-bold mb-2">레슨 확정 및 진행</h3>
            <p className="text-gray-600">
              코치의 확인 후 결제를 진행하고, 약속된 시간에 레슨을 진행합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: CoachWithUser }) {
  return (
    <Link href={`/coaches/${coach.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        <div className="h-48 overflow-hidden relative">
          <img
            src={coach.user?.profileImage || "https://via.placeholder.com/500x300?text=축고+코치"}
            alt={coach.user?.fullName || "코치 프로필"}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{coach.user?.fullName || "코치"}</CardTitle>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="font-medium">{coach.rating || 0}</span>
              <span className="text-gray-400 text-sm ml-1">({coach.reviewCount || 0})</span>
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
            {coach.experience || "경력 정보 없음"}
          </p>
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <div className="w-full flex justify-between items-center">
            <span className="font-bold text-purple-600">
              {coach.hourlyRate?.toLocaleString() || "가격 정보 없음"}원
              <span className="text-xs text-gray-500 font-normal"> / 시간</span>
            </span>
            <Button size="sm">자세히 보기</Button>
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