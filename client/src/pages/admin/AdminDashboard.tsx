import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CompanyInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Building2, 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  Settings, 
  LogOut, 
  FileText, 
  History, 
  Star, 
  Users2 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
          <div className="bg-red-100 p-3 rounded-full mb-6">
            <Building2 className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-muted-foreground mb-6">관리자 권한이 필요한 페이지입니다.</p>
          <div className="flex space-x-4">
            <Button onClick={() => setLocation("/admin-login")}>
              <Building2 className="mr-2 h-4 w-4" />
              관리자 로그인
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>
              홈으로 돌아가기
            </Button>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* 사이드바 */}
        <div className="w-full md:w-64 bg-white shadow-sm md:min-h-screen">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">축고 관리자</h1>
            </div>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>{user?.fullName?.charAt(0) || 'A'}</AvatarFallback>
                {user?.profileImage && <AvatarImage src={user.profileImage} />}
              </Avatar>
              <div>
                <p className="font-medium">{user?.fullName || '관리자'}</p>
                <Badge variant="outline" className="mt-1 text-xs">관리자</Badge>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="px-4 py-2 mb-1">
              <p className="text-xs font-semibold text-gray-400 uppercase">메뉴</p>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setLocation("/admin")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                대시보드
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setLocation("/admin/company-info/new")}>
                <FileText className="h-4 w-4 mr-2" />
                회사 정보
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                사용자 관리
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ListTodo className="h-4 w-4 mr-2" />
                레슨 관리
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-1 px-3">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setLocation("/")}>
                <LogOut className="h-4 w-4 mr-2" />
                사이트로 돌아가기
              </Button>
            </div>
          </div>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">관리자 대시보드</h1>
                <p className="text-gray-500 mt-1">회사 정보와 사용자 및 레슨을 관리할 수 있습니다.</p>
              </div>
            </div>

            <Tabs defaultValue="company-info" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="company-info" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  회사 정보 관리
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  사용자 관리
                </TabsTrigger>
                <TabsTrigger value="lessons" className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-2" />
                  레슨 관리
                </TabsTrigger>
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
        </div>
      </div>
    </div>
  );
}