import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsertReview, LessonWithDetails } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// 리뷰 작성 스키마
const reviewFormSchema = z.object({
  lessonId: z.number().int().positive(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "최소 10자 이상 작성해주세요").max(1000, "최대 1000자까지 작성 가능합니다"),
  tags: z.array(z.string()).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ReviewWrite() {
  const { id } = useParams<{ id?: string }>(); // 레슨 ID (URL 파라미터)
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 별점 선택 상태
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // 레슨 데이터 가져오기
  const { data: lesson, isLoading: isLessonLoading } = useQuery<LessonWithDetails>({
    queryKey: [`/api/lessons/${id}`],
    enabled: !!id,
  });

  // 모든 레슨 데이터 가져오기 (id가 없을 때 선택용)
  const { data: lessons, isLoading: isLessonsLoading } = useQuery<LessonWithDetails[]>({
    queryKey: ['/api/lessons'],
    enabled: !id, // id가 없을 때만 모든 레슨 가져오기
  });

  // 태그 입력 관련 상태
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 폼 설정
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      lessonId: id ? parseInt(id) : 0,
      rating: 5,
      comment: "",
      tags: [],
    },
  });

  // 리뷰 등록 mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      const response = await apiRequest("POST", "/api/reviews", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "후기가 등록되었습니다",
        description: "소중한 의견을 공유해주셔서 감사합니다",
      });
      
      // 캐시 무효화 및 이동
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${id}`] });
      navigate("/reviews");
    },
    onError: (error: Error) => {
      toast({
        title: "후기 등록 실패",
        description: error.message || "후기를 등록하는 중 오류가 발생했습니다",
        variant: "destructive",
      });
    },
  });

  // 폼 제출 처리
  const onSubmit = (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "후기를 작성하려면 로그인이 필요합니다",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.lessonId || values.lessonId <= 0) {
      toast({
        title: "레슨을 선택해주세요",
        description: "후기를 작성할 레슨을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    const reviewData: InsertReview = {
      userId: user.id,
      lessonId: values.lessonId,
      rating: values.rating,
      comment: values.comment,
      tags: selectedTags,
    };

    reviewMutation.mutate(reviewData);
  };

  // 태그 추가 처리
  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // 태그 제거 처리
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">레슨 후기 작성</h1>
          <p className="text-gray-600">
            경험하신 레슨에 대한 솔직한 후기를 작성해주세요. 다른 회원들에게 큰 도움이 됩니다.
          </p>
        </div>

        {isLessonLoading ? (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ) : lesson ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 레슨 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle>레슨 정보</CardTitle>
                  <CardDescription>리뷰를 작성할 레슨 정보입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={lesson.image || "https://via.placeholder.com/100x100?text=레슨+이미지"} 
                        alt={lesson.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">{lesson.coach?.user?.fullName} 코치</p>
                      <p className="text-sm text-gray-700">{lesson.location}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date().toLocaleDateString('ko-KR')} 수강
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 별점 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle>레슨은 어땠나요?</CardTitle>
                  <CardDescription>전반적인 만족도를 평가해주세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>평점</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <FaStar
                                  key={rating}
                                  className={`h-8 w-8 cursor-pointer ${
                                    rating <= (hoveredRating || field.value)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() => {
                                    setSelectedRating(rating);
                                    field.onChange(rating);
                                  }}
                                  onMouseEnter={() => setHoveredRating(rating)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-lg font-bold">{field.value}</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          {field.value === 5 && "최고예요! 매우 만족했어요"}
                          {field.value === 4 && "좋았어요! 대체로 만족했어요"}
                          {field.value === 3 && "보통이에요"}
                          {field.value === 2 && "아쉬워요"}
                          {field.value === 1 && "많이 불만족스러웠어요"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 후기 내용 */}
              <Card>
                <CardHeader>
                  <CardTitle>후기 작성</CardTitle>
                  <CardDescription>레슨에 대한 솔직한 의견을 자유롭게 작성해주세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>후기 내용</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="레슨의 좋았던 점, 아쉬웠던 점 등 솔직한 후기를 작성해주세요. (최소 10자)"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          다른 사용자들에게 도움이 될 수 있는 구체적인 의견을 남겨주세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 태그 입력 */}
              <Card>
                <CardHeader>
                  <CardTitle>태그 추가 (선택사항)</CardTitle>
                  <CardDescription>레슨을 표현할 수 있는 키워드를 추가해주세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag) => (
                      <div 
                        key={tag} 
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button 
                          type="button"
                          onClick={() => handleRemoveTag(tag)} 
                          className="ml-2 text-purple-800 hover:text-purple-900"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="태그 입력 후 추가 버튼 클릭"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      추가
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">예: 친절한코치, 커리큘럼좋음, 체계적 등</p>
                </CardFooter>
              </Card>

              {/* 제출 버튼 */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate("/reviews")}>
                  취소
                </Button>
                <Button type="submit" disabled={reviewMutation.isPending}>
                  {reviewMutation.isPending ? "제출 중..." : "후기 등록하기"}
                </Button>
              </div>
            </form>
          </Form>
        ) : isLessonsLoading ? (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ) : lessons && lessons.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>후기를 작성할 레슨 선택</CardTitle>
              <CardDescription>후기를 작성하고 싶은 레슨을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lessons.map((lessonItem) => (
                    <Card 
                      key={lessonItem.id} 
                      className="cursor-pointer hover:border-purple-400 transition-all"
                      onClick={() => navigate(`/reviews/write/${lessonItem.id}`)}
                    >
                      <CardContent className="p-4 flex gap-3 items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={lessonItem.image || "https://via.placeholder.com/64x64?text=레슨"} 
                            alt={lessonItem.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{lessonItem.title}</h3>
                          <p className="text-sm text-gray-500">{lessonItem.coach?.user?.fullName} 코치</p>
                          <p className="text-xs text-gray-400">{lessonItem.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => navigate("/reviews")} variant="outline">
                    후기 목록으로 돌아가기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>레슨 정보를 찾을 수 없습니다</CardTitle>
            </CardHeader>
            <CardContent>
              <p>존재하지 않는 레슨이거나 접근 권한이 없습니다.</p>
              <Button onClick={() => navigate("/reviews")} className="mt-4">
                후기 목록으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}