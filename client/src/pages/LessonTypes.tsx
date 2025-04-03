import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { LessonType } from "@shared/schema";
import { CalendarDays, Clock, Users, MapPin, ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonTypes() {
  const { data: lessonTypes, isLoading } = useQuery<LessonType[]>({
    queryKey: ['/api/lesson-types'],
  });

  return (
    <div className="bg-white pb-16">
      {/* 헤더 배너 */}
      <div className="relative bg-[#5D3FD3] py-12 px-4 mb-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-white text-3xl font-bold mb-3">축고의 다양한 레슨 유형</h1>
          <p className="text-white opacity-90 max-w-xl">
            개인 맞춤형 레슨부터 그룹 클래스까지 다양한 방식으로 축구 실력을 향상시켜 보세요
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* 경로 표시 */}
        <div className="flex items-center text-sm text-gray-500 mb-8 gap-2">
          <Link href="/" className="hover:text-[#5D3FD3]">홈</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-800 font-medium">레슨 유형</span>
        </div>

        {/* 레슨 유형 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // 로딩 스켈레톤
            Array(6).fill(0).map((_, index) => <LessonTypeSkeleton key={index} />)
          ) : lessonTypes && lessonTypes.length > 0 ? (
            // 레슨 유형 카드
            lessonTypes.map((lessonType) => (
              <LessonTypeCard key={lessonType.id} lessonType={lessonType} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">등록된 레슨 유형이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 맞춤형 레슨 안내 */}
        <div className="mt-16 bg-[#F5F3FF] p-8 rounded-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">나에게 맞는 레슨을 찾지 못하셨나요?</h2>
              <p className="text-gray-600 mb-6">
                개인 맞춤형 레슨부터 특별한 기술 향상을 위한 전문 코칭까지, 축고의 코치들은 다양한 맞춤형 레슨을 제공합니다. 
                지금 원하는 레슨이 없다면 레슨 요청 페이지에서 상담을 신청하세요.
              </p>
              <div className="flex gap-4">
                <Link href="/coaches/search">
                  <Button className="bg-[#5D3FD3] hover:bg-[#4C2CB3]">
                    코치 찾기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/request">
                  <Button variant="outline" className="border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#F0EBFF]">
                    맞춤 레슨 요청하기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">인기 맞춤형 레슨 요청</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] mr-3">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    형제들을 위한 그룹 레슨
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] mr-3">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    주말 전문 축구 트레이닝
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] mr-3">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    골키퍼 전문 트레이닝
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] mr-3">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    지정 장소 방문 레슨
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] mr-3">
                      <CalendarDays className="h-3.5 w-3.5" />
                    </div>
                    학교 방학 집중 캠프
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonTypeCard({ lessonType }: { lessonType: LessonType }) {
  const getImageUrl = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "개인 레슨":
        return "https://images.pexels.com/photos/6998744/pexels-photo-6998744.jpeg?auto=compress&cs=tinysrgb&w=600";
      case "그룹 레슨":
        return "https://images.pexels.com/photos/8224957/pexels-photo-8224957.jpeg?auto=compress&cs=tinysrgb&w=600";
      case "온라인 레슨":
        return "https://images.pexels.com/photos/5989927/pexels-photo-5989927.jpeg?auto=compress&cs=tinysrgb&w=600";
      case "주말 클래스":
        return "https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=600";
      case "방학 캠프":
        return "https://images.pexels.com/photos/8224795/pexels-photo-8224795.jpeg?auto=compress&cs=tinysrgb&w=600";
      case "기술 특화 훈련":
        return "https://images.pexels.com/photos/6764835/pexels-photo-6764835.jpeg?auto=compress&cs=tinysrgb&w=600";
      default:
        return "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=600";
    }
  };

  const getIcon = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "개인 레슨":
        return <Users className="h-5 w-5" />;
      case "그룹 레슨":
        return <Users className="h-5 w-5" />;
      case "온라인 레슨":
        return <BookOpen className="h-5 w-5" />;
      case "주말 클래스":
        return <CalendarDays className="h-5 w-5" />;
      case "방학 캠프":
        return <MapPin className="h-5 w-5" />;
      case "기술 특화 훈련":
        return <Clock className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(lessonType.name)}
          alt={lessonType.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-5 w-full">
          <h3 className="text-xl font-bold text-white mb-1">{lessonType.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-sm mb-5 h-[60px]">
          {lessonType.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="bg-[#F0EBFF] p-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-[#5D3FD3] text-white flex items-center justify-center">
              {getIcon(lessonType.name)}
            </div>
          </div>
          <Link href={`/lessons/search?type=${lessonType.id}`}>
            <Button className="bg-[#5D3FD3] hover:bg-[#4C2CB3]">
              레슨 보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LessonTypeSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <Skeleton className="h-48 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-5" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}