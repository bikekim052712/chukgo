/**
 * API 요청을 Replit 서버로 리디렉션하는 함수
 * chukgo.kr 같은 커스텀 도메인에서 API 요청을 처리하기 위함
 */

// 실제 API 서버 URL (Replit 호스팅 URL)
const API_SERVER = "https://soccer-forland-bikekim0527.replit.app";

/**
 * API 엔드포인트에 대한 URL을 반환
 * 커스텀 도메인에서는 Replit 서버로 리디렉션, 그 외에는 상대 경로 사용
 */
export function getApiUrl(endpoint: string): string {
  const isCustomDomain = window.location.hostname === "chukgo.kr" || 
                         window.location.hostname === "www.chukgo.kr";
  
  // 커스텀 도메인인 경우 Replit 서버로 리디렉션
  if (isCustomDomain) {
    // 엔드포인트가 이미 슬래시로 시작하면 그대로 사용, 아니면 슬래시 추가
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_SERVER}${formattedEndpoint}`;
  }
  
  // 그 외의 경우 상대 경로 사용
  return endpoint;
}