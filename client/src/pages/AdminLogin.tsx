import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LockKeyhole, User, Key, LogIn, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { User as SelectUser } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(3, "아이디는 3글자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { loginMutation } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("로그인 시도:", data);
      
      // 직접 API 요청 방식으로 시도
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("로그인 응답 에러:", response.status, errorText);
        throw new Error(errorText || "로그인 실패");
      }
      
      const userData = await response.json();
      console.log("로그인 성공, 사용자 데이터:", userData);
      
      // 쿼리 캐시 수동 업데이트
      queryClient.setQueryData(["/api/user"], userData);
      
      if (userData.isAdmin) {
        // 관리자 페이지로 이동
        toast({
          title: "관리자 로그인 성공",
          description: `${userData.fullName}님, 환영합니다!`,
        });
        setLocation("/admin");
      } else {
        // 관리자 권한이 없으면 홈으로 이동
        setLocation("/");
        toast({
          title: "접근 권한 없음",
          description: "관리자 권한이 필요합니다.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
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
        <p className="text-center text-gray-600 mb-8">
          관리자 전용 페이지입니다. 회사 정보 관리, 리뷰 관리, 사용자 관리 등의 작업을 수행할 수 있습니다.
        </p>
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