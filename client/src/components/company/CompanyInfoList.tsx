import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { CompanyInfo } from "@shared/schema";

export default function CompanyInfoList() {
  // 회사 정보 목록 가져오기
  const { data: companyInfos, isLoading, error } = useQuery<CompanyInfo[]>({
    queryKey: ['/api/company-info'],
    queryFn: () => fetch('/api/company-info').then(res => {
      if (!res.ok) throw new Error("회사 정보를 불러오는데 실패했습니다.");
      return res.json();
    }),
  });

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
    return (
      <div className="text-sm text-gray-500 py-2">
        등록된 회사 정보가 없습니다.
      </div>
    );
  }

  return (
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
  );
}