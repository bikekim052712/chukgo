import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { CompanyInfo } from "@shared/schema";

export default function CompanyInfoPage() {
  // URL에서 ID 파라미터 가져오기
  const { id } = useParams<{ id: string }>();
  
  // 회사 정보 데이터 가져오기
  const { data: companyInfo, isLoading, error } = useQuery<CompanyInfo>({
    queryKey: ['/api/company-info', id],
    queryFn: () => fetch(`/api/company-info/${id}`).then(res => {
      if (!res.ok) throw new Error("회사 정보를 불러오는데 실패했습니다.");
      return res.json();
    }),
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !companyInfo) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">오류 발생</h1>
        <p className="text-gray-600 mt-2">요청하신 회사 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{companyInfo.title}</h1>
        <div className="text-sm text-gray-500 mt-2">
          작성일: {new Date(companyInfo.updatedAt || Date.now()).toLocaleDateString('ko-KR')}
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: companyInfo.content.replace(/\n/g, '<br>') }}
        />
      </div>
      
      {companyInfo.section === 'link' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">관련 정보</h2>
          <p className="text-gray-700">
            이 문서는 상세 정보를 포함하고 있습니다.
          </p>
        </div>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <a 
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          &larr; 홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}