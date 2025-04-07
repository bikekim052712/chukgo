import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { CompanyInfo } from "@shared/schema";
import { useEffect } from "react";

export default function CompanyInfoList() {
  // 회사 정보 목록 가져오기
  const { data: companyInfos, isLoading, error, refetch } = useQuery<CompanyInfo[]>({
    queryKey: ['/api/company-info'],
    queryFn: () => fetch('/api/company-info').then(res => {
      if (!res.ok) throw new Error("회사 정보를 불러오는데 실패했습니다.");
      return res.json();
    }),
    staleTime: 10000, // 10초 동안 캐시 유지
  });
  
  // 컴포넌트가 마운트될 때마다 데이터 다시 가져오기
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !companyInfos) {
    return (
      <div className="text-sm text-gray-500 py-2">
        회사 정보를 불러올 수 없습니다.
      </div>
    );
  }

  if (companyInfos.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <h3 className="text-sm font-bold text-gray-900 mb-2">최신 회사 정보</h3>
      <ul className="space-y-1">
        {companyInfos.map((info) => (
          <li key={info.id}>
            <Link
              to={`/company-info/${info.id}`}
              className="text-gray-600 hover:text-primary transition duration-300 text-sm"
            >
              {info.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}