import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/redirect";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      console.error(`API 오류 ${res.status}: `, errorData);
      throw new Error(errorData.message || res.statusText);
    } catch (e) {
      const text = await res.text();
      console.error(`API 오류 ${res.status}: `, text || res.statusText);
      throw new Error(text || `${res.status}: ${res.statusText}`);
    }
  }
}

export async function apiRequest(
  methodOrUrl: string,
  urlOrData?: string | unknown,
  data?: unknown | undefined,
): Promise<any> {
  let method: string = 'GET';
  let url: string;
  let payload: unknown | undefined;

  // Handle overloads
  if (urlOrData && typeof urlOrData === 'string') {
    // Called with (method, url, data)
    method = methodOrUrl;
    url = getApiUrl(urlOrData);
    payload = data;
  } else {
    // Called with (url, data)
    url = getApiUrl(methodOrUrl);
    payload = urlOrData;
  }

  console.log(`API 요청: ${method} ${url}`, payload ? JSON.stringify(payload) : '');
  
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(payload ? { "Content-Type": "application/json" } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
      credentials: "include", // 크로스 도메인에서도 쿠키 전송
    });

    if (!res.ok) {
      await throwIfResNotOk(res);
    }
    
    const responseData = await res.json();
    console.log(`API 응답: ${method} ${url}`, responseData);
    return responseData;
  } catch (error) {
    console.error(`API 요청 실패: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = getApiUrl(queryKey[0] as string);
    console.log(`쿼리 요청: ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include", // 크로스 도메인에서도 쿠키 전송
      });

      // 인증 실패 처리
      if (res.status === 401) {
        console.log(`인증 실패 (401): ${url}`);
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
      }

      if (!res.ok) {
        await throwIfResNotOk(res);
      }
      
      const data = await res.json();
      console.log(`쿼리 응답: ${url}`, data);
      return data;
    } catch (error) {
      console.error(`쿼리 요청 실패: ${url}`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 60000, // 1분 동안 캐시 유지
      retry: 1, // 실패 시 1번 재시도
    },
    mutations: {
      retry: false,
    },
  },
});
