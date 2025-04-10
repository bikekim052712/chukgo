import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// 프로필 완성 폼 검증 스키마
const profileCompleteSchema = z.object({
  username: z.string().min(3, "아이디는 3자 이상이어야 합니다."),
  fullName: z.string().min(2, "이름은 2자 이상이어야 합니다.").optional(),
  phoneNumber: z
    .string()
    .regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, "올바른 휴대폰 번호를 입력해 주세요."),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "이용약관에 동의해 주세요.",
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해 주세요.",
  }),
});

type ProfileCompleteFormValues = z.infer<typeof profileCompleteSchema>;

export default function ProfileComplete() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [provider, setProvider] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // URL에서 소셜 로그인 프로바이더 정보 가져오기
    const params = new URLSearchParams(window.location.search);
    const socialProvider = params.get("provider");
    setProvider(socialProvider);
    
    // 로그인 상태가 아니거나 소셜 프로바이더 정보가 없으면 로그인 페이지로 리다이렉트
    if (!user || !socialProvider) {
      setLocation("/login");
    }
  }, [user, setLocation]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileCompleteFormValues>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: {
      username: user?.username?.startsWith(provider || '') ? '' : user?.username || "",
      fullName: user?.fullName || "",
      phoneNumber: user?.phone || "",
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  const onSubmit = async (data: ProfileCompleteFormValues) => {
    try {
      setIsSubmitting(true);
      
      // 프로필 업데이트 API 호출
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          phone: data.phoneNumber,
          fullName: data.fullName,
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "프로필 업데이트에 실패했습니다.");
      }
      
      toast({
        title: "프로필 완성 성공",
        description: "추가 정보가 성공적으로 저장되었습니다.",
      });
      
      // 메인 페이지로 리다이렉트
      setLocation("/");
    } catch (error) {
      toast({
        title: "프로필 업데이트 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const providerLabel = provider === "kakao" ? "카카오" : "네이버";
  const providerColor = provider === "kakao" ? "warning" : "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">프로필 완성하기</h2>
          <p className="mt-2 text-sm text-gray-600">
            {providerLabel} 로그인 이후 필요한 추가 정보를 입력해 주세요
          </p>
          <div className="mt-2 flex justify-center">
            <Badge 
              variant={providerColor as any}
              className="text-sm"
            >
              {providerLabel} 로그인 완료
            </Badge>
          </div>
          
          {user.email && (
            <div className="mt-4 text-sm">
              <span className="font-medium">가입 이메일:</span> {user.email}
            </div>
          )}
        </div>
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 아이디 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                아이디 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="사용할 아이디를 입력해 주세요"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
            </div>
            
            {/* 이름 */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  placeholder="실명을 입력해 주세요"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  {...register("fullName")}
                  defaultValue={user.fullName || ""}
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
            
            {/* 이용약관 동의 */}
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
                    <span className="text-purple-600 font-medium">[필수]</span> 이용약관 동의
                  </label>
                </div>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
              )}
            </div>
            
            {/* 개인정보 처리방침 동의 */}
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
                    <span className="text-purple-600 font-medium">[필수]</span> 개인정보 처리방침 동의
                  </label>
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
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#5D3FD3] hover:bg-[#4C2CB3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 animate-spin">⟳</span>
                  처리 중...
                </>
              ) : (
                "프로필 완성하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 