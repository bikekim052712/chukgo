import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Eye, MessageSquare, ThumbsUp, Clock, FileText, PenSquare } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link, useParams } from "wouter";

// 글 작성 스키마 정의
const insurancePostSchema = z.object({
  title: z.string().min(2, "제목은 2자 이상이어야 합니다.").max(100, "제목은 100자 이하여야 합니다."),
  content: z.string().min(10, "내용은 10자 이상이어야 합니다."),
  category: z.string().min(1, "카테고리를 선택해주세요"),
});

// 댓글 작성 스키마 정의
const commentSchema = z.object({
  content: z.string().min(2, "댓글은 2자 이상이어야 합니다.").max(500, "댓글은 500자 이하여야 합니다."),
});

// 게시물 타입 정의
type InsurancePost = {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  commentCount: number;
  imageUrl?: string;
  category: string;
};

// 상세 게시물 타입 정의 (댓글 포함)
type PostDetail = InsurancePost & {
  comments: Comment[];
};

// 댓글 타입 정의
type Comment = {
  id: number;
  postId: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  likes: number;
};

// 카테고리 정의
const categories = [
  "일반",
  "부상보험",
  "단체보험",
  "유소년보험",
  "프로선수보험",
  "코치보험"
];

type InsurancePostFormValues = z.infer<typeof insurancePostSchema>;
type CommentFormValues = z.infer<typeof commentSchema>;

// 메인 게시판 컴포넌트
function InsuranceBoardList() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("전체");
  const { toast } = useToast();
  
  // 게시물 목록 불러오기
  const { data: posts, isLoading } = useQuery<InsurancePost[]>({
    queryKey: ["/api/insurance-posts", activeTab],
    queryFn: () => {
      // 임시로 더미 데이터 반환
      let mockPosts = [
        {
          id: 1,
          title: "자녀 축구 다이렉트 보험 상품 분석",
          content: "축구를 하는 자녀를 위한 다이렉트 보험 상품에 대한 상세 분석입니다. 이 보험은 경기 중 부상에 대한 보장을 제공하며, 기본적인 의료비 지원부터 심각한 부상에 대한 보상까지 다양한 보장 옵션이 있습니다.\n\n1. A손해보험 - 어린이 스포츠안전보험\n   - 장점: 축구 부상에 특화된 보장, 합리적인 보험료\n   - 단점: 가입 연령 제한, 치아 부상 보장 미흡\n\n2. B생명 - 유소년 스포츠 종합보험\n   - 장점: 폭넓은 보장 범위, 성장판 부상 특별 보장\n   - 단점: 상대적으로 높은 보험료\n\n3. C화재 - 스포츠 안전 플러스\n   - 장점: 경기 중 사고뿐만 아니라 훈련 중 부상도 보장\n   - 단점: 보험금 청구 절차가 복잡함\n\n위 상품들 중에서는 A손해보험의 어린이 스포츠안전보험이 가성비가 가장 좋다고 판단됩니다. 특히 축구 종목에 특화된 보장 내용을 갖추고 있어 추천드립니다.\n\n다만, 자녀의 연령과 축구 활동 빈도에 따라 적합한 상품이 달라질 수 있으니 개별 상담을 받아보시는 것을 권장합니다.",
          author: "김보험",
          authorId: 1,
          createdAt: "2025-03-10T12:00:00Z",
          views: 245,
          likes: 18,
          commentCount: 12,
          category: "유소년보험",
          imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 2,
          title: "청소년 스포츠 종합보험 비교",
          content: "다양한 청소년 스포츠 종합보험 상품을 비교 분석했습니다. A사의 경우 축구 부상에 대한 보장이 더 높은 반면, B사는 재활 치료에 대한 보장이 더 강점입니다. 자세한 내용은 아래를 참고하세요.\n\n1. 보장 범위 비교\n   - A사: 부상 치료비 최대 3천만원, 입원비 일당 5만원\n   - B사: 부상 치료비 최대 2천만원, 입원비 일당 8만원\n   - C사: 부상 치료비 최대 2천5백만원, 입원비 일당 6만원\n\n2. 특화 보장 내용\n   - A사: 골절, 인대 파열에 대한 보장 강화\n   - B사: 재활 치료, 물리치료 특약 제공\n   - C사: 수술비 추가 보장, 상해 후유장해 보장 강화\n\n3. 보험료 비교 (13세 남자 기준)\n   - A사: 월 25,000원\n   - B사: 월 28,000원\n   - C사: 월 23,000원\n\n축구를 주로 하는 청소년이라면 골절과 인대 부상이 많은 점을 고려했을 때 A사의 상품을 추천합니다. 다만 장기적인 치료가 필요한 부상의 경우에는 B사의 재활 치료 보장이 더 유리할 수 있습니다.",
          author: "박애널리스트",
          authorId: 2,
          createdAt: "2025-03-05T14:30:00Z",
          views: 187,
          likes: 8,
          commentCount: 5,
          category: "유소년보험"
        },
        {
          id: 3,
          title: "축구부 단체보험 가입시 주의사항",
          content: "학교나 동호회에서 축구부 단체보험 가입시 반드시 확인해야 할 사항들을 정리했습니다. 특히 보장 범위와 면책 조항에 대해서 상세히 살펴봐야 합니다.\n\n1. 보장 내용 확인 포인트\n   - 경기 중 부상뿐만 아니라 연습 중 부상도 보장되는지\n   - 이동 중 사고도 보장 범위에 포함되는지\n   - 치아 부상, 안면 부상 등 특수 부위 보장 여부\n   - 후유장해에 대한 보장 등급 및 금액\n\n2. 면책 조항 주의사항\n   - 기존 질환과의 인과관계가 있는 부상은 보장에서 제외되는 경우가 많음\n   - 고의적인 규칙 위반으로 인한 부상은 보장되지 않을 수 있음\n   - 음주 상태에서의 부상은 대부분 보장에서 제외됨\n\n3. 단체보험 가입 시 확인할 서류\n   - 보험 약관 전문 (특히 면책 조항)\n   - 보험금 청구 절차 안내서\n   - 보험 가입자 명단 정확성 확인\n\n4. 효율적인 단체보험 활용 방법\n   - 상해 사고 발생 시 즉시 사고 경위서 작성 습관화\n   - 치료 영수증, 진단서 등 증빙서류 철저히 보관\n   - 단체 담당자와 보험사 담당자 연락처 공유\n\n위 내용을 참고하여 축구부 단체보험 가입 시 불이익을 받지 않도록 주의하시기 바랍니다.",
          author: "이컨설턴트",
          authorId: 3,
          createdAt: "2025-02-28T09:15:00Z",
          views: 342,
          likes: 25,
          commentCount: 18,
          category: "단체보험",
          imageUrl: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 4,
          title: "프로 축구 선수를 위한 커리어 보험",
          content: "프로 축구 선수들을 위한 커리어 보험에 대해 알아보겠습니다. 부상으로 인한 선수 생활 중단 시 경제적 안정을 제공하는 이 보험은 선수들에게 매우 중요합니다.\n\n주요 보장 내용:\n1. 영구적 경기 불가 상태에 대한 일시금 보상\n2. 재활 기간 동안의 월 소득 보장\n3. 심각한 부상 후 진로 전환 지원금\n4. 해외 치료 비용 지원\n\n가입 시 고려사항:\n- 현재 연봉과 계약 기간에 따른 보장 금액 설정\n- 부상 이력에 따른 보험료 차등\n- 포지션별 위험도 평가\n- 보험사의 재정 안정성\n\n국내 주요 커리어 보험 상품 비교:\n1. D생명 - 프로선수 안심 플랜\n2. E화재 - 스포츠 커리어 보장보험\n3. F손해보험 - 애슬릿 프로텍션\n\n각 상품별 특징과 장단점에 대한 자세한 내용은 개별 상담을 통해 확인하시기 바랍니다.",
          author: "최에이전트",
          authorId: 4,
          createdAt: "2025-02-15T16:45:00Z",
          views: 156,
          likes: 12,
          commentCount: 7,
          category: "프로선수보험"
        },
        {
          id: 5,
          title: "코치와 감독을 위한 책임보험 분석",
          content: "축구 코치와 감독들이 알아야 할 책임보험에 대해 분석했습니다. 지도 과정에서 발생할 수 있는 다양한 법적 책임으로부터 자신을 보호하기 위한 필수 정보입니다.\n\n1. 책임보험의 필요성\n   - 선수 부상에 대한 과실 책임 발생 가능성\n   - 부모나 구단과의 분쟁 시 법적 대응 비용\n   - 시설 관련 사고에 대한 책임\n\n2. 주요 보장 내용\n   - 지도 과정에서의 선수 부상에 대한 배상 책임\n   - 법적 분쟁 시 변호사 비용\n   - 판결에 따른 배상금 보장\n   - 응급 처치 과정에서의 의료 과실 책임\n\n3. 국내 코치 책임보험 상품 비교\n   - G손해보험 - 스포츠 지도자 안심보험\n   - H화재 - 코치 프로텍터\n   - I생명 - 지도자 종합보장\n\n4. 가입 시 확인사항\n   - 보장 한도액 (사고당, 연간 총액)\n   - 자기부담금 설정\n   - 특약 가입 여부 (성폭력, 폭언 등 특수 상황 보장)\n\n코치와 감독분들은 자신을 보호하기 위해 반드시 책임보험에 가입하시고, 계약 내용을 꼼꼼히 확인하시기 바랍니다.",
          author: "김변호사",
          authorId: 5,
          createdAt: "2025-02-10T10:20:00Z",
          views: 205,
          likes: 15,
          commentCount: 9,
          category: "코치보험"
        }
      ];
      
      // 탭에 따라 필터링
      if (activeTab !== "전체") {
        mockPosts = mockPosts.filter(post => post.category === activeTab);
      }
      
      return Promise.resolve(mockPosts);
    }
  });

  // 날짜 포맷 함수
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };
  
  // 새 글 작성으로 이동
  const handleNewPost = () => {
    navigate("/insurance-analysis/write");
  };
  
  // 게시물 상세보기로 이동
  const handleViewPost = (postId: number) => {
    navigate(`/insurance-analysis/${postId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">보험보장분석</h1>
        <p className="text-lg text-gray-600">
          축구와 관련된 다양한 보험 상품 분석 및 보장 내용을 확인하세요
        </p>
      </div>
      
      {/* 카테고리 탭 */}
      <div className="mb-6">
        <Tabs defaultValue="전체" onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap pb-1" style={{ scrollbarWidth: 'none' }}>
            <TabsTrigger value="전체">전체</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* 글쓰기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">게시물 목록</h2>
        <Button onClick={handleNewPost}>
          <PenSquare className="mr-2 h-4 w-4" />
          새 글 작성
        </Button>
      </div>
      
      {/* 게시물 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">번호</TableHead>
                <TableHead className="w-[100px] text-center">카테고리</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-[120px] text-center">작성자</TableHead>
                <TableHead className="w-[120px] text-center">작성일</TableHead>
                <TableHead className="w-[80px] text-center">조회</TableHead>
                <TableHead className="w-[80px] text-center">좋아요</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow 
                  key={post.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewPost(post.id)}
                >
                  <TableCell className="text-center font-medium">{post.id}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 truncate">{post.title}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {post.commentCount > 0 && (
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.commentCount}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{post.author}</TableCell>
                  <TableCell className="text-center text-gray-500">{formatDate(post.createdAt)}</TableCell>
                  <TableCell className="text-center text-gray-500">{post.views}</TableCell>
                  <TableCell className="text-center text-gray-500">{post.likes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">해당 카테고리에 작성된 게시물이 없습니다.</p>
          <Button onClick={handleNewPost} variant="outline" className="mt-4">
            첫 번째 게시물 작성하기
          </Button>
        </div>
      )}
    </div>
  );
}

// 게시물 작성 컴포넌트
function InsurancePostWrite() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // 폼 설정
  const form = useForm<InsurancePostFormValues>({
    resolver: zodResolver(insurancePostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    }
  });

  // 파일 선택 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 글 작성 처리
  const onSubmit = (data: InsurancePostFormValues) => {
    setIsSubmitting(true);
    
    // 실제 API 연동 시 여기에 구현
    // 현재는 임시로 setTimeout으로 처리
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "글 작성 완료",
        description: "보험 분석 글이 성공적으로 등록되었습니다.",
      });
      navigate("/insurance-analysis");
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">보험 분석 게시물 작성</h1>
        <p className="text-gray-600">
          축구와 관련된 보험 상품에 대한 분석 내용을 작성해주세요
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="보험 분석 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="보험 분석 내용을 상세히 작성해주세요. 보험 상품명, 보장 내용, 장단점 등을 포함하면 더욱 좋습니다." 
                      className="min-h-[300px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel htmlFor="image" className="block mb-2">이미지 (선택사항)</FormLabel>
              <Input
                id="image"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              {selectedImage && (
                <div className="mt-2 relative">
                  <img
                    src={selectedImage}
                    alt="선택된 이미지"
                    className="w-full max-h-60 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/insurance-analysis")}
                className="flex-1"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  "게시물 등록"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

// 게시물 상세 컴포넌트
function InsurancePostDetail() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [, id] = location.match(/\/insurance-analysis\/(\d+)/) || ['', '0'];
  const postId = parseInt(id);
  const [isLiked, setIsLiked] = useState(false);
  
  // 댓글 폼
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ""
    }
  });
  
  // 게시물 상세 불러오기
  const { data: post, isLoading } = useQuery<PostDetail>({
    queryKey: ["/api/insurance-posts", postId],
    queryFn: () => {
      // 임시 데이터
      const mockPost: PostDetail = {
        id: 1,
        title: "자녀 축구 다이렉트 보험 상품 분석",
        content: "축구를 하는 자녀를 위한 다이렉트 보험 상품에 대한 상세 분석입니다. 이 보험은 경기 중 부상에 대한 보장을 제공하며, 기본적인 의료비 지원부터 심각한 부상에 대한 보상까지 다양한 보장 옵션이 있습니다.\n\n1. A손해보험 - 어린이 스포츠안전보험\n   - 장점: 축구 부상에 특화된 보장, 합리적인 보험료\n   - 단점: 가입 연령 제한, 치아 부상 보장 미흡\n\n2. B생명 - 유소년 스포츠 종합보험\n   - 장점: 폭넓은 보장 범위, 성장판 부상 특별 보장\n   - 단점: 상대적으로 높은 보험료\n\n3. C화재 - 스포츠 안전 플러스\n   - 장점: 경기 중 사고뿐만 아니라 훈련 중 부상도 보장\n   - 단점: 보험금 청구 절차가 복잡함\n\n위 상품들 중에서는 A손해보험의 어린이 스포츠안전보험이 가성비가 가장 좋다고 판단됩니다. 특히 축구 종목에 특화된 보장 내용을 갖추고 있어 추천드립니다.\n\n다만, 자녀의 연령과 축구 활동 빈도에 따라 적합한 상품이 달라질 수 있으니 개별 상담을 받아보시는 것을 권장합니다.",
        author: "김보험",
        authorId: 1,
        createdAt: "2025-03-10T12:00:00Z",
        views: 245,
        likes: 18,
        commentCount: 3,
        category: "유소년보험",
        imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        comments: [
          {
            id: 1,
            postId: 1,
            content: "정말 유용한 정보 감사합니다. A손해보험 상품에 대해 더 자세한 정보를 알 수 있을까요?",
            author: "축구맘",
            authorId: 5,
            createdAt: "2025-03-10T14:25:00Z",
            likes: 3
          },
          {
            id: 2,
            postId: 1,
            content: "우리 아이도 축구를 시작했는데, 이런 보험이 있는지 몰랐네요. 가입 방법도 알려주시면 감사하겠습니다.",
            author: "축구아빠",
            authorId: 6,
            createdAt: "2025-03-11T09:40:00Z",
            likes: 2
          },
          {
            id: 3,
            postId: 1,
            content: "B생명 상품은 저희 아이가 가입했는데, 작년에 성장판 부상으로 보험금을 받았습니다. 보장이 꽤 괜찮았어요.",
            author: "경험자",
            authorId: 7,
            createdAt: "2025-03-12T16:15:00Z",
            likes: 5
          }
        ]
      };
      
      return Promise.resolve(mockPost);
    }
  });
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };
  
  // 댓글 작성 처리
  const handleSubmitComment = (data: CommentFormValues) => {
    // 임시 댓글 추가 처리
    toast({
      title: "댓글 등록 완료",
      description: "댓글이 성공적으로 등록되었습니다.",
    });
    commentForm.reset();
  };
  
  // 좋아요 처리
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "좋아요 취소" : "좋아요",
      description: isLiked ? "게시물 좋아요가 취소되었습니다." : "게시물에 좋아요를 표시했습니다.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-500">게시물을 찾을 수 없습니다.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/insurance-analysis")}
        >
          게시물 목록으로
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* 게시물 헤더 */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate("/insurance-analysis")}
        >
          ← 목록으로
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 게시물 제목 영역 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {post.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-700 mr-2">{post.author}</span>
                <span className="mr-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.commentCount}
              </div>
            </div>
          </div>
        </div>
        
        {/* 게시물 내용 */}
        <div className="p-6">
          {post.imageUrl && (
            <div className="mb-6">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-w-full rounded-lg mx-auto"
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
        
        {/* 게시물 액션 */}
        <div className="p-6 border-t border-b bg-gray-50 flex justify-center">
          <Button 
            variant={isLiked ? "default" : "outline"}
            className="w-40"
            onClick={handleLike}
          >
            <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            좋아요 {post.likes + (isLiked ? 1 : 0)}
          </Button>
        </div>
        
        {/* 댓글 영역 */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">댓글 {post.comments.length}개</h3>
          
          {/* 댓글 작성 폼 */}
          <div className="mb-6">
            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(handleSubmitComment)} className="space-y-4">
                <FormField
                  control={commentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="댓글을 작성해주세요" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">댓글 작성</Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-800">{comment.author}</span>
                      <span className="text-xs text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>아직 작성된 댓글이 없습니다.</p>
                <p className="mt-1">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 보험보장분석 컴포넌트
export default function InsuranceAnalysis() {
  const [location] = useLocation();
  
  // 현재 경로에 따라 적절한 컴포넌트 렌더링
  if (location === "/insurance-analysis/write") {
    return <InsurancePostWrite />;
  } else if (location.match(/^\/insurance-analysis\/\d+$/)) {
    return <InsurancePostDetail />;
  } else {
    return <InsuranceBoardList />;
  }
}