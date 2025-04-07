/**
 * API 요청을 Replit 서버로 리디렉션하는 함수
 * chukgo.kr 같은 커스텀 도메인에서 API 요청을 처리하기 위함
 */

// 실제 API 서버 URL (Replit 호스팅 URL)
export const API_SERVER = "https://soccer-forland-bikekim0527.replit.app";

// 특정 도메인 간 허용 목록
export const ALLOWED_DOMAINS = [
  "https://www.chukgo.kr", 
  "https://chukgo.kr",
  "https://soccer-forland-bikekim0527.replit.app"
];

// 관리자 계정 정보
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

// 추가 도메인 헬퍼 함수
export function isCustomDomain(): boolean {
  const currentHost = window.location.hostname;
  return currentHost === "chukgo.kr" || currentHost === "www.chukgo.kr";
}

export function isReplitDomain(): boolean {
  const currentHost = window.location.hostname;
  return currentHost.includes('.replit.app') || currentHost.includes('.repl.co');
}

// 인증 관련 엔드포인트인지 확인
export function isAuthEndpoint(endpoint: string): boolean {
  return endpoint.includes('/api/login') || 
         endpoint.includes('/api/user') || 
         endpoint.includes('/api/logout') ||
         endpoint.includes('/api/register');
}

// 관리자 페이지 URL 생성
export function getAdminUrl(path: string = "/admin-login"): string {
  return `${API_SERVER}${path}`;
}

/**
 * API 엔드포인트에 대한 URL을 반환
 * 
 * 중요: 쿠키 기반 인증 문제로 인해 인증 관련 엔드포인트는 
 * 커스텀 도메인에서 Replit 도메인으로 리디렉션합니다.
 */
export function getApiUrl(endpoint: string): string {
  // 현재 호스트 확인
  const currentHost = window.location.hostname;
  
  // 현재 애플리케이션이 실행 중인 호스트 확인
  console.log(`현재 도메인: ${currentHost}`);

  // 엔드포인트가 이미 슬래시로 시작하면 그대로 사용, 아니면 슬래시 추가
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 모든 도메인에서 모든 API 요청을 항상 Replit 서버로 리디렉션
  // 크로스 도메인 문제를 해결하기 위한 직접적인 방법
  if (isCustomDomain()) {
    console.log(`API 요청을 Replit 서버로 리디렉션: ${API_SERVER}${formattedEndpoint}`);
    return `${API_SERVER}${formattedEndpoint}`;
  }
  
  // 일반 요청은 현재 도메인 기준 상대 경로 사용
  console.log(`상대 경로 사용: ${formattedEndpoint}`);
  return formattedEndpoint;
}