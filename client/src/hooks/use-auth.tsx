import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { getApiUrl } from "@/lib/redirect";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
  registerCoachMutation: UseMutationResult<SelectUser, Error, RegisterCoachData>;
  socialLogin: (provider: 'kakao' | 'naver') => void;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  role: "user" | "coach";
  licenseNumber?: string;
};

type RegisterCoachData = {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  licenseNumber: string;
  specializations?: string[];
  location?: string;
  experience?: string;
  bio?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인에 실패했습니다.");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setLocation("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }
      
      return response.json();
    },
  });

  const registerCoachMutation = useMutation({
    mutationFn: async (data: RegisterCoachData) => {
      const response = await apiRequest("/api/auth/coach-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role: "coach",
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "코치 회원가입에 실패했습니다.");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "코치 가입 신청 완료",
        description: "가입 신청이 접수되었습니다. 검토 후 승인 결과를 안내해 드리겠습니다.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "가입 신청 실패",
        description: error.message || "가입 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setLocation("/login");
    },
  });

  const socialLogin = (provider: 'kakao' | 'naver') => {
    const apiUrl = getApiUrl(`/api/auth/${provider}`);
    window.location.href = apiUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        registerCoachMutation,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}