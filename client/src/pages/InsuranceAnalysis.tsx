import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useIsMobile } from "@/hooks/use-mobile";

// 네이버 카페 스타일 상수
const NAVER_COLORS = {
  primary: "#03C75A", // 네이버 그린
  secondary: "#00B843",
  border: "#e6e6e6",
  background: "#f9f9f9",
  cardBg: "#ffffff",
  text: "#333333",
  lightText: "#666666",
  veryLightText: "#999999",
  accent: "#FF5C35", // 네이버 오렌지 (강조색)
  navBg: "#f2f2f2",
};
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
  const isMobile = useIsMobile();

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
    <div className={`container mx-auto ${isMobile ? 'px-0' : 'px-4'} py-4`} style={{ backgroundColor: NAVER_COLORS.background }}>
      {/* 네이버 카페 스타일 헤더 */}
      <div className={`${isMobile ? 'px-4' : ''} mb-4`}>
        <div className="flex items-center mb-2">
          <h1 className="text-2xl font-bold" style={{ color: NAVER_COLORS.text }}>축고</h1>
          <span className="text-sm ml-2 px-2 py-1 rounded-full" style={{ 
            backgroundColor: NAVER_COLORS.primary, 
            color: 'white' 
          }}>
            보험보장분석
          </span>
        </div>
        <p className="text-sm" style={{ color: NAVER_COLORS.lightText }}>
          축구 관련 보험 상품의 보장 내용을 분석하고 추천받는 커뮤니티입니다
        </p>
      </div>

      {/* 카테고리 탭 - 네이버 카페 스타일 */}
      <div className={`flex overflow-x-auto whitespace-nowrap py-2 mb-3 ${isMobile ? 'px-2' : ''}`}
        style={{ 
          backgroundColor: 'white',
          borderTop: `1px solid ${NAVER_COLORS.border}`,
          borderBottom: `1px solid ${NAVER_COLORS.border}`,
        }}
      >
        <button
          className={`px-3 py-2 mr-1 rounded-md text-sm font-medium transition-colors ${category === 'all' ? 'bg-opacity-10' : ''}`}
          style={{ 
            backgroundColor: category === 'all' ? `${NAVER_COLORS.primary}20` : 'transparent',
            color: category === 'all' ? NAVER_COLORS.primary : NAVER_COLORS.lightText
          }}
          onClick={() => setCategory('all')}
        >
          전체
        </button>
        <button
          className={`px-3 py-2 mr-1 rounded-md text-sm font-medium transition-colors ${category === '상해보험' ? 'bg-opacity-10' : ''}`}
          style={{ 
            backgroundColor: category === '상해보험' ? `${NAVER_COLORS.primary}20` : 'transparent',
            color: category === '상해보험' ? NAVER_COLORS.primary : NAVER_COLORS.lightText
          }}
          onClick={() => setCategory('상해보험')}
        >
          상해보험
        </button>
        <button
          className={`px-3 py-2 mr-1 rounded-md text-sm font-medium transition-colors ${category === '책임보험' ? 'bg-opacity-10' : ''}`}
          style={{ 
            backgroundColor: category === '책임보험' ? `${NAVER_COLORS.primary}20` : 'transparent',
            color: category === '책임보험' ? NAVER_COLORS.primary : NAVER_COLORS.lightText
          }}
          onClick={() => setCategory('책임보험')}
        >
          책임보험
        </button>
        <button
          className={`px-3 py-2 mr-1 rounded-md text-sm font-medium transition-colors ${category === '의료보험' ? 'bg-opacity-10' : ''}`}
          style={{ 
            backgroundColor: category === '의료보험' ? `${NAVER_COLORS.primary}20` : 'transparent',
            color: category === '의료보험' ? NAVER_COLORS.primary : NAVER_COLORS.lightText
          }}
          onClick={() => setCategory('의료보험')}
        >
          의료보험
        </button>
        <button
          className={`px-3 py-2 mr-1 rounded-md text-sm font-medium transition-colors ${category === '종합보험' ? 'bg-opacity-10' : ''}`}
          style={{ 
            backgroundColor: category === '종합보험' ? `${NAVER_COLORS.primary}20` : 'transparent',
            color: category === '종합보험' ? NAVER_COLORS.primary : NAVER_COLORS.lightText
          }}
          onClick={() => setCategory('종합보험')}
        >
          종합보험
        </button>
      </div>

      {/* 상단 툴바 - 글쓰기 버튼 및 검색 */}
      <div className={`flex justify-between items-center ${isMobile ? 'px-4' : ''} mb-4`}>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate("/insurance-analysis/write")}
            style={{ 
              backgroundColor: NAVER_COLORS.primary,
              color: 'white',
              border: 'none',
            }}
            className="rounded-md font-medium"
          >
            글쓰기
          </Button>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-auto">
          <div className="relative flex-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
              style={{ color: NAVER_COLORS.veryLightText }} />
            <Input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-16 w-[180px] h-9 text-sm"
              style={{
                border: `1px solid ${NAVER_COLORS.border}`,
                borderRadius: '4px',
              }}
            />
            <Button
              type="submit"
              size="sm"
              style={{ 
                backgroundColor: NAVER_COLORS.primary,
                color: 'white',
                border: 'none',
              }}
              className="absolute right-0 top-0 h-full rounded-l-none rounded-r-md"
            >
              검색
            </Button>
          </div>
        </form>
      </div>

      {/* 검색 결과 정보 */}
      {isSearching && (
        <div className={`mb-4 p-3 rounded-md ${isMobile ? 'mx-4' : ''}`}
          style={{ backgroundColor: `${NAVER_COLORS.primary}10` }}>
          <p style={{ color: NAVER_COLORS.primary }}>
            <span className="font-semibold">'{searchTerm}'</span>에 대한 검색 결과:
            <span className="font-semibold ml-1">{searchedPosts.length}개</span>의 게시글을 찾았습니다
            {isSearching && (
              <button
                type="button"
                className="ml-2 text-xs underline"
                onClick={resetSearch}
                style={{ color: NAVER_COLORS.primary }}
              >
                초기화
              </button>
            )}
          </p>
        </div>
      )}

      {/* 게시글 목록 - 모바일은 카드형, 데스크탑은 테이블 */}
      {isMobile ? (
        // 모바일용 네이버 카페 스타일 UI
        <div className={`${isMobile ? 'px-4' : ''}`}>
          {paginatedPosts.length > 0 ? (
            <>
              {paginatedPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="cursor-pointer border-b last:border-b-0"
                  style={{ borderColor: NAVER_COLORS.border }}
                  onClick={() => navigate(`/insurance-analysis/${post.id}`)}
                >
                  <div className="py-3">
                    {/* 게시글 제목 */}
                    <div className="mb-2">
                      <div className="flex items-center mb-1">
                        <span 
                          className="text-xs mr-1 px-1.5 py-0.5 rounded-sm"
                          style={{ 
                            backgroundColor: `${NAVER_COLORS.primary}15`,
                            color: NAVER_COLORS.primary,
                          }}
                        >
                          {post.category}
                        </span>
                        {post.commentCount > 0 && (
                          <span className="text-xs" style={{ color: NAVER_COLORS.primary }}>
                            [{post.commentCount}]
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2" style={{ color: NAVER_COLORS.text }}>
                        {post.title}
                      </h3>
                    </div>
                    
                    {/* 작성자 정보 및 메타데이터 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center" style={{ color: NAVER_COLORS.veryLightText }}>
                        <span className="font-medium mr-2" style={{ color: NAVER_COLORS.lightText }}>
                          {post.author}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2" style={{ color: NAVER_COLORS.veryLightText }}>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-0.5" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-0.5" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 주간 인기글 섹션 */}
              {page === 1 && (
                <div className="my-4 p-3 rounded-md" style={{ backgroundColor: '#f5f6fa' }}>
                  <div className="flex items-center mb-2">
                    <ThumbsUp className="h-4 w-4 mr-1" style={{ color: NAVER_COLORS.accent }} />
                    <h3 className="font-medium text-sm" style={{ color: NAVER_COLORS.text }}>주간 인기글</h3>
                  </div>
                  <ul className="space-y-2">
                    {mockPosts.slice(0, 3).sort((a, b) => b.likes - a.likes).map(post => (
                      <li 
                        key={`popular-${post.id}`}
                        className="text-sm cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/insurance-analysis/${post.id}`);
                        }}
                      >
                        <div className="flex items-start">
                          <span className="text-xs px-1 py-0.5 mr-1 rounded-sm" style={{ 
                            backgroundColor: NAVER_COLORS.accent,
                            color: 'white'
                          }}>
                            {post.likes}
                          </span>
                          <p className="line-clamp-1 flex-1" style={{ color: NAVER_COLORS.text }}>{post.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center" style={{ color: NAVER_COLORS.lightText }}>
              게시글이 없습니다
            </div>
          )}
        </div>
      ) : (
        // 데스크탑용 네이버 카페 스타일 테이블 UI
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2" style={{ color: NAVER_COLORS.text }}>
                총 {filteredPosts.length}개의 글
              </span>
              {isSearching && (
                <span className="text-sm" style={{ color: NAVER_COLORS.primary }}>
                  (검색결과: {searchedPosts.length}개)
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-2"
                style={{ 
                  borderColor: NAVER_COLORS.border,
                  color: NAVER_COLORS.text
                }}
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                엑셀 다운로드
              </Button>
            </div>
          </div>

          <div style={{ 
            border: `1px solid ${NAVER_COLORS.border}`,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHeader style={{ backgroundColor: '#f9f9f9' }}>
                <TableRow style={{ borderBottom: `1px solid ${NAVER_COLORS.border}` }}>
                  <TableHead className="w-[70px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>번호</TableHead>
                  <TableHead className="w-[100px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>카테고리</TableHead>
                  <TableHead className="text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>제목</TableHead>
                  <TableHead className="w-[120px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>작성자</TableHead>
                  <TableHead className="w-[120px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>작성일</TableHead>
                  <TableHead className="w-[70px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>조회</TableHead>
                  <TableHead className="w-[70px] text-center text-xs font-medium" 
                    style={{ color: NAVER_COLORS.lightText }}>추천</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 공지사항 상단 고정 */}
                <TableRow 
                  style={{ 
                    backgroundColor: '#f9f9f9',
                    borderBottom: `1px solid ${NAVER_COLORS.border}`
                  }}
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => navigate('/insurance-analysis/notice')}
                >
                  <TableCell className="text-center font-bold" style={{ color: NAVER_COLORS.accent }}>
                    공지
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs px-1.5 py-0.5 rounded-sm"
                      style={{ 
                        backgroundColor: NAVER_COLORS.accent, 
                        color: 'white'
                      }}>
                      공지사항
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium" style={{ color: NAVER_COLORS.text }}>
                      [필독] 보험보장분석 게시판 이용 안내
                    </span>
                  </TableCell>
                  <TableCell className="text-center" style={{ color: NAVER_COLORS.text }}>
                    관리자
                  </TableCell>
                  <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                    2025-04-01
                  </TableCell>
                  <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                    342
                  </TableCell>
                  <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                    54
                  </TableCell>
                </TableRow>

                {/* 일반 게시글 목록 */}
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post) => (
                    <TableRow 
                      key={post.id} 
                      style={{ borderBottom: `1px solid ${NAVER_COLORS.border}` }}
                      className="cursor-pointer hover:bg-gray-50" 
                      onClick={() => navigate(`/insurance-analysis/${post.id}`)}
                    >
                      <TableCell className="text-center" style={{ color: NAVER_COLORS.text }}>
                        {post.id}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs px-1.5 py-0.5 rounded-sm"
                          style={{ 
                            backgroundColor: `${NAVER_COLORS.primary}15`,
                            color: NAVER_COLORS.primary
                          }}>
                          {post.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span style={{ color: NAVER_COLORS.text }}>{post.title}</span>
                          {post.commentCount > 0 && (
                            <span className="ml-2 text-sm" style={{ color: NAVER_COLORS.primary }}>
                              [{post.commentCount}]
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center" style={{ color: NAVER_COLORS.lightText }}>
                        {post.author}
                      </TableCell>
                      <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                        {post.views}
                      </TableCell>
                      <TableCell className="text-center" style={{ color: NAVER_COLORS.veryLightText }}>
                        {post.likes}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center" style={{ color: NAVER_COLORS.lightText }}>
                      게시글이 없습니다
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 주간 인기글 섹션 (데스크탑) */}
          {page === 1 && (
            <div className="mt-6 p-4 rounded-md" style={{ backgroundColor: '#f5f6fa' }}>
              <div className="flex items-center mb-3">
                <ThumbsUp className="h-4 w-4 mr-2" style={{ color: NAVER_COLORS.accent }} />
                <h3 className="font-medium" style={{ color: NAVER_COLORS.text }}>주간 인기글</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {mockPosts.slice(0, 6).sort((a, b) => b.likes - a.likes).map(post => (
                  <div 
                    key={`popular-${post.id}`}
                    className="flex items-start cursor-pointer p-2 rounded hover:bg-white"
                    style={{ transition: 'background-color 0.2s' }}
                    onClick={() => navigate(`/insurance-analysis/${post.id}`)}
                  >
                    <span className="flex-shrink-0 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mr-2"
                      style={{ 
                        backgroundColor: post.id <= 3 ? NAVER_COLORS.accent : '#e9e9e9',
                        color: post.id <= 3 ? 'white' : NAVER_COLORS.lightText
                      }}>
                      {post.id}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm mb-1" style={{ color: NAVER_COLORS.text }}>
                        {post.title}
                      </p>
                      <div className="flex items-center text-xs space-x-2" style={{ color: NAVER_COLORS.veryLightText }}>
                        <span>{post.author}</span>
                        <span>·</span>
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-0.5" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 네이버 카페 스타일 페이지네이션 */}
      <div className={`flex justify-center items-center ${isMobile ? 'mx-4' : ''}`}>
        <div className="flex items-center border rounded-md overflow-hidden" 
          style={{ borderColor: NAVER_COLORS.border }}>
          <button
            className="flex items-center justify-center w-8 h-8 border-r"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: page === 1 ? NAVER_COLORS.veryLightText : NAVER_COLORS.primary
            }}
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>
          
          <button
            className="flex items-center justify-center w-8 h-8 border-r"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: page === 1 ? NAVER_COLORS.veryLightText : NAVER_COLORS.primary
            }}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center">
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
                <button
                  key={pageNum}
                  className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{ 
                    backgroundColor: page === pageNum ? NAVER_COLORS.primary : 'transparent',
                    color: page === pageNum ? 'white' : NAVER_COLORS.text,
                    fontWeight: page === pageNum ? 'bold' : 'normal',
                  }}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && page < totalPages - 2 && (
              <>
                <span className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{ color: NAVER_COLORS.veryLightText }}>
                  ...
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{ color: NAVER_COLORS.text }}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            className="flex items-center justify-center w-8 h-8 border-l"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: page === totalPages ? NAVER_COLORS.veryLightText : NAVER_COLORS.primary
            }}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            className="flex items-center justify-center w-8 h-8 border-l"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: page === totalPages ? NAVER_COLORS.veryLightText : NAVER_COLORS.primary
            }}
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 하단 툴바 */}
      <div className={`flex justify-between mt-4 mb-8 ${isMobile ? 'px-4' : ''}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/insurance-analysis')}
          className="h-9 text-sm"
          style={{ 
            borderColor: NAVER_COLORS.border,
            color: NAVER_COLORS.text
          }}
        >
          <FileText className="h-4 w-4 mr-1" />
          목록
        </Button>
        
        <Button
          onClick={() => navigate('/insurance-analysis/write')}
          size="sm"
          className="h-9 text-sm"
          style={{ 
            backgroundColor: NAVER_COLORS.primary,
            color: 'white',
          }}
        >
          글쓰기
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
  const isMobile = useIsMobile();
  
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
    <div className={`container mx-auto ${isMobile ? 'px-0' : 'px-4'} py-4 max-w-5xl`} 
      style={{ backgroundColor: NAVER_COLORS.background }}>
      {/* 네이버 카페 스타일 헤더 */}
      <div className={`${isMobile ? 'px-4' : ''} mb-2`}>
        <div className="flex items-center mb-2">
          <h1 className="text-2xl font-bold" style={{ color: NAVER_COLORS.text }}>축고</h1>
          <span className="text-sm ml-2 px-2 py-1 rounded-full" style={{ 
            backgroundColor: NAVER_COLORS.primary, 
            color: 'white' 
          }}>
            보험보장분석
          </span>
        </div>
      </div>

      {/* 네이버 카페 스타일 게시글 상세 */}
      <div className={`${isMobile ? '' : 'bg-white rounded-md shadow-sm border'} mb-4`}
        style={{ borderColor: NAVER_COLORS.border }}>
        {/* 게시글 제목 및 정보 헤더 */}
        <div className={`${isMobile ? 'px-4 py-3 bg-white' : 'px-6 py-4'} border-b`} 
          style={{ borderColor: NAVER_COLORS.border }}>
          <div className="mb-1 flex items-start gap-2">
            <span className="text-xs px-1.5 py-0.5 rounded-sm mt-1"
              style={{ 
                backgroundColor: `${NAVER_COLORS.primary}15`,
                color: NAVER_COLORS.primary
              }}>
              {post.category}
            </span>
            <h1 className="text-xl font-bold flex-1" style={{ color: NAVER_COLORS.text }}>
              {post.title}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-3 text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-2" style={{ color: NAVER_COLORS.text }}>
                {post.author}
              </span>
              <span style={{ color: NAVER_COLORS.veryLightText }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-3" style={{ color: NAVER_COLORS.veryLightText }}>
              <div className="flex items-center text-xs">
                <Eye className="mr-1 h-3.5 w-3.5" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center text-xs">
                <MessageSquare className="mr-1 h-3.5 w-3.5" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 게시글 내용 */}
        <div className={`${isMobile ? 'px-4 py-5 bg-white mt-2' : 'px-6 py-5'} prose max-w-none`}>
          <div className="text-base whitespace-pre-wrap break-words" style={{ color: NAVER_COLORS.text }}>
            {post.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4" style={{ color: NAVER_COLORS.text }}>
                  {paragraph.substring(2)}
                </h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-xl font-bold mt-5 mb-3" style={{ color: NAVER_COLORS.text }}>
                  {paragraph.substring(3)}
                </h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-lg font-bold mt-4 mb-2" style={{ color: NAVER_COLORS.text }}>
                  {paragraph.substring(4)}
                </h3>;
              } else if (paragraph.startsWith('- ')) {
                return <li key={idx} className="ml-4 mb-2" style={{ color: NAVER_COLORS.text }}>
                  {paragraph.substring(2)}
                </li>;
              } else if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                return <div key={idx} className="ml-4 mb-2 flex" style={{ color: NAVER_COLORS.text }}>
                  <span className="mr-2 font-semibold">{paragraph.substring(0, 2)}</span>
                  <span>{paragraph.substring(3)}</span>
                </div>;
              } else if (paragraph.trim() === '') {
                return <div key={idx} className="h-4"></div>;
              } else {
                return <p key={idx} className="mb-4" style={{ color: NAVER_COLORS.text }}>{paragraph}</p>;
              }
            })}
          </div>

          {post.imageUrl && (
            <div className="mt-6">
              <img
                src={post.imageUrl}
                alt="게시글 이미지"
                className="rounded-md max-w-full object-contain"
              />
            </div>
          )}
        </div>
        
        {/* 추천 버튼 영역 */}
        <div className={`${isMobile ? 'px-4 py-4 bg-white mt-2' : 'px-6 py-4'} flex justify-center border-t border-b`}
          style={{ borderColor: NAVER_COLORS.border }}>
          <button
            className={`flex items-center justify-center rounded-full px-4 py-2.5 ${liked ? 'opacity-70' : ''}`}
            style={{ 
              backgroundColor: liked ? `${NAVER_COLORS.primary}30` : `${NAVER_COLORS.primary}15`,
              color: NAVER_COLORS.primary,
              transition: 'all 0.2s'
            }}
            onClick={handleLike}
            disabled={liked}
          >
            <ThumbsUp className="mr-1.5 h-5 w-5" />
            <span className="font-medium">{liked ? '추천완료' : '추천하기'}</span>
            <span className="ml-1.5 font-bold">{post.likes}</span>
          </button>
        </div>
        
        {/* 작성자 프로필 및 관련 글 */}
        <div className={`${isMobile ? 'px-4 py-4 bg-white mt-2' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border" style={{ borderColor: NAVER_COLORS.border }}>
                <AvatarFallback style={{ backgroundColor: '#f0f0f0', color: NAVER_COLORS.lightText }}>
                  {post.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium" style={{ color: NAVER_COLORS.text }}>{post.author}</div>
                <div className="text-xs" style={{ color: NAVER_COLORS.veryLightText }}>
                  게시글 {post.id * 3} · 댓글 {post.id * 5}
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="text-xs h-8 px-3"
              style={{ 
                borderColor: NAVER_COLORS.border,
                color: NAVER_COLORS.text
              }}
              onClick={() => window.open(`/authors/${post.authorId}`, '_blank')}
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              작성자 글 보기
            </Button>
          </div>
          
          {/* 작성자의 다른 글 목록 */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: NAVER_COLORS.border }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: NAVER_COLORS.text }}>
              {post.author}님의 다른 글
            </h3>
            <ul className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  <Link to={`/insurance-analysis/${post.id + i + 1}`} 
                    style={{ color: NAVER_COLORS.text }}
                    className="hover:underline">
                    {i === 0 ? '[책임보험] 코치를 위한 필수 보험 안내' : 
                     i === 1 ? '[의료보험] 축구 부상 후 효과적인 보험 청구 방법' : 
                     '[종합보험] 유소년 축구 선수 맞춤형 보험 상품 비교'}
                  </Link>
                  <span className="ml-2 text-xs" style={{ color: NAVER_COLORS.veryLightText }}>
                    {new Date(Date.now() - (i + 1) * 86400000 * 3).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* 게시글 하단 도구 영역 */}
      <div className={`flex justify-between ${isMobile ? 'px-4' : ''} mb-4`}>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 text-sm"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: NAVER_COLORS.text
            }}
            onClick={() => navigate("/insurance-analysis")}
          >
            <FileText className="mr-1.5 h-4 w-4" />
            목록
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-sm"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: NAVER_COLORS.text
            }}
            onClick={() => window.navigator.clipboard.writeText(window.location.href)}
          >
            <Share2 className="mr-1.5 h-4 w-4" />
            공유
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-9"
                style={{ 
                  borderColor: NAVER_COLORS.border,
                  color: NAVER_COLORS.text
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/insurance-analysis/edit/${post.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>수정하기</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    navigate("/insurance-analysis");
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>삭제하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 댓글 섹션 - 네이버 카페 스타일 */}
      <div className={`${isMobile ? '' : 'bg-white rounded-md shadow-sm border'} mb-4`}
        style={{ borderColor: NAVER_COLORS.border }}>
        {/* 댓글 헤더 */}
        <div className={`${isMobile ? 'px-4 py-3 bg-white' : 'px-6 py-3'} border-b flex items-center`}
          style={{ borderColor: NAVER_COLORS.border }}>
          <MessageSquare className="mr-2 h-4 w-4" style={{ color: NAVER_COLORS.primary }} />
          <h3 className="font-medium text-sm" style={{ color: NAVER_COLORS.text }}>
            댓글 <span style={{ color: NAVER_COLORS.primary }}>{post.commentCount}</span>개
          </h3>
        </div>
        
        {/* 댓글 목록 */}
        <div className={`${isMobile ? 'px-0 mt-2 bg-white' : 'px-6 py-2'}`}>
          {post.comments.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto pr-1">
              {post.comments.map((comment, index) => (
                <div key={comment.id} 
                  className={`py-4 ${index !== 0 ? 'border-t' : ''} ${isMobile ? 'px-4' : ''}`}
                  style={{ borderColor: NAVER_COLORS.border }}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-2 border" style={{ borderColor: NAVER_COLORS.border }}>
                        <AvatarFallback style={{ backgroundColor: '#f0f0f0', color: NAVER_COLORS.lightText }}>
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center flex-wrap">
                          <span className="font-medium text-sm mr-2" style={{ color: NAVER_COLORS.text }}>
                            {comment.author}
                          </span>
                          <span className="text-xs" style={{ color: NAVER_COLORS.veryLightText }}>
                            {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm whitespace-pre-wrap" style={{ color: NAVER_COLORS.text }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-2">
                      <button className="p-1.5 text-xs flex items-center rounded-md"
                        style={{ color: NAVER_COLORS.veryLightText }}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-md"
                            style={{ color: NAVER_COLORS.veryLightText }}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <span className="text-xs">신고하기</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center" style={{ color: NAVER_COLORS.lightText }}>
              <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-30" style={{ color: NAVER_COLORS.lightText }} />
              <p className="text-sm">아직 댓글이 없습니다. 첫 댓글을 작성해 보세요.</p>
            </div>
          )}
        </div>
        
        {/* 댓글 작성 폼 */}
        <div className={`${isMobile ? 'px-4 py-4 bg-white mt-2' : 'px-6 py-4'} border-t`}
          style={{ borderColor: NAVER_COLORS.border }}>
          <form onSubmit={commentForm.handleSubmit(handleSubmitComment)} className="w-full">
            <div className="relative">
              <Textarea
                placeholder="댓글을 남겨보세요"
                className={`resize-none min-h-[80px] pr-[4.5rem] text-sm`}
                style={{ 
                  borderColor: NAVER_COLORS.border,
                  color: NAVER_COLORS.text
                }}
                {...commentForm.register('content')}
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                <div className="text-xs mr-1.5" style={{ color: NAVER_COLORS.veryLightText }}>
                  {commentForm.watch('content')?.length || 0}/1000
                </div>
                <Button 
                  size="sm" 
                  type="submit"
                  disabled={!commentForm.watch('content')}
                  className="h-8 px-3"
                  style={{ 
                    backgroundColor: NAVER_COLORS.primary,
                    color: 'white'
                  }}
                >
                  등록
                </Button>
              </div>
            </div>
            {commentForm.formState.errors.content && (
              <p className="text-sm mt-1" style={{ color: NAVER_COLORS.accent }}>
                {commentForm.formState.errors.content.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* 관련 게시글 - 네이버 카페 스타일 */}
      <div className={`${isMobile ? '' : 'bg-white rounded-md shadow-sm border'} mb-4`}
        style={{ borderColor: NAVER_COLORS.border }}>
        {/* 관련 게시글 헤더 */}
        <div className={`${isMobile ? 'px-4 py-3 bg-white' : 'px-6 py-3'} border-b flex items-center`}
          style={{ borderColor: NAVER_COLORS.border }}>
          <FileText className="mr-2 h-4 w-4" style={{ color: NAVER_COLORS.accent }} />
          <h3 className="font-medium text-sm" style={{ color: NAVER_COLORS.text }}>
            관련 게시글
          </h3>
        </div>
        
        {/* 관련 게시글 목록 */}
        <div className={`${isMobile ? 'px-4 py-3 bg-white mt-2' : 'px-6 py-3'}`}>
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="text-sm">
                <Link to={`/insurance-analysis/${postId + i + 1}`}
                  className="flex items-center hover:underline" 
                  style={{ color: NAVER_COLORS.text }}
                >
                  <span className="text-xs px-1.5 py-0.5 rounded-sm mr-1.5 flex-shrink-0"
                    style={{ 
                      backgroundColor: `${NAVER_COLORS.primary}15`,
                      color: NAVER_COLORS.primary
                    }}>
                    {post.category}
                  </span>
                  <span className="line-clamp-1">
                    {i % 2 === 0 ? '선수 부상 관련 보험금 청구 방법' : '코치를 위한 맞춤형 보험 상품 비교'}
                  </span>
                </Link>
                <div className="flex items-center mt-1 pl-1.5" style={{ color: NAVER_COLORS.veryLightText }}>
                  <span className="text-xs flex-shrink-0">
                    {post.author === '축구보험전문가1' ? '축구보험전문가2' : '축구보험전문가1'}
                  </span>
                  <span className="mx-1 text-xs">·</span>
                  <span className="text-xs">
                    {new Date(Date.now() - (i + 1) * 86400000).toLocaleDateString()}
                  </span>
                  <span className="mx-1 text-xs">·</span>
                  <div className="flex items-center text-xs">
                    <Eye className="h-3 w-3 mr-0.5" />
                    <span>{Math.floor(Math.random() * 50) + 20}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 더보기 버튼 */}
        <div className={`${isMobile ? 'px-4 py-2 bg-white' : 'px-6 py-2'} border-t text-center`}
          style={{ borderColor: NAVER_COLORS.border }}>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs h-8 w-full"
            style={{ 
              borderColor: NAVER_COLORS.border,
              color: NAVER_COLORS.text
            }}
            onClick={() => navigate("/insurance-analysis")}
          >
            {post.category} 관련 글 더보기
          </Button>
        </div>
      </div>
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