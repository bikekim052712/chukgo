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
            email: "coach_kim@example.com",
            fullName: "김축구",
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
            email: "coach_park@example.com",
            fullName: "박코치",
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
            email: "coach_lee@example.com",
            fullName: "이골키퍼",
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
          <Link href="/reviews/write">
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
          <Link href="/reviews/write">
            레슨 후기 작성하기
          </Link>
        </Button>
      </div>

      {/* 레슨 추천 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span>인기 레슨 추천</span>
          <span className="ml-2 text-sm font-normal bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
            높은 평점의 레슨
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleReviews.slice(0, 3).map(review => (
            <Card key={review.id} className="h-full">
              <div className="h-40 overflow-hidden">
                <img
                  src={review.lesson.image || "https://via.placeholder.com/300x150?text=축구+레슨"}
                  alt={review.lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{review.lesson.title}</CardTitle>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">{review.lesson.coach.rating}</span>
                  </div>
                </div>
                <CardDescription>{review.lesson.coach.user.fullName} 코치</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">
                  {review.lesson.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/lessons/${review.lesson.id}`}>
                  <Button variant="outline" size="sm">자세히 보기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}