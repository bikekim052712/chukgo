import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FaStar, FaStarHalfAlt, FaRegStar, FaSearch, FaFilter } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Review, LessonWithDetails } from "@/../../shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 리뷰에 포함될 추가 정보 타입
type ReviewWithDetails = Review & {
  user: { fullName: string; profileImage?: string };
  lesson: LessonWithDetails;
};

// 별점 표시 컴포넌트
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
      ))}
    </div>
  );
}

// 리뷰 카드 컴포넌트
function ReviewCard({ review }: { review: ReviewWithDetails }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <img
                src={review.user.profileImage || "https://via.placeholder.com/40x40?text=User"}
                alt={review.user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-base">{review.user.fullName}</CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ko })}
              </CardDescription>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4">{review.comment}</p>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src={review.lesson.coach.user.profileImage || "https://via.placeholder.com/32x32?text=Coach"}
                alt={review.lesson.coach.user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{review.lesson.coach.user.fullName} 코치</p>
              <p className="text-xs text-gray-500">{review.lesson.title}</p>
            </div>
          </div>
          <Link href={`/lessons/${review.lesson.id}`} className="text-xs text-blue-600 hover:underline">
            레슨 상세 보기
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// 리뷰 스켈레톤 컴포넌트
function ReviewSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-12 mt-1 animate-pulse" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-16 bg-gray-200 rounded w-full animate-pulse mb-4" />
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-32 mt-1 animate-pulse" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // 리뷰 데이터 가져오기
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/reviews"],
    enabled: false, // 실제 API 연결 시 true로 변경
  });

  // 샘플 리뷰 데이터 (실제 API 연결 시 제거)
  const sampleReviews: ReviewWithDetails[] = [
    {
      id: 1,
      userId: 2,
      lessonId: 1,
      rating: 5,
      comment: "정말 훌륭한 코치입니다. 체계적인 교육과 친절한 설명으로 축구 실력이 빠르게 향상되었어요. 특히 개인별 피드백이 정확하고 도움이 많이 되었습니다.",
      createdAt: new Date(2023, 2, 15),
      user: {
        fullName: "김영수",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      lesson: {
        id: 1,
        coachId: 1,
        title: "1:1 개인 기술 레슨",
        description: "개인 맞춤형 축구 기술 향상 프로그램",
        lessonTypeId: 1,
        skillLevelId: 2,
        location: "서울 강남구",
        groupSize: 1,
        duration: 60,
        price: 80000,
        image: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed",
        tags: ["개인레슨", "패스", "드리블"],
        coach: {
          id: 1,
          userId: 1,
          specializations: ["개인 레슨", "드리블 향상"],
          experience: "7년",
          certifications: "AFC C급 라이센스",
          location: "서울 강남구",
          hourlyRate: 80000,
          rating: 4.9,
          reviewCount: 42,
          user: {
            id: 1,
            username: "coach_kim",
            password: "hashedpassword",
            email: "coach_kim@example.com",
            fullName: "김축구",
            phone: "010-1234-5678",
            profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
            bio: "프로 경력 10년, 유소년 코칭 7년 경력",
            isCoach: true,
          }
        },
        lessonType: {
          id: 1,
          name: "개인 레슨",
          description: "1:1 맞춤형 레슨",
        },
        skillLevel: {
          id: 2,
          name: "중급",
          description: "기본기가 있는 수준",
        },
      },
    },
    {
      id: 2,
      userId: 3,
      lessonId: 2,
      rating: 4.5,
      comment: "아이가 축구를 재미있게 배울 수 있는 환경을 만들어 주셔서 감사합니다. 그룹 레슨이지만 개인적인 관심도 충분히 주셔서 좋았어요. 다음 학기에도 계속 배우고 싶어합니다.",
      createdAt: new Date(2023, 1, 28),
      user: {
        fullName: "박지은",
        profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      lesson: {
        id: 2,
        coachId: 2,
        title: "유소년 축구 교실",
        description: "어린이를 위한 재미있는 축구 레슨",
        lessonTypeId: 2,
        skillLevelId: 1,
        location: "서울 송파구",
        groupSize: 8,
        duration: 90,
        price: 40000,
        image: "https://images.unsplash.com/photo-1596467745552-53686335350d",
        tags: ["유소년", "그룹레슨", "초보자"],
        coach: {
          id: 2,
          userId: 3,
          specializations: ["유소년 코칭", "기초 훈련"],
          experience: "5년",
          certifications: "유소년 축구 지도자 자격증",
          location: "서울 송파구",
          hourlyRate: 60000,
          rating: 4.8,
          reviewCount: 35,
          user: {
            id: 3,
            username: "coach_park",
            password: "hashedpassword",
            email: "coach_park@example.com",
            fullName: "박코치",
            phone: "010-9876-5432",
            profileImage: "https://randomuser.me/api/portraits/women/36.jpg",
            bio: "유소년 전문 코치, 아이들의 잠재력을 이끌어냅니다",
            isCoach: true,
          }
        },
        lessonType: {
          id: 2,
          name: "그룹 레슨",
          description: "소규모 그룹 레슨",
        },
        skillLevel: {
          id: 1,
          name: "입문",
          description: "처음 시작하는 수준",
        },
      },
    },
    {
      id: 3,
      userId: 4,
      lessonId: 3,
      rating: 4,
      comment: "골키퍼 전문 레슨을 찾기 어려웠는데 정말 만족스러웠습니다. 특히 포지셔닝과 세이브 테크닉에 대한 설명이 명확해서 큰 도움이 되었어요. 다만 장소가 조금 멀어서 아쉬웠습니다.",
      createdAt: new Date(2023, 3, 10),
      user: {
        fullName: "이준호",
        profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
      },
      lesson: {
        id: 3,
        coachId: 3,
        title: "골키퍼 전문 트레이닝",
        description: "골키퍼 포지션을 위한 특화 훈련",
        lessonTypeId: 3,
        skillLevelId: 3,
        location: "경기도 고양시",
        groupSize: 4,
        duration: 120,
        price: 70000,
        image: "https://images.unsplash.com/photo-1578355283248-ad8c9f554987",
        tags: ["골키퍼", "수비", "반사신경"],
        coach: {
          id: 3,
          userId: 5,
          specializations: ["골키퍼 트레이닝", "반사신경 향상"],
          experience: "8년",
          certifications: "전문 골키퍼 코치 자격증",
          location: "경기도 고양시",
          hourlyRate: 70000,
          rating: 4.7,
          reviewCount: 28,
          user: {
            id: 5,
            username: "coach_lee",
            password: "hashedpassword",
            email: "coach_lee@example.com",
            fullName: "이골키퍼",
            phone: "010-5555-4444",
            profileImage: "https://randomuser.me/api/portraits/men/15.jpg",
            bio: "프로팀 골키퍼 출신, 골키퍼 전문 코치",
            isCoach: true,
          }
        },
        lessonType: {
          id: 3,
          name: "포지션 전문",
          description: "특정 포지션에 특화된 레슨",
        },
        skillLevel: {
          id: 3,
          name: "고급",
          description: "심화 기술을 배우는 수준",
        },
      },
    },
  ];

  // 검색 및 필터링 로직
  const filteredReviews = sampleReviews
    .filter(review => {
      const comment = review.comment || "";
      const searchInReview = 
        comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.lesson.coach.user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = ratingFilter && ratingFilter !== "all" 
        ? review.rating >= parseInt(ratingFilter) 
        : true;
      
      let matchesCategory = true;
      if (categoryFilter && categoryFilter !== "all") {
        // 카테고리별 필터링 로직
        const lessonTags = review.lesson.tags || [];
        const lessonType = review.lesson.lessonType?.name || "";
        
        switch (categoryFilter) {
          case "개인레슨":
            matchesCategory = lessonTags.includes("개인레슨") || 
                              lessonType === "개인 레슨" || 
                              lessonType === "개인레슨";
            break;
          case "그룹레슨":
            matchesCategory = lessonTags.includes("그룹레슨") || 
                              lessonType === "그룹 레슨" || 
                              lessonType === "그룹레슨";
            break;
          case "골키퍼레슨":
            matchesCategory = lessonTags.includes("골키퍼레슨") || 
                              lessonTags.includes("골키퍼") ||
                              lessonType === "골키퍼레슨";
            break;
          case "달리기레슨":
            matchesCategory = lessonTags.includes("달리기레슨") || 
                              lessonTags.includes("달리기") ||
                              lessonType === "달리기레슨";
            break;
          case "피지컬레슨":
            matchesCategory = lessonTags.includes("피지컬레슨") || 
                              lessonTags.includes("피지컬") ||
                              lessonType === "피지컬레슨";
            break;
          case "기타":
            const mainCategories = [
              "개인레슨", "개인 레슨", 
              "그룹레슨", "그룹 레슨", 
              "골키퍼레슨", "골키퍼", 
              "달리기레슨", "달리기", 
              "피지컬레슨", "피지컬"
            ];
            matchesCategory = !mainCategories.some(cat => 
              lessonTags.includes(cat) || lessonType === cat
            );
            break;
          default:
            matchesCategory = lessonTags.includes(categoryFilter) || lessonType === categoryFilter;
        }
      }
      
      return searchInReview && matchesRating && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "rating_high") {
        return b.rating - a.rating;
      } else if (sortBy === "rating_low") {
        return a.rating - b.rating;
      }
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">레슨 후기</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            축고 회원들의 생생한 레슨 후기를 확인해보세요. 실제 경험자들의 이야기가 여러분의 선택에 도움이 될 것입니다.
          </p>
        </div>
        <Button asChild className="px-6">
          <Link to="/reviews/write">
            후기 작성하기
          </Link>
        </Button>
      </div>

      {/* 검색 및 필터 섹션 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>후기 검색</CardTitle>
          <CardDescription>원하는 키워드나 조건으로 후기를 검색할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="코치 이름, 레슨명, 후기 내용 등으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">검색</Button>
            </form>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">평점 필터</label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="평점 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 평점</SelectItem>
                    <SelectItem value="5">5점</SelectItem>
                    <SelectItem value="4">4점 이상</SelectItem>
                    <SelectItem value="3">3점 이상</SelectItem>
                    <SelectItem value="2">2점 이상</SelectItem>
                    <SelectItem value="1">1점 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">카테고리 필터</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    <SelectItem value="개인레슨">개인레슨</SelectItem>
                    <SelectItem value="그룹레슨">그룹레슨</SelectItem>
                    <SelectItem value="골키퍼레슨">골키퍼레슨</SelectItem>
                    <SelectItem value="달리기레슨">달리기레슨</SelectItem>
                    <SelectItem value="피지컬레슨">피지컬레슨</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">정렬 방식</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 방식 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">최신순</SelectItem>
                    <SelectItem value="rating_high">평점 높은순</SelectItem>
                    <SelectItem value="rating_low">평점 낮은순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">전체 후기</TabsTrigger>
          <TabsTrigger value="개인레슨">개인레슨</TabsTrigger>
          <TabsTrigger value="그룹레슨">그룹레슨</TabsTrigger>
          <TabsTrigger value="골키퍼레슨">골키퍼레슨</TabsTrigger>
          <TabsTrigger value="달리기레슨">달리기레슨</TabsTrigger>
          <TabsTrigger value="피지컬레슨">피지컬레슨</TabsTrigger>
          <TabsTrigger value="기타">기타</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-6">
          {/* 리뷰 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => <ReviewSkeleton key={i} />)
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">검색 조건에 맞는 후기가 없습니다.</p>
                <p className="text-sm text-gray-400">다른 검색어나 필터로 시도해보세요.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="개인레슨" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => 
                review.lesson.tags?.includes("개인레슨") || 
                review.lesson.lessonType?.name === "개인 레슨" || 
                review.lesson.lessonType?.name === "개인레슨")
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="그룹레슨" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => 
                review.lesson.tags?.includes("그룹레슨") || 
                review.lesson.lessonType?.name === "그룹 레슨" || 
                review.lesson.lessonType?.name === "그룹레슨")
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="골키퍼레슨" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => 
                review.lesson.tags?.includes("골키퍼레슨") || 
                review.lesson.tags?.includes("골키퍼") ||
                review.lesson.lessonType?.name === "골키퍼레슨")
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="달리기레슨" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => 
                review.lesson.tags?.includes("달리기레슨") || 
                review.lesson.tags?.includes("달리기") ||
                review.lesson.lessonType?.name === "달리기레슨")
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="피지컬레슨" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => 
                review.lesson.tags?.includes("피지컬레슨") || 
                review.lesson.tags?.includes("피지컬") ||
                review.lesson.lessonType?.name === "피지컬레슨")
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="기타" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews
              .filter(review => {
                // 다른 카테고리에 속하지 않는 리뷰들
                const mainCategories = [
                  "개인레슨", "개인 레슨", 
                  "그룹레슨", "그룹 레슨", 
                  "골키퍼레슨", "골키퍼", 
                  "달리기레슨", "달리기", 
                  "피지컬레슨", "피지컬"
                ];
                const reviewTags = review.lesson.tags || [];
                const lessonType = review.lesson.lessonType?.name || "";
                
                // 어떤 메인 카테고리에도 속하지 않으면 기타로 분류
                return !mainCategories.some(cat => 
                  reviewTags.includes(cat) || lessonType === cat
                );
              })
              .map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 리뷰 작성 안내 */}
      <div className="bg-purple-50 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-bold text-purple-900 mb-3">축고 레슨 경험을 공유해주세요!</h3>
        <p className="text-purple-700 mb-4">
          레슨을 받은 경험이 있다면, 솔직한 후기를 남겨 다른 사용자들에게 도움을 주세요.
          여러분의 소중한 의견이 더 나은 축구 교육 환경을 만듭니다.
        </p>
        <Button asChild className="bg-purple-700 hover:bg-purple-800">
          <Link to="/reviews/write">
            레슨 후기 작성하기
          </Link>
        </Button>
      </div>

      {/* 레슨 추천 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">카테고리별 인기 레슨</h2>
        <Tabs defaultValue="개인레슨" className="mb-8">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="개인레슨">개인레슨</TabsTrigger>
            <TabsTrigger value="그룹레슨">그룹레슨</TabsTrigger>
            <TabsTrigger value="골키퍼레슨">골키퍼레슨</TabsTrigger>
            <TabsTrigger value="달리기레슨">달리기레슨</TabsTrigger>
            <TabsTrigger value="피지컬레슨">피지컬레슨</TabsTrigger>
          </TabsList>
          
          {/* 개인레슨 */}
          <TabsContent value="개인레슨">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1531415074968-036ba1b575da"
                    alt="1:1 기술 향상 프로그램"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">1:1 기술 향상 프로그램</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                  <CardDescription>김축구 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    개인별 맞춤형 훈련으로 드리블, 패스, 슈팅 등 기본 기술을 향상시킬 수 있는 1:1 레슨입니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/1">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e"
                    alt="축구 기초 마스터 코스"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">축구 기초 마스터 코스</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.7</span>
                    </div>
                  </div>
                  <CardDescription>박코치 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    축구를 처음 시작하는 분들을 위한 기초 기술 훈련 코스입니다. 8주 과정으로 기본기를 튼튼히 다집니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/5">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517466787929-bc90951d0974"
                    alt="중급자를 위한 전술 이해 레슨"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">중급자를 위한 전술 이해 레슨</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <CardDescription>이전문 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    기본기가 갖추어진 중급자들을 위한 전술 이해 및 응용 레슨입니다. 포메이션과 전술 이해에 초점을.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/8">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* 그룹레슨 */}
          <TabsContent value="그룹레슨">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1596467745552-53686335350d"
                    alt="유소년 축구 교실"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">유소년 축구 교실</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <CardDescription>박코치 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    어린이들에게 축구의 기본 규칙과 기술을 가르치는 재미있는 그룹 레슨입니다. 8명까지 참가 가능합니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/2">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e"
                    alt="주말 축구 클럽"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">주말 축구 클럽</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.6</span>
                    </div>
                  </div>
                  <CardDescription>김축구 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    주말에만 만나서 즐기는 축구 클럽입니다. 팀 플레이와 게임 위주로 진행되며 15명까지 참가 가능합니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/9">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
                    alt="여성 축구 클래스"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">여성 축구 클래스</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                  <CardDescription>박코치 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    여성만을 위한 축구 클래스입니다. 서로 응원하고 배우는 즐거운 환경에서 축구의 기초부터 시작합니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/11">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* 골키퍼레슨 */}
          <TabsContent value="골키퍼레슨">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1578355283248-ad8c9f554987"
                    alt="골키퍼 전문 트레이닝"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">골키퍼 전문 트레이닝</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.7</span>
                    </div>
                  </div>
                  <CardDescription>이골키퍼 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    골키퍼를 위한 전문 훈련 프로그램입니다. 포지셔닝, 반사신경, 핸들링 등 골키퍼만의 특화 기술을 배웁니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/3">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1628891890467-b79f2c8ba7fa"
                    alt="주니어 골키퍼 클래스"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">주니어 골키퍼 클래스</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.5</span>
                    </div>
                  </div>
                  <CardDescription>이골키퍼 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    어린 골키퍼를 위한 기초 훈련 클래스입니다. 안전하고 즐거운 환경에서 골키퍼의 기본 자세와 기술을 배웁니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/12">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1626248801379-51a0748e0deb"
                    alt="골킥과 패스 마스터하기"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">골킥과 패스 마스터하기</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.6</span>
                    </div>
                  </div>
                  <CardDescription>이골키퍼 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    현대 축구에서 중요해진 골키퍼의 발기술을 향상시키는 특화 레슨입니다. 정확한 골킥과 다양한 패스 기술을 익힙니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/13">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* 달리기레슨 */}
          <TabsContent value="달리기레슨">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5"
                    alt="축구 선수를 위한 스피드 훈련"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">축구 선수를 위한 스피드 훈련</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.7</span>
                    </div>
                  </div>
                  <CardDescription>정달리기 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    가속력과 최고 속도를 향상시키는 축구 선수 맞춤형 스피드 훈련입니다. 경기에서 실제로 필요한 주행 패턴을 연습합니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/4">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1533107862482-0e6974b06ec4"
                    alt="지구력 향상 훈련"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">지구력 향상 훈련</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.5</span>
                    </div>
                  </div>
                  <CardDescription>정달리기 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    90분 내내 최상의 컨디션을 유지하기 위한 지구력 훈련 프로그램입니다. 효율적인 러닝 기술도 함께 배웁니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/14">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b"
                    alt="민첩성과 방향 전환 훈련"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">민첩성과 방향 전환 훈련</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <CardDescription>정달리기 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    빠른 방향 전환과 민첩성을 향상시키는 특화 훈련입니다. 경기 상황에 맞는 다양한 움직임과 변화를 익힙니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/15">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* 피지컬레슨 */}
          <TabsContent value="피지컬레슨">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd"
                    alt="축구 선수를 위한 체력 강화 프로그램"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">축구 선수를 위한 체력 강화 프로그램</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <CardDescription>김피지컬 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    축구에 필요한 근력, 파워, 지구력을 종합적으로 강화하는 피지컬 트레이닝 프로그램입니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/6">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
                    alt="코어 강화 트레이닝"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">코어 강화 트레이닝</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                  <CardDescription>김피지컬 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    축구 선수의 기본이 되는 코어 근육을 강화하는 특화 트레이닝입니다. 부상 방지와 경기력 향상에 도움을 줍니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/16">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <div className="h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
                    alt="축구 특화 유연성 훈련"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">축구 특화 유연성 훈련</CardTitle>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.7</span>
                    </div>
                  </div>
                  <CardDescription>김피지컬 코치</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">
                    축구 동작에 필요한 관절 가동 범위를 넓히고 부상을 방지하는 스트레칭과 유연성 훈련을 배웁니다.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to="/lessons/17">
                    <Button variant="outline" size="sm">자세히 보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}