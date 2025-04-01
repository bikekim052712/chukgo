import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  Filter, 
  CalendarDays, 
  User,
  MoreVertical,
  Edit,
  Trash,
  ArrowUp,
  Share2,
  Send,
  FileText
} from "lucide-react";

// 게시글 스키마
const insurancePostSchema = z.object({
  title: z.string().min(2, "제목은 최소 2자 이상이어야 합니다"),
  content: z.string().min(10, "내용은 최소 10자 이상이어야 합니다"),
  category: z.string(),
  imageUrl: z.string().optional(),
});

// 댓글 스키마
const commentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요"),
});

// 타입 정의
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

type PostDetail = InsurancePost & {
  comments: Comment[];
};

type Comment = {
  id: number;
  postId: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  likes: number;
};

type InsurancePostFormValues = z.infer<typeof insurancePostSchema>;
type CommentFormValues = z.infer<typeof commentSchema>;

// 게시글 목록 컴포넌트
function InsuranceBoardList() {
  const [, navigate] = useLocation();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 가상의 게시글 데이터 (실제로는 API로 가져올 것)
  const mockPosts: InsurancePost[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    title: `[보험보장분석] ${i % 3 === 0 ? '축구부상 관련 보험 추천' : i % 3 === 1 ? '유소년 선수 특화 보험' : '코치를 위한 책임보험'}`,
    content: "보험 상품 추천 및 분석 내용이 담긴 게시글입니다...",
    author: `축구보험전문가${i % 5 + 1}`,
    authorId: i % 5 + 1,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    views: Math.floor(Math.random() * 100) + 10,
    likes: Math.floor(Math.random() * 20),
    commentCount: Math.floor(Math.random() * 10),
    category: i % 4 === 0 ? "상해보험" : i % 4 === 1 ? "책임보험" : i % 4 === 2 ? "의료보험" : "종합보험",
  }));

  // 카테고리별 필터링
  const filteredPosts = mockPosts.filter(post => {
    if (category === "all") return true;
    return post.category === category;
  });
  
  // 검색 결과 필터링
  const searchedPosts = isSearching && searchTerm 
    ? filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredPosts;

  // 페이지네이션
  const postsPerPage = 10;
  const totalPages = Math.ceil(searchedPosts.length / postsPerPage);
  const paginatedPosts = searchedPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setPage(1);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">보험보장분석</h1>
          <p className="text-gray-600 mt-1">
            축구 관련 보험 상품의 보장 내용을 분석하고 추천받는 커뮤니티입니다
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate("/insurance-analysis/write")}>
            글쓰기
          </Button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="상해보험">상해보험</SelectItem>
              <SelectItem value="책임보험">책임보험</SelectItem>
              <SelectItem value="의료보험">의료보험</SelectItem>
              <SelectItem value="종합보험">종합보험</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex-1 md:flex-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-16 w-full md:w-[300px]"
            />
            {isSearching && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-14 top-1/2 transform -translate-y-1/2 h-7 text-xs px-2"
                onClick={resetSearch}
              >
                초기화
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              검색
            </Button>
          </div>
        </form>
      </div>

      {/* 검색 결과 정보 */}
      {isSearching && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-blue-700">
            <span className="font-semibold">'{searchTerm}'</span>에 대한 검색 결과:
            <span className="font-semibold ml-1">{searchedPosts.length}개</span>의 게시글을 찾았습니다
          </p>
        </div>
      )}

      {/* 게시글 목록 테이블 */}
      <Card className="mb-6 border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] text-center">번호</TableHead>
              <TableHead className="w-[100px] text-center">카테고리</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[120px] text-center">작성자</TableHead>
              <TableHead className="w-[120px] text-center">작성일</TableHead>
              <TableHead className="w-[80px] text-center">조회</TableHead>
              <TableHead className="w-[80px] text-center">추천</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/insurance-analysis/${post.id}`)}>
                  <TableCell className="text-center font-medium">{post.id}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{post.title}</span>
                      {post.commentCount > 0 && (
                        <span className="ml-2 text-sm text-blue-600">[{post.commentCount}]</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center text-gray-500">{post.views}</TableCell>
                  <TableCell className="text-center text-gray-500">{post.likes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  게시글이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 my-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // 페이지 범위 계산
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="px-1">...</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// 게시글 작성 컴포넌트
function InsurancePostWrite() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InsurancePostFormValues>({
    resolver: zodResolver(insurancePostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "상해보험",
      imageUrl: "",
    },
  });

  const onSubmit = (data: InsurancePostFormValues) => {
    setIsSubmitting(true);
    
    // 실제로는 API 요청을 보낼 것
    console.log('게시글 작성 데이터:', data);
    
    // 가상의 서버 응답 대기
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/insurance-analysis");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/insurance-analysis")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">보험보장분석 글쓰기</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <Label htmlFor="category" className="md:text-right">카테고리</Label>
                <div className="md:col-span-3">
                  <Select
                    value={form.watch('category')}
                    onValueChange={(value) => form.setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="상해보험">상해보험</SelectItem>
                      <SelectItem value="책임보험">책임보험</SelectItem>
                      <SelectItem value="의료보험">의료보험</SelectItem>
                      <SelectItem value="종합보험">종합보험</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <Label htmlFor="title" className="md:text-right">제목</Label>
                <div className="md:col-span-3">
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="제목을 입력하세요"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <Label htmlFor="content" className="md:text-right pt-2">내용</Label>
                <div className="md:col-span-3">
                  <Textarea
                    id="content"
                    {...form.register('content')}
                    placeholder="내용을 입력하세요"
                    className="min-h-[300px]"
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <Label htmlFor="imageUrl" className="md:text-right">이미지 URL</Label>
                <div className="md:col-span-3">
                  <Input
                    id="imageUrl"
                    {...form.register('imageUrl')}
                    placeholder="이미지 URL (선택사항)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/insurance-analysis")}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "등록 중..." : "등록하기"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 게시글 상세 컴포넌트
function InsurancePostDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/insurance-analysis/:id");
  const postId = params?.id ? parseInt(params.id) : 0;
  const [liked, setLiked] = useState(false);
  
  // 댓글 폼
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  // 가상의 게시글 데이터 (실제로는 API로 가져올 것)
  const [post, setPost] = useState<PostDetail | null>(null);
  
  useEffect(() => {
    // 실제로는 API 요청을 보낼 것
    setTimeout(() => {
      // 가상의 게시글 데이터
      const mockPost: PostDetail = {
        id: postId,
        title: "[보험보장분석] 축구부상 관련 보험 추천",
        content: `
          # 축구 부상 발생 시 필요한 보험 추천
          
          안녕하세요, 축구보험전문가입니다. 오늘은 축구 활동 중 발생할 수 있는 부상에 대비한 보험 상품들을 분석해보겠습니다.
          
          ## 1. 스포츠 상해보험
          
          스포츠 활동 중 발생하는 부상에 특화된 상해보험 상품입니다. 일반 상해보험과 달리 스포츠 활동 중 부상에 대한 보장이 강화되어 있습니다.
          
          ### 주요 보장 내용
          - 골절, 인대 파열, 탈구 등 운동 중 흔한 부상 보장
          - 수술비, 입원비, 통원치료비 보장
          - 특약으로 스포츠용품 손상 보장 추가 가능
          
          ### 추천 대상
          - 주 1회 이상 정기적으로 축구를 하는 일반인
          - 동호회 활동을 하는 축구 애호가
          
          ## 2. 프로선수 특화 보험
          
          프로 및 세미프로 선수들을 위한 특화된 보험 상품입니다.
          
          ### 주요 보장 내용
          - 경기 중 부상으로 인한 소득 손실 보장
          - 영구적 장애 발생 시 일시금 지급
          - 재활 치료비 특약 가능
          
          ### 추천 대상
          - 프로 및 세미프로 축구 선수
          - 축구를 통해 수입이 발생하는 코치 및 지도자
          
          ## 3. 유소년 선수 보험
          
          성장기 유소년 선수들을 위한 특화된 보험 상품입니다.
          
          ### 주요 보장 내용
          - 성장판 손상 등 유소년 특화 부상 보장
          - 치아 손상 보장 (마우스가드 미착용 시에도)
          - 학업 중단에 대한 보장 특약 가능
          
          ### 추천 대상
          - 엘리트 축구 교육을 받는 유소년 선수
          - 학교 대표팀 소속 학생 선수
          
          ## 4. 코치 및 지도자 책임보험
          
          축구 지도 활동 중 발생할 수 있는 법적 책임을 보장하는 보험입니다.
          
          ### 주요 보장 내용
          - 지도 중 발생한 피지도자 부상에 대한 배상책임
          - 시설 이용 중 사고에 대한 배상책임
          - 관리자 배상책임 특약 가능
          
          ### 추천 대상
          - 축구 지도자, 코치
          - 축구 교실, 클럽 운영자
          
          ## 보험 가입 시 주의사항
          
          1. **면책 조항 확인**: 음주 후 운동, 무면허 시설 이용 등은 면책될 수 있음
          2. **보장 범위 확인**: 아마추어/프로 구분, 공식/비공식 경기 구분 등
          3. **갱신 조건 확인**: 보험료 인상률, 재가입 조건 등
          
          궁금한 사항이 있으시면 댓글로 남겨주세요. 개인별 상황에 맞는 상품을 추천해드리겠습니다.
        `,
        author: "축구보험전문가1",
        authorId: 1,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        views: 153,
        likes: 24,
        commentCount: 8,
        category: "상해보험",
        comments: Array.from({ length: 8 }).map((_, i) => ({
          id: i + 1,
          postId,
          content: i % 3 === 0 
            ? "유소년 선수 보험 중 가장 추천하는 상품이 있을까요?" 
            : i % 3 === 1 
            ? "코치 책임보험은 어떤 보험사 상품이 좋을까요? 비교 분석해주시면 감사하겠습니다."
            : "좋은 정보 감사합니다. 저는 주 2회 축구를 하는데 스포츠 상해보험에 가입해야겠네요.",
          author: `축구팬${i + 1}`,
          authorId: i + 10,
          createdAt: new Date(Date.now() - i * 10000000).toISOString(),
          likes: Math.floor(Math.random() * 5),
        })),
      };
      
      setPost(mockPost);
    }, 500);
  }, [postId]);

  const handleLike = () => {
    if (!liked && post) {
      setPost({
        ...post,
        likes: post.likes + 1
      });
      setLiked(true);
    }
  };

  const handleSubmitComment = (data: CommentFormValues) => {
    if (!post) return;
    
    // 실제로는 API 요청을 보낼 것
    console.log('댓글 작성 데이터:', data);
    
    // 가상으로 댓글 추가
    const newComment: Comment = {
      id: post.comments.length + 1,
      postId,
      content: data.content,
      author: "현재사용자",
      authorId: 999,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    
    setPost({
      ...post,
      comments: [...post.comments, newComment],
      commentCount: post.commentCount + 1,
    });
    
    // 댓글 폼 초기화
    commentForm.reset();
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl flex justify-center">
        <div className="animate-pulse space-y-8 w-full">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/insurance-analysis")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>
      </div>

      <Card className="mb-8 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center mb-1">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 mr-3">
              {post.category}
            </Badge>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{post.author}</span>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDays className="mr-1 h-3 w-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{post.commentCount}</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="py-6">
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-xl font-bold mt-5 mb-3">{paragraph.substring(3)}</h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-lg font-bold mt-4 mb-2">{paragraph.substring(4)}</h3>;
              } else if (paragraph.startsWith('- ')) {
                return <li key={idx} className="ml-4">{paragraph.substring(2)}</li>;
              } else if (paragraph.startsWith('1. ')) {
                return <div key={idx} className="ml-4 mb-2 flex"><span className="mr-2 font-semibold">{paragraph.substring(0, 2)}</span><span>{paragraph.substring(3)}</span></div>;
              } else if (paragraph.startsWith('2. ')) {
                return <div key={idx} className="ml-4 mb-2 flex"><span className="mr-2 font-semibold">{paragraph.substring(0, 2)}</span><span>{paragraph.substring(3)}</span></div>;
              } else if (paragraph.startsWith('3. ')) {
                return <div key={idx} className="ml-4 mb-2 flex"><span className="mr-2 font-semibold">{paragraph.substring(0, 2)}</span><span>{paragraph.substring(3)}</span></div>;
              } else if (paragraph.trim() === '') {
                return <div key={idx} className="h-4"></div>;
              } else {
                return <p key={idx} className="mb-4">{paragraph}</p>;
              }
            })}
          </div>

          {post.imageUrl && (
            <div className="mt-6">
              <img
                src={post.imageUrl}
                alt="게시글 이미지"
                className="rounded-md max-h-96 object-contain"
              />
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="py-4 flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={liked}
              className={liked ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800" : ""}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              추천
              <span className="ml-1 font-semibold">{post.likes}</span>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              공유
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>수정하기</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                <span>삭제하기</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>신고하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      {/* 댓글 섹션 */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            댓글 {post.commentCount}개
          </CardTitle>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-4">
          {post.comments.length > 0 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-800">{comment.content}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {comment.id !== post.comments.length && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>첫 번째 댓글을 남겨보세요</p>
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="py-4">
          <form onSubmit={commentForm.handleSubmit(handleSubmitComment)} className="w-full">
            <div className="flex space-x-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="댓글을 입력하세요"
                  className="resize-none min-h-[80px] pr-12"
                  {...commentForm.register('content')}
                />
                <Button 
                  size="sm" 
                  className="absolute bottom-2 right-2"
                  type="submit"
                  disabled={!commentForm.watch('content')}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {commentForm.formState.errors.content && (
              <p className="text-sm text-red-500 mt-1 ml-11">
                {commentForm.formState.errors.content.message}
              </p>
            )}
          </form>
        </CardFooter>
      </Card>

      {/* 관련 게시글 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">관련 게시글</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <Link 
                  href={`/insurance-analysis/${postId + i + 1}`} 
                  className="flex items-center py-1 hover:text-blue-600"
                >
                  <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm">
                    [{post.category}] {i % 2 === 0 ? '선수 부상 관련 보험금 청구 방법' : '코치를 위한 맞춤형 보험 상품 비교'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// 메인 컴포넌트
export default function InsuranceAnalysis() {
  const [match, params] = useRoute("/insurance-analysis/:id");
  const matchWrite = useRoute("/insurance-analysis/write")[0];
  
  // 게시글 작성 페이지
  if (matchWrite) {
    return <InsurancePostWrite />;
  }
  
  // 게시글 상세 페이지
  if (match && params?.id) {
    return <InsurancePostDetail />;
  }
  
  // 게시글 목록 페이지
  return <InsuranceBoardList />;
}