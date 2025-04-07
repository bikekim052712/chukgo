/**
 * API 요청을 Replit 서버로 리디렉션하는 함수
 * chukgo.kr 같은 커스텀 도메인에서 API 요청을 처리하기 위함
 */

// 실제 API 서버 URL (Replit 호스팅 URL)
const API_SERVER = "https://soccer-forland-bikekim0527.replit.app";

/**
 * API 엔드포인트에 대한 URL을 반환
 * 
 * 중요: 쿠키 기반 인증 문제로 인해 현재는 모든 환경에서 같은 URL을 사용하도록 수정
 * 이렇게 하면 커스텀 도메인에서도 동일한 인증 상태를 유지할 수 있음
 */
export function getApiUrl(endpoint: string): string {
  // 현재 호스트 확인
  const currentHost = window.location.host;
  
  // 현재 애플리케이션이 실행 중인 호스트 확인
  console.log(`현재 도메인: ${currentHost}`);

  const isReplitDomain = currentHost.includes('.replit.app');
  const isCustomDomain = currentHost === "chukgo.kr" || 
                         currentHost === "www.chukgo.kr";
  
  // 엔드포인트가 이미 슬래시로 시작하면 그대로 사용, 아니면 슬래시 추가
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 관리자 기능은 항상 Replit 앱에서만 사용하도록 안내
  if (isCustomDomain && (endpoint.includes('/api/login') || 
                         endpoint.includes('/api/user') || 
                         endpoint.includes('/api/logout'))) {
    console.log(`관리자 기능은 Replit 앱에서만 사용하세요: ${API_SERVER}`);
    
    // 세션 문제로 인해 Replit 도메인으로 리디렉션
    return `${API_SERVER}${formattedEndpoint}`;
  }
  
  // Replit 도메인이면 상대 경로 사용
  if (isReplitDomain) {
    console.log(`Replit 도메인에서 상대 경로 사용: ${formattedEndpoint}`);
    return formattedEndpoint;
  }
  
  // 그 외의 경우 상대 경로 사용 (크로스 도메인 문제 방지)
  console.log(`상대 경로 사용: ${formattedEndpoint}`);
  return formattedEndpoint;
}