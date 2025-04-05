import { useQuery } from "@tanstack/react-query";
import { CompanyInfo } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CalendarClock, Target, Award } from "lucide-react";

export default function AboutUs() {
  const { data: companyInfos, isLoading } = useQuery<CompanyInfo[]>({
    queryKey: ["/api/company-info"],
  });

  if (isLoading) {
    return <AboutUsSkeleton />;
  }

  // 섹션별로 분류
  const history = companyInfos?.filter(info => info.section === "history") || [];
  const vision = companyInfos?.filter(info => info.section === "vision") || [];
  const values = companyInfos?.filter(info => info.section === "values") || [];
  const team = companyInfos?.filter(info => info.section === "team") || [];

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">축고 소개</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          축고는 학부모와 학생들에게 검증된 축구 코치를 연결해주는 플랫폼입니다. 
          우리의 미션, 비전, 그리고 핵심 가치에 대해 알아보세요.
        </p>
      </div>

      <Tabs defaultValue="vision" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="vision" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            <span>비전</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2" />
            <span>연혁</span>
          </TabsTrigger>
          <TabsTrigger value="values" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            <span>핵심 가치</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>팀 소개</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vision" className="py-6">
          <h2 className="text-2xl font-bold mb-6">비전 및 미션</h2>
          {vision.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 비전 정보가 없습니다.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {vision.map(info => (
                <CompanyInfoCard key={info.id} info={info} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="py-6">
          <h2 className="text-2xl font-bold mb-6">회사 연혁</h2>
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 연혁 정보가 없습니다.
            </div>
          ) : (
            <div className="space-y-6">
              {history.map(info => (
                <CompanyInfoCard key={info.id} info={info} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="values" className="py-6">
          <h2 className="text-2xl font-bold mb-6">핵심 가치</h2>
          {values.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 핵심 가치 정보가 없습니다.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {values.map(info => (
                <CompanyInfoCard key={info.id} info={info} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="team" className="py-6">
          <h2 className="text-2xl font-bold mb-6">팀 소개</h2>
          {team.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 팀 소개 정보가 없습니다.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {team.map(info => (
                <CompanyInfoCard key={info.id} info={info} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CompanyInfoCard({ info }: { info: CompanyInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{info.title}</CardTitle>
        <CardDescription>{info.section === "history" ? new Date(info.updatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line">
          {info.content}
        </div>
      </CardContent>
    </Card>
  );
}

function AboutUsSkeleton() {
  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto mt-2" />
      </div>
      
      <div className="w-full border rounded-lg p-1 mb-6">
        <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      
      <div className="py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-32 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}