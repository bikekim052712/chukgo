import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { CompanyInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // 회사 정보 관련 쿼리
  const { data: companyInfos, isLoading: isLoadingCompanyInfo } = useQuery<CompanyInfo[]>({
    queryKey: ["/api/company-info"],
  });

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

  // 섹션별로 분류
  const history = companyInfos?.filter(info => info.section === "history") || [];
  const vision = companyInfos?.filter(info => info.section === "vision") || [];
  const values = companyInfos?.filter(info => info.section === "values") || [];
  const team = companyInfos?.filter(info => info.section === "team") || [];

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <Button variant="outline" onClick={() => setLocation("/")}>사이트로 돌아가기</Button>
      </div>

      <Tabs defaultValue="company-info" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="company-info">회사 정보 관리</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="lessons">레슨 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="company-info" className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">회사 정보 관리</h2>
            <Button onClick={() => setLocation("/admin/company-info/new")}>
              <Plus className="mr-2 h-4 w-4" />
              새 정보 추가
            </Button>
          </div>

          {isLoadingCompanyInfo ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>비전</CardTitle>
                  <CardDescription>회사의 비전 및 미션 관련 정보</CardDescription>
                </CardHeader>
                <CardContent>
                  {vision.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      아직 비전 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vision.map(info => (
                        <div key={info.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{info.title}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {info.content.substring(0, 100)}
                              {info.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/company-info/${info.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setLocation("/admin/company-info/new?section=vision")}>
                    <Plus className="mr-2 h-4 w-4" />
                    비전 추가
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>회사 연혁</CardTitle>
                  <CardDescription>회사의 주요 연혁 및 이벤트</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      아직 연혁 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map(info => (
                        <div key={info.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{info.title}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {info.content.substring(0, 100)}
                              {info.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/company-info/${info.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setLocation("/admin/company-info/new?section=history")}>
                    <Plus className="mr-2 h-4 w-4" />
                    연혁 추가
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>핵심 가치</CardTitle>
                  <CardDescription>회사의 핵심 가치 및 원칙</CardDescription>
                </CardHeader>
                <CardContent>
                  {values.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      아직 핵심 가치 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {values.map(info => (
                        <div key={info.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{info.title}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {info.content.substring(0, 100)}
                              {info.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/company-info/${info.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setLocation("/admin/company-info/new?section=values")}>
                    <Plus className="mr-2 h-4 w-4" />
                    핵심 가치 추가
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>팀 소개</CardTitle>
                  <CardDescription>핵심 팀원 및 리더십 소개</CardDescription>
                </CardHeader>
                <CardContent>
                  {team.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      아직 팀 소개 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {team.map(info => (
                        <div key={info.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{info.title}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {info.content.substring(0, 100)}
                              {info.content.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/company-info/${info.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setLocation("/admin/company-info/new?section=team")}>
                    <Plus className="mr-2 h-4 w-4" />
                    팀 소개 추가
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">사용자 관리</h2>
          </div>
          <div className="p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">준비 중입니다</h3>
            <p className="text-muted-foreground">사용자 관리 기능은 현재 개발 중입니다.</p>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">레슨 관리</h2>
          </div>
          <div className="p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">준비 중입니다</h3>
            <p className="text-muted-foreground">레슨 관리 기능은 현재 개발 중입니다.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}