import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// 아이콘 불러오기
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { FaCheck, FaAngleRight } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";

// 지역 데이터
const PROVINCES = [
  "서울특별시", "부산광역시", "인천광역시", "대구광역시", "광주광역시",
  "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도",
  "충청북도", "충청남도", "전라북도", "전라남도", "경상북도",
  "경상남도", "제주특별자치도"
];

// 전문 분야 데이터
const SPECIALIZATIONS = [
  "개인 레슨", "그룹 레슨", "골키퍼 트레이닝", "유소년 코칭",
  "피지컬 트레이닝", "전술 분석", "슈팅 클리닉", "피니싱", "수비 기술"
];

// 코치 회원가입 폼 검증 스키마
const coachSignupSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
  username: z.string().min(3, "아이디는 3자 이상이어야 합니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  phoneNumber: z
    .string()
    .regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, "올바른 휴대폰 번호를 입력해 주세요."),
  licenseNumber: z.string().min(1, "라이센스 번호를 입력해 주세요."),
  province: z.string().optional(),
  district: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  experience: z.string().optional(),
  introduction: z.string().optional(),
  personalHistory: z.string().optional(),
  certifications: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해 주세요.",
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해 주세요.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

type CoachSignupFormValues = z.infer<typeof coachSignupSchema>;

export default function CoachSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { registerCoachMutation, socialLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  // 도/광역시별 시군구 데이터
  const DISTRICTS: Record<string, string[]> = {
    "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "부산광역시": ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"],
    "인천광역시": ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"],
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CoachSignupFormValues>({
    resolver: zodResolver(coachSignupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      licenseNumber: "",
      specializations: [],
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  // 지역 변경 시 처리
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setValue("province", province);
    setValue("district", ""); // 상세 지역 초기화
    
    // 선택된 광역시/도에 해당하는 시군구 목록 업데이트
    if (province && DISTRICTS[province]) {
      setAvailableDistricts(DISTRICTS[province]);
    } else {
      setAvailableDistricts([]);
    }
  };
  
  // 전문 분야 토글
  const toggleSpecialization = (specialization: string) => {
    setSpecializations(prev => {
      const newSpecializations = prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization];
      
      setValue("specializations", newSpecializations);
      return newSpecializations;
    });
  };

  const onSubmit = async (data: CoachSignupFormValues) => {
    setIsLoading(true);
    try {
      // API 요청에 필요한 데이터만 추출
      const { confirmPassword, agreeTerms, agreePrivacy, ...requestData } = data;
      
      // 실제 API 연동 시 구현
      await apiRequest("/api/auth/coach-register", {
        method: "POST",
        body: JSON.stringify(requestData),
      });
      
      // 성공 메시지 표시
      toast({
        title: "코치 가입 신청 완료",
        description: "가입 신청이 접수되었습니다. 검토 후 승인 결과를 안내해 드리겠습니다.",
      });
      
      // 홈페이지로 이동
      setLocation("/");
    } catch (error) {
      console.error("Coach signup error:", error);
      toast({
        title: "가입 신청 실패",
        description: "가입 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "축구 코치 활동으로 부수입 창출",
    "자유로운 시간 관리와 일정 조율",
    "축구 지도 경력 및 포트폴리오 구축",
    "다양한 학생들과의 교류 기회",
    "코치 프로필 무료 홍보",
    "간편한 레슨 관리 시스템"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* 왼쪽 섹션: 혜택 설명 */}
          <div className="md:col-span-5 lg:col-span-4 bg-white p-8 rounded-lg shadow-sm self-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">코치로 활동하면</h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                이미 회원이신가요?{" "}
                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
          
          {/* 오른쪽 섹션: 가입 폼 */}
          <div className="md:col-span-7 lg:col-span-8 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">축고 코치 가입하기</h2>
            <p className="text-gray-600 mb-6">축구 코칭 실력을 펼치고 함께 성장해보세요</p>
            
            <div className="flex flex-col space-y-4 mb-8">
              <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
                <RiKakaoTalkFill className="w-5 h-5 mr-2 text-black" />
                <span className="text-black font-medium">카카오로 시작하기</span>
              </button>
              
              <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <SiNaver className="w-4 h-4 mr-2 text-white" />
                <span className="text-white font-medium">네이버로 시작하기</span>
              </button>
            </div>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는 이메일로 가입하기</span>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">기본 정보</h3>
                
                {/* 이메일 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="example@soomgo.com"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 비밀번호 */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      placeholder="영문, 숫자, 특수문자 조합 8자 이상"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 비밀번호 확인 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    비밀번호 확인 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호를 다시 입력해 주세요"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 이름 */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      type="text"
                      placeholder="이름을 입력해 주세요"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 휴대폰 번호 */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    휴대폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="'-' 없이 숫자만 입력해 주세요"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phoneNumber ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 코치 정보 */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">코치 정보</h3>
                
                {/* 활동 지역 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 광역시/도 */}
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      광역시/도 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="province"
                        className={`block w-full px-3 py-2 border ${
                          errors.province ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                        {...register("province")}
                        onChange={handleProvinceChange}
                      >
                        <option value="">광역시/도 선택</option>
                        {PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 시군구 */}
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      시/군/구 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="district"
                        className={`block w-full px-3 py-2 border ${
                          errors.district ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                        disabled={!selectedProvince}
                        {...register("district")}
                      >
                        <option value="">시/군/구 선택</option>
                        {availableDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 전문 분야 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전문 분야 (복수 선택 가능) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SPECIALIZATIONS.map((specialization) => (
                      <div
                        key={specialization}
                        onClick={() => toggleSpecialization(specialization)}
                        className={`cursor-pointer px-4 py-2 rounded border ${
                          specializations.includes(specialization)
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {specialization}
                      </div>
                    ))}
                  </div>
                  {errors.specializations && (
                    <p className="mt-1 text-sm text-red-600">{errors.specializations.message}</p>
                  )}
                </div>
                
                {/* 경력 */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    축구 코칭 경력 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="experience"
                      className={`block w-full px-3 py-2 border ${
                        errors.experience ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("experience")}
                    >
                      <option value="1년 미만">1년 미만</option>
                      <option value="1-3년">1-3년</option>
                      <option value="3-5년">3-5년</option>
                      <option value="5-10년">5-10년</option>
                      <option value="10년 이상">10년 이상</option>
                    </select>
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 자기소개 */}
                <div>
                  <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">
                    자기소개 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="introduction"
                      rows={4}
                      placeholder="축구 코칭 경력, 실력, 지도 방식 등을 자세히 소개해 주세요."
                      className={`block w-full px-3 py-2 border ${
                        errors.introduction ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("introduction")}
                    />
                    {errors.introduction && (
                      <p className="mt-1 text-sm text-red-600">{errors.introduction.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 개인 이력 */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">개인 이력</h3>
                
                {/* 개인 이력 */}
                <div>
                  <label htmlFor="personalHistory" className="block text-sm font-medium text-gray-700">
                    축구 이력 및 선수 경험 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="personalHistory"
                      rows={4}
                      placeholder="선수 경력, 수상 내역, 참가한 대회 등 축구와 관련된 개인 이력을 자세히 적어주세요."
                      className={`block w-full px-3 py-2 border ${
                        errors.personalHistory ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("personalHistory")}
                    />
                    {errors.personalHistory && (
                      <p className="mt-1 text-sm text-red-600">{errors.personalHistory.message}</p>
                    )}
                  </div>
                </div>
                
                {/* 자격증 */}
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                    보유 자격증 (선택)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="certifications"
                      rows={2}
                      placeholder="축구 관련 자격증이 있다면 입력해 주세요. (예: AFC C급 라이센스, 생활체육지도자 자격증 등)"
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                      {...register("certifications")}
                    />
                  </div>
                </div>
              </div>
              
              {/* 약관 동의 */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">약관 동의</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        {...register("agreeTerms")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                        <span className="text-red-500">[필수]</span> 이용약관 동의
                      </label>
                      <Link href="/terms" className="text-purple-600 ml-2 inline-flex items-center">
                        보기 <FaAngleRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreePrivacy"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        {...register("agreePrivacy")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreePrivacy" className="font-medium text-gray-700">
                        <span className="text-red-500">[필수]</span> 개인정보 처리방침 동의
                      </label>
                      <Link href="/privacy" className="text-purple-600 ml-2 inline-flex items-center">
                        보기 <FaAngleRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                  {errors.agreePrivacy && (
                    <p className="text-sm text-red-600">{errors.agreePrivacy.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#5D3FD3] hover:bg-[#4C2CB3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isLoading ? "처리 중..." : "코치 가입 신청하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}