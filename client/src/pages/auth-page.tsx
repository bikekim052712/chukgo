import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(3, "사용자 이름은 3자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

const registerSchema = z.object({
  username: z.string().min(3, "사용자 이름은 3자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
  fullName: z.string().min(2, "이름을 입력해주세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, socialLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // 이미 로그인한 경우 메인 페이지로 리다이렉트
  if (user) {
    return <Redirect to="/" />;
  }

  // 로그인 폼
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 회원가입 폼
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
    },
  });

  // 로그인 폼 제출
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // 회원가입 폼 제출
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      ...data,
      isCoach: false,
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] gap-6 py-10">
      {/* 폼 섹션 */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="register">회원가입</TabsTrigger>
              </TabsList>
              
              {/* 로그인 폼 */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사용자 이름</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "로그인 중..." : "로그인"}
                    </Button>
                    
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">또는</span>
                      </div>
                    </div>
                    
                    {/* 소셜 로그인 버튼 */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        type="button"
                        variant="kakao"
                        className="w-full"
                        onClick={() => socialLogin('kakao')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M10 2C4.48 2 0 5.38 0 9.5C0 12.02 1.56 14.19 3.93 15.46C3.75 16.09 3.28 18.1 3.23 18.37C3.17 18.74 3.44 18.75 3.63 18.62C3.78 18.51 6.21 16.83 7.15 16.16C8.07 16.31 9.02 16.39 10 16.39C15.52 16.39 20 13.01 20 8.89C20 4.77 15.52 2 10 2Z" fill="#191919"/>
                        </svg>
                        카카오 로그인
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="naver"
                        className="w-full"
                        onClick={() => socialLogin('naver')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M18.1245 0H1.875C0.839466 0 0 0.839466 0 1.875V18.125C0 19.1605 0.839466 20 1.875 20H18.1245C19.1605 20 19.9999 19.1605 19.9999 18.125V1.875C20 0.839466 19.1605 0 18.1245 0Z" fill="#03C75A"/>
                          <path d="M11.8148 10.2499L8.0148 5H5.5V15H8.1852V9.7499L12.0148 15H14.5V5H11.8148V10.2499Z" fill="white"/>
                        </svg>
                        네이버 로그인
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              {/* 회원가입 폼 */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사용자 이름</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "가입 중..." : "회원가입"}
                    </Button>
                    
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">소셜 계정으로 간편 가입</span>
                      </div>
                    </div>
                    
                    {/* 소셜 회원가입 버튼 */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        type="button"
                        variant="kakao"
                        className="w-full"
                        onClick={() => socialLogin('kakao')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M10 2C4.48 2 0 5.38 0 9.5C0 12.02 1.56 14.19 3.93 15.46C3.75 16.09 3.28 18.1 3.23 18.37C3.17 18.74 3.44 18.75 3.63 18.62C3.78 18.51 6.21 16.83 7.15 16.16C8.07 16.31 9.02 16.39 10 16.39C15.52 16.39 20 13.01 20 8.89C20 4.77 15.52 2 10 2Z" fill="#191919"/>
                        </svg>
                        카카오로 회원가입
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="naver"
                        className="w-full"
                        onClick={() => socialLogin('naver')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M18.1245 0H1.875C0.839466 0 0 0.839466 0 1.875V18.125C0 19.1605 0.839466 20 1.875 20H18.1245C19.1605 20 19.9999 19.1605 19.9999 18.125V1.875C20 0.839466 19.1605 0 18.1245 0Z" fill="#03C75A"/>
                          <path d="M11.8148 10.2499L8.0148 5H5.5V15H8.1852V9.7499L12.0148 15H14.5V5H11.8148V10.2499Z" fill="white"/>
                        </svg>
                        네이버로 회원가입
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* 소개 섹션 */}
      <div className="flex-1 flex flex-col justify-center p-6 bg-muted/50 rounded-lg">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            축구 코치 매칭 서비스, 축고
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            한국 최대 유소년 축구 플랫폼에 오신 것을 환영합니다!
          </p>
          <div className="space-y-4 text-muted-foreground">
            <p>
              축고 서비스를 통해 다양한 전문 축구 코치들을 만나보세요. 
              여러분의 목표와 수준에 맞는 최적의 코치를 찾아드립니다.
            </p>
            <p>
              개인 맞춤형 레슨부터 그룹 코칭까지, 모든 연령대와 실력 수준에 
              적합한 다양한 프로그램을 제공합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>검증된 전문 코치진</li>
              <li>1:1 맞춤형 코칭</li>
              <li>투명한 가격 정책</li>
              <li>편리한 일정 관리</li>
              <li>안전한 결제 시스템</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}