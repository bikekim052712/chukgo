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
import { Search as SearchIcon } from "lucide-react";
import { LessonType, SkillLevel } from "@shared/schema";

export default function Search() {
  const [location, setLocation] = useState("all");
  const [lessonTypeId, setLessonTypeId] = useState("all");
  const [skillLevelId, setSkillLevelId] = useState("all");
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
    
    navigate(`/lessons?${params.toString()}`);
  };

  return (
    <section id="search" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">나에게 맞는 축구 레슨 찾기</h2>
        
        <div className="max-w-4xl mx-auto bg-neutral-100 rounded-xl p-5 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-neutral-600 text-sm font-medium mb-2">지역</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full bg-white">
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-neutral-600 text-sm font-medium mb-2">레슨 유형</label>
              <Select value={lessonTypeId} onValueChange={setLessonTypeId}>
                <SelectTrigger className="w-full bg-white">
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
            
            <div className="flex-1">
              <label className="block text-neutral-600 text-sm font-medium mb-2">레벨</label>
              <Select value={skillLevelId} onValueChange={setSkillLevelId}>
                <SelectTrigger className="w-full bg-white">
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
          
          <div className="mt-6">
            <Button onClick={handleSearch} className="w-full">
              <SearchIcon className="mr-2 h-4 w-4" /> 레슨 검색하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
