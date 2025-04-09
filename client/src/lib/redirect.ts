/**
 * API 요청을 서버로 리디렉션하는 함수
 * chukgo.kr 같은 커스텀 도메인에서 API 요청을 처리하기 위함
 */

// 로컬 개발 환경용 API 서버 URL
export const API_SERVER = 'http://localhost:4000';

// 허용 도메인 목록
export const ALLOWED_DOMAINS = [
  "http://localhost:4000",
  "http://localhost:3000"
];

// 관리자 계정 정보
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

// 도메인 관련 함수
export function isCustomDomain(): boolean {
  return false; // 로컬 개발에서는 항상 false
}

export function isReplitDomain(): boolean {
  return false; // 로컬 개발에서는 항상 false
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
 */
export function getApiUrl(endpoint: string): string {
  // 엔드포인트가 이미 슬래시로 시작하면 그대로 사용, 아니면 슬래시 추가
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 로컬 개발 환경
  return `${API_SERVER}${formattedEndpoint}`;
}