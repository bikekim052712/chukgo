import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// 글 작성 스키마 정의
const insurancePostSchema = z.object({
  title: z.string().min(2, "제목은 2자 이상이어야 합니다.").max(100, "제목은 100자 이하여야 합니다."),
  content: z.string().min(10, "내용은 10자 이상이어야 합니다."),
});

type InsurancePost = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
};

type InsurancePostFormValues = z.infer<typeof insurancePostSchema>;

export default function InsuranceAnalysis() {
  const { toast } = useToast();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // 글 목록 불러오기
  const { data: posts, isLoading } = useQuery<InsurancePost[]>({
    queryKey: ["/api/insurance-posts"],
    queryFn: () => {
      // 임시로 더미 데이터 반환
      return Promise.resolve([
        {
          id: 1,
          title: "자녀 축구 다이렉트 보험 상품 분석",
          content: "축구를 하는 자녀를 위한 다이렉트 보험 상품에 대한 상세 분석입니다. 이 보험은 경기 중 부상에 대한 보장을 제공하며...",
          author: "김보험",
          createdAt: "2025-03-10T12:00:00Z",
          imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 2,
          title: "청소년 스포츠 종합보험 비교",
          content: "다양한 청소년 스포츠 종합보험 상품을 비교 분석했습니다. A사의 경우 축구 부상에 대한 보장이 더 높은 반면, B사는...",
          author: "박애널리스트",
          createdAt: "2025-03-05T14:30:00Z"
        },
        {
          id: 3,
          title: "축구부 단체보험 가입시 주의사항",
          content: "학교나 동호회에서 축구부 단체보험 가입시 반드시 확인해야 할 사항들을 정리했습니다. 특히 보장 범위와 면책 조항에 대해서...",
          author: "이컨설턴트",
          createdAt: "2025-02-28T09:15:00Z",
          imageUrl: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
      ]);
    }
  });

  // 폼 설정
  const form = useForm<InsurancePostFormValues>({
    resolver: zodResolver(insurancePostSchema),
    defaultValues: {
      title: "",
      content: ""
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
  const handleCreatePost = (data: InsurancePostFormValues) => {
    setIsCreatingPost(true);
    
    // 실제 API 연동 시 여기에 구현
    // 현재는 임시로 setTimeout으로 처리
    setTimeout(() => {
      setIsCreatingPost(false);
      form.reset();
      setSelectedImage(null);
      toast({
        title: "글 작성 완료",
        description: "보험 분석 글이 성공적으로 등록되었습니다.",
      });
    }, 1000);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">보험보장분석</h1>
        <p className="text-lg text-gray-600">
          축구와 관련된 다양한 보험 상품 분석 및 보장 내용을 확인하세요
        </p>
      </div>

      {/* 글 작성 폼 */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">보험 분석 게시물 작성</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePost)} className="space-y-6">
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
                      placeholder="보험 분석 내용을 상세히 작성해주세요" 
                      className="min-h-[200px]"
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
            
            <Button type="submit" className="w-full" disabled={isCreatingPost}>
              {isCreatingPost ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  게시물 작성 중...
                </>
              ) : (
                "게시물 작성"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* 글 목록 */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">보험 분석 게시물</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                    <span>{post.author}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <Button variant="outline" className="w-full">
                    자세히 보기
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>아직 작성된 보험 분석 게시물이 없습니다.</p>
            <p className="mt-2">첫 번째 게시물을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}