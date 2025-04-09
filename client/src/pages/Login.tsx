import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// 로고 아이콘 불러오기
import { SiKakao } from "react-icons/si";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

// 폼 검증 스키마
const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해 주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const { loginMutation, socialLogin } = useAuth();
  
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
    loginMutation.mutate(data, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  };
  
  const handleKakaoLogin = () => {
    socialLogin("kakao");
  };

  const handleNaverLogin = () => {
    socialLogin("naver");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                아이디
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="아이디를 입력해 주세요"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해 주세요."
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#5D3FD3] hover:bg-[#4C2CB3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loginMutation.isPending ? "로그인 중..." : "이메일 로그인"}
            </button>
          </div>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <Link href="/find-email" className="hover:text-purple-500">
              이메일 찾기
            </Link>
            <span>|</span>
            <Link href="/find-password" className="hover:text-purple-500">
              비밀번호 찾기
            </Link>
          </div>
        </form>
        
        <div className="flex flex-col space-y-4 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">소셜 계정으로 로그인</span>
            </div>
          </div>
          
          <button 
            onClick={handleKakaoLogin}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            <RiKakaoTalkFill className="w-5 h-5 mr-2 text-black" />
            <span className="text-black font-medium">카카오로 시작하기</span>
          </button>
          
          <button 
            onClick={handleNaverLogin}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <SiNaver className="w-4 h-4 mr-2 text-white" />
            <span className="text-white font-medium">네이버로 시작하기</span>
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            아직 회원이 아니신가요?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}