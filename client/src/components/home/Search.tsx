import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon, UserRound, Users, Calendar, MapPin } from "lucide-react";
import { LessonType, SkillLevel } from "@shared/schema";

export default function Search() {
  const [location, setLocation] = useState("all");
  const [lessonTypeId, setLessonTypeId] = useState("all");
  const [skillLevelId, setSkillLevelId] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [, navigate] = useLocation();

  const { data: lessonTypes = [] } = useQuery<LessonType[]>({
    queryKey: ["/api/lesson-types"],
  });

  const { data: skillLevels = [] } = useQuery<SkillLevel[]>({
    queryKey: ["/api/skill-levels"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location && location !== "all") params.append("location", location);
    if (lessonTypeId && lessonTypeId !== "all") params.append("lessonTypeId", lessonTypeId);
    if (skillLevelId && skillLevelId !== "all") params.append("skillLevelId", skillLevelId);
    if (ageGroup && ageGroup !== "all") params.append("ageGroup", ageGroup);
    
    navigate(`/lessons?${params.toString()}`);
  };

  return (
    <section id="search" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">우리 아이에게 맞는 축구 코치 찾기</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-8">
          아이의 나이, 레벨, 지역에 맞는 코치를 빠르게 찾고 예약하세요
        </p>
        
        <div className="max-w-5xl mx-auto bg-neutral-50 rounded-2xl p-6 md:p-8 shadow-md border border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="flex items-center text-neutral-700 text-sm font-medium mb-2">
                <MapPin className="h-4 w-4 mr-1 text-primary" /> 지역
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full bg-white border-neutral-200">
                  <SelectValue placeholder="모든 지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 지역</SelectItem>
                  <SelectItem value="서울">서울</SelectItem>
                  <SelectItem value="경기">경기</SelectItem>
                  <SelectItem value="인천">인천</SelectItem>
                  <SelectItem value="부산">부산</SelectItem>
                  <SelectItem value="대구">대구</SelectItem>
                  <SelectItem value="대전">대전</SelectItem>
                  <SelectItem value="광주">광주</SelectItem>
                  <SelectItem value="울산">울산</SelectItem>
                  <SelectItem value="세종">세종</SelectItem>
                  <SelectItem value="강원">강원</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="flex items-center text-neutral-700 text-sm font-medium mb-2">
                <UserRound className="h-4 w-4 mr-1 text-primary" /> 연령대
              </label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger className="w-full bg-white border-neutral-200">
                  <SelectValue placeholder="모든 연령" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 연령</SelectItem>
                  <SelectItem value="5-7">5-7세 (미취학)</SelectItem>
                  <SelectItem value="8-10">8-10세 (초등 저학년)</SelectItem>
                  <SelectItem value="11-13">11-13세 (초등 고학년)</SelectItem>
                  <SelectItem value="14-16">14-16세 (중학생)</SelectItem>
                  <SelectItem value="17-19">17-19세 (고등학생)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="flex items-center text-neutral-700 text-sm font-medium mb-2">
                <Users className="h-4 w-4 mr-1 text-primary" /> 레슨 유형
              </label>
              <Select value={lessonTypeId} onValueChange={setLessonTypeId}>
                <SelectTrigger className="w-full bg-white border-neutral-200">
                  <SelectValue placeholder="모든 레슨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 레슨</SelectItem>
                  {lessonTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="flex items-center text-neutral-700 text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 mr-1 text-primary" /> 레벨
              </label>
              <Select value={skillLevelId} onValueChange={setSkillLevelId}>
                <SelectTrigger className="w-full bg-white border-neutral-200">
                  <SelectValue placeholder="모든 레벨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 레벨</SelectItem>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-7">
            <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base">
              <SearchIcon className="mr-2 h-5 w-5" /> 코치 찾기
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-neutral-500">
            현재 전국 <span className="font-bold text-primary">253명</span>의 검증된 유소년 축구 코치가 활동 중입니다
          </div>
        </div>
      </div>
    </section>
  );
}
