import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CompanyInfo } from "@shared/schema";
import { Loader2, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompanyInfoListPage() {
  // 회사 정보 데이터 가져오기
  const { data: companyInfos, isLoading, error } = useQuery<CompanyInfo[]>({
    queryKey: ["/api/company-info"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 min-h-[60vh] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !companyInfos) {
    return (
      <div className="container mx-auto py-16 px-4 min-h-[60vh] flex flex-col justify-center items-center">
        <Info className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">정보를 불러올 수 없습니다</h1>
        <p className="text-gray-600 mb-4">회사 정보를 불러오는 중 문제가 발생했습니다.</p>
        <Button asChild>
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (companyInfos.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 min-h-[60vh] flex flex-col justify-center items-center">
        <Info className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">회사 소개 정보</h1>
        <p className="text-gray-600 mb-4">관리자 페이지에서 회사 소개 정보를 추가해 주세요.</p>
        <Button asChild>
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">회사 소개</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          축고는 학부모와 학생들에게 검증된 축구 코치를 연결해주는 플랫폼입니다.
          아래에서 축고에 대한 다양한 정보를 확인하실 수 있습니다.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyInfos.map((info) => (
          <Card key={info.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="line-clamp-2">{info.title}</CardTitle>
              <CardDescription>
                {info.section && getKoreanSectionName(info.section)}
                {info.updatedAt && ` · ${formatDate(new Date(info.updatedAt).toISOString())}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-3 whitespace-pre-line">
                {info.content}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link to={`/company-info/${info.id}`}>
                  자세히 보기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 섹션 이름을 한글로 변환하는 함수
function getKoreanSectionName(section: string): string {
  const sectionMap: Record<string, string> = {
    'history': '회사 연혁',
    'vision': '비전 및 미션',
    'values': '핵심 가치',
    'team': '팀 소개',
    'news': '뉴스',
    'guide': '이용 가이드',
    'faq': '자주 묻는 질문',
    'policy': '정책 및 약관',
    'link': '관련 정보',
  };

  return sectionMap[section] || '기타 정보';
}

// 날짜 포맷 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
}