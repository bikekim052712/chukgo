import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompanyInfo, insertCompanyInfoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const formSchema = insertCompanyInfoSchema.extend({
  content: z.string().min(10, "본문 내용은 10자 이상이어야 합니다."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CompanyInfoEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const searchParams = new URLSearchParams(window.location.search);
  const defaultSection = searchParams.get("section") || "vision";

  // 기존 회사 정보 가져오기 (편집 모드일 경우)
  const { data: companyInfo, isLoading } = useQuery<CompanyInfo>({
    queryKey: ["/api/company-info", id],
    queryFn: ({ queryKey }) => apiRequest("GET", `${queryKey[0]}/${queryKey[1]}`).then(res => res.json()),
    enabled: !isNew && !!id,
  });

  // 폼 인스턴스 생성
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: defaultSection,
      title: "",
      content: "",
    },
  });

  // 데이터가 로드되면 폼 값 설정
  useEffect(() => {
    if (companyInfo && !isNew) {
      form.reset({
        section: companyInfo.section,
        title: companyInfo.title,
        content: companyInfo.content,
      });
    }
  }, [companyInfo, form, isNew]);

  // 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/company-info", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-info"] });
      toast({
        title: "등록 완료",
        description: "회사 정보가 성공적으로 등록되었습니다.",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "등록 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 업데이트 뮤테이션
  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("PUT", `/api/company-info/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-info"] });
      toast({
        title: "수정 완료",
        description: "회사 정보가 성공적으로 수정되었습니다.",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "수정 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container py-10 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-muted-foreground mb-6">관리자 권한이 필요한 페이지입니다.</p>
          <Button onClick={() => setLocation("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  if (isLoading && !isNew) {
    return (
      <div className="container py-10 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-border mb-4" />
          <p className="text-muted-foreground">회사 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "회사 정보 추가" : "회사 정보 수정"}</CardTitle>
          <CardDescription>
            회사의 소개, 연혁, 비전 및 핵심 가치에 대한 정보를 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>섹션</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="섹션을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vision">비전 및 미션</SelectItem>
                        <SelectItem value="history">회사 연혁</SelectItem>
                        <SelectItem value="values">핵심 가치</SelectItem>
                        <SelectItem value="team">팀 소개</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      정보를 표시할 섹션을 선택하세요.
                    </FormDescription>
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
                      <Input placeholder="제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormDescription>
                      {form.watch("section") === "history" 
                        ? "연혁의 경우 연도나 날짜를 제목으로 쓰는 것이 좋습니다 (예: 2023년 8월 - 축고 서비스 런칭)" 
                        : "제목은 간결하고 명확하게 작성해주세요."}
                    </FormDescription>
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
                        placeholder="내용을 입력하세요"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      자세한 내용을 작성해주세요. 줄바꿈은 그대로 반영됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin")}
                >
                  취소
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isNew ? "등록" : "수정"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}