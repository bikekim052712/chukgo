import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, isCustomDomain, getAdminUrl } from "@/lib/redirect"; // 리디렉션 함수들 추가
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LockKeyhole, User, Key, LogIn, Shield } from "lucide-react";
import { User as SelectUser } from "@shared/schema";

// 로그인 폼 유효성 검사 스키마
const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  // 커스텀 도메인에서 접속 시 Replit 도메인으로 바로 리디렉션
  useEffect(() => {
    if (isCustomDomain()) {
      console.log("커스텀 도메인에서 접속 감지, Replit 도메인으로 자동 리디렉션");
      
      // 단일 사인온 토큰 생성 (timestamp + 랜덤값 hash)
      const timestamp = new Date().getTime();
      const randomValue = Math.random().toString(36).substring(2, 15);
      const token = `${timestamp}_${randomValue}`;
      
      // localStorage에 토큰 저장 (크로스 도메인 문제 없음)
      localStorage.setItem('admin_auth_token', token);
      
      // 토큰과 함께 Replit 도메인으로 리디렉션
      const redirectUrl = getAdminUrl("/admin-login") + `?token=${token}`;
      window.location.href = redirectUrl;
    } else {
      // Replit 도메인에서 토큰 확인
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        console.log("인증 토큰 감지, 자동 로그인 시도");
        // URL에서 토큰 파라미터 제거 (보안)
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 자동 로그인 시도
        handleAutoLogin();
      }
    }
  }, []);
  
  // 자동 로그인 함수
  const handleAutoLogin = async () => {
    try {
      setIsLoading(true);
      console.log("자동 로그인 시도 중...");
      
      // admin_auto_login 쿠키 설정 (자동 로그인 활성화)
      document.cookie = "admin_auto_login=true; path=/; max-age=86400; secure; samesite=none";
      
      // 자동 로그인 시도 - 리디렉션 함수 사용
      const apiUrl = getApiUrl("/api/login");
      console.log("자동 로그인 API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "AdminLogin", // 자동 로그인을 위한 특별 헤더 추가
          "X-Cross-Domain-Login": "true" // 크로스 도메인 로그인 식별자
        },
        body: JSON.stringify({ username: "admin", password: "admin123" }), // 기본 관리자 계정 정보 사용
        credentials: "include",
      });
      
      console.log("자동 로그인 응답:", response.status, response.statusText);
      
      if (!response.ok) {
        console.log("자동 로그인 실패:", response.status);
        toast({
          title: "자동 로그인 실패",
          description: "직접 로그인해 주세요.",
          variant: "destructive",
        });
        
        // 쿠키 제거
        document.cookie = "admin_auto_login=; path=/; max-age=0; secure; samesite=none";
        return;
      }
      
      const userData = await response.json();
      console.log("자동 로그인 성공:", userData);
      
      // 쿼리 캐시 업데이트
      queryClient.setQueryData(["/api/user"], userData);
      
      // 관리자 계정인 경우 관리자 페이지로 이동
      if (userData.isAdmin) {
        toast({
          title: "관리자 로그인 성공",
          description: `${userData.fullName || '관리자'}님, 환영합니다!`,
        });
        
        setTimeout(() => setLocation("/admin"), 500);
      } else {
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        });
        
        // 쿠키 제거
        document.cookie = "admin_auto_login=; path=/; max-age=0; secure; samesite=none";
      }
    } catch (error) {
      console.error("자동 로그인 중 오류 발생:", error);
      toast({
        title: "로그인 오류",
        description: "서버와의 연결에 문제가 있습니다.",
        variant: "destructive",
      });
      
      // 쿠키 제거
      document.cookie = "admin_auto_login=; path=/; max-age=0; secure; samesite=none";
    } finally {
      setIsLoading(false);
    }
  };
  
  // 폼 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: "admin123",
    },
  });

  // 로그인 처리 함수
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // API 요청 - 리디렉션 함수 사용
      console.log("로그인 요청 전송:", data);
      const apiUrl = getApiUrl("/api/login");
      console.log("API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "AdminLogin" // 자동 로그인을 위한 특별 헤더 추가
        },
        body: JSON.stringify(data),
        mode: "cors",
        credentials: "include",
      });
      
      console.log("로그인 응답:", response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = "로그인에 실패했습니다";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // 로그인 성공
      const userData = await response.json();
      console.log("로그인 성공:", userData);
      
      // admin_auto_login 쿠키 설정 (자동 로그인 활성화)
      document.cookie = "admin_auto_login=true; path=/; max-age=86400; secure; samesite=none";
      
      // 쿼리 캐시 업데이트
      queryClient.setQueryData(["/api/user"], userData);
      
      if (userData.isAdmin) {
        toast({
          title: "관리자 로그인 성공",
          description: `${userData.fullName || '관리자'}님, 환영합니다!`,
        });
        
        // 지연 후 이동
        setTimeout(() => setLocation("/admin"), 500);
      } else {
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        });
        setLocation("/");
      }
    } catch (error: any) {
      console.error("로그인 오류:", error);
      toast({
        title: "로그인 실패",
        description: error.message || "아이디 또는 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:w-1/2 max-w-md px-8 flex flex-col items-center mb-10 md:mb-0">
        <div className="bg-primary/10 p-3 rounded-full mb-6">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">축고 관리자 시스템</h1>
        <p className="text-center text-gray-600 mb-6">
          관리자 전용 페이지입니다. 회사 정보 관리, 리뷰 관리, 사용자 관리 등의 작업을 수행할 수 있습니다.
        </p>
        
        {isCustomDomain() ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 w-full max-w-sm shadow-lg mb-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-amber-100 rounded-full mt-1">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">중요 안내</h3>
                <p className="text-sm text-amber-700 mb-3">
                  쿠키 인증 문제로 인해 관리자 기능은 Replit 도메인에서만 정상 작동합니다.
                </p>
                <a 
                  href={getAdminUrl("/admin-login")}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-800 underline hover:text-amber-600"
                >
                  Replit 페이지에서 로그인하기
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 w-full max-w-sm shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">안전한 로그인</h3>
                <p className="text-sm text-gray-500">모든 데이터는 암호화되어 안전하게 보호됩니다</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-0">
        <CardHeader className="space-y-2 pb-2">
          <div className="mx-auto bg-primary/10 p-2 rounded-full mb-2">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">관리자 로그인</CardTitle>
          <CardDescription className="text-center">
            관리자 계정으로 로그인하여 시스템을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                아이디
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  {...register("username")}
                  className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                비밀번호
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  {...register("password")}
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full mt-6 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>로그인 중... <User className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>로그인 <LogIn className="ml-2 h-4 w-4" /></>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleAutoLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>자동 로그인 중... <User className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>자동 로그인 <Key className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <div className="w-full text-center text-sm">
            <p className="text-gray-600 font-medium mb-1">테스트 계정 정보</p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4 text-gray-500" />
                <span className="font-mono">admin</span>
              </div>
              <div className="flex items-center">
                <Key className="mr-1 h-4 w-4 text-gray-500" />
                <span className="font-mono">admin123</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}