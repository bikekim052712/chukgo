import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/redirect";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
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

  console.log(`API Request: ${method} ${url}`);
  // 인증 관련 요청에는 더 자세한 로깅 추가
  if (url.includes('login') || url.includes('logout') || url.includes('user')) {
    console.log(`인증 요청: ${method} ${url}`, payload ? `데이터: ${JSON.stringify(payload)}` : '데이터 없음');
  }
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(payload ? { "Content-Type": "application/json" } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
    credentials: "include", // 크로스 도메인에서도 쿠키 전송
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = getApiUrl(queryKey[0] as string);
    console.log(`Query Request: ${url}`);
    
    // 인증 관련 요청에는 더 자세한 로깅
    if (url.includes('user') || url.includes('login') || url.includes('logout')) {
      console.log(`인증 상태 확인 요청: ${url}`);
    }
    
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

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // 창이 포커스될 때 데이터 다시 가져오기
      staleTime: 60000, // 1분 동안 캐시 유지
      retry: 1, // 실패 시 1번 재시도
    },
    mutations: {
      retry: false,
    },
  },
});
