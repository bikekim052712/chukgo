import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaYoutube, FaBlog, FaApple, FaAndroid } from "react-icons/fa";
import { SiKakao } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-6 pb-6">
      <div className="container mx-auto px-4">
        {/* 앱 다운로드 */}
        <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3 p-4 md:p-5 mb-6 bg-gradient-to-tr from-purple-800 via-indigo-700 to-blue-600 rounded-lg shadow-md">
          {/* 배경 애니메이션 요소 - 더 작게 수정 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white animate-pulse"></div>
            <div className="absolute bottom-5 right-5 w-20 h-20 rounded-full bg-white animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* 텍스트 영역 - 더 작게 수정 */}
          <div className="relative text-center md:text-left z-10 max-w-xs">
            <h3 className="text-lg font-bold text-white mb-1">축고 앱 다운로드</h3>
            <p className="text-white/90 text-sm whitespace-nowrap">언제 어디서나 쉽고 빠르게 유소년 축구 레슨을 찾아보세요</p>
          </div>
          
          {/* 앱 다운로드 버튼 - 더 세련되게 수정 */}
          <div className="relative z-10 flex flex-row gap-2">
            {/* 앱스토어 버튼 */}
            <a href="#" className="group overflow-hidden hover:scale-105 transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white py-1.5 px-3 rounded-lg shadow-md">
              <FaApple className="h-6 w-6 text-white" />
              <div className="flex flex-col justify-center">
                <span className="text-[10px] opacity-80 leading-tight">Download on the</span>
                <span className="text-sm font-semibold leading-tight">App Store</span>
              </div>
            </a>
            
            {/* 구글 플레이 버튼 */}
            <a href="#" className="group overflow-hidden hover:scale-105 transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white py-1.5 px-3 rounded-lg shadow-md">
              <div className="relative">
                <FaAndroid className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] opacity-80 leading-tight">GET IT ON</span>
                <span className="text-sm font-semibold leading-tight">Google Play</span>
              </div>
            </a>
          </div>
        </div>
        
        {/* 메인 푸터 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-[#6b21ff] mb-4">축고</h3>
            <p className="text-gray-600 mb-4 text-sm max-w-xs">
              전문 코치와 함께하는 대한민국 No.1 유소년 축구 레슨 매칭 플랫폼
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>고객센터:</strong> 1588-0000 (평일 10:00-18:00, 주말 휴무)
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#6b21ff] transition duration-300">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b21ff] transition duration-300">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b21ff] transition duration-300">
                <FaYoutube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b21ff] transition duration-300">
                <SiKakao className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#6b21ff] transition duration-300">
                <FaBlog className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">축구 레슨 유형</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lesson-request?type=individual" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">개인레슨</Link></li>
              <li><Link to="/lesson-request?type=group" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">그룹레슨</Link></li>
              <li><Link to="/lesson-request?type=goalkeeper" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">골키퍼레슨</Link></li>
              <li><Link to="/lesson-request?type=running" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">달리기레슨</Link></li>
              <li><Link to="/lesson-request?type=physical" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">피지컬레슨</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">연령대별 레슨</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lesson-request?age=elementary" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">초등학생 레슨</Link></li>
              <li><Link to="/lesson-request?age=middle-school" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">중학생 레슨</Link></li>
              <li><Link to="/lesson-request?age=high-school" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">고등학생 레슨</Link></li>
              <li><Link to="/lesson-request?age=adult" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">성인 레슨</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">축고 정보</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">회사 소개</Link></li>
              <li><Link to="/coach-signup" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">코치 지원하기</Link></li>
              <li><Link to="/guide" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">이용 가이드</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">자주 묻는 질문</Link></li>
              <li><Link to="/partners" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">제휴 및 파트너십</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <ul className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
            <li><Link to="/terms" className="hover:underline font-medium">이용약관</Link></li>
            <li><Link to="/privacy" className="hover:underline font-bold">개인정보처리방침</Link></li>
            <li><Link to="/location-terms" className="hover:underline">위치기반 서비스 이용약관</Link></li>
            <li><Link to="/business-info" className="hover:underline">사업자 정보확인</Link></li>
          </ul>
        
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              주식회사 축고 | 대표: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2023-서울강남-12345호
            </p>
            <p>
              주소: 서울특별시 강남구 테헤란로 123, 축고빌딩 7층 | 대표전화: 1588-0000 | 이메일: help@chukgo.com
            </p>
            <p>
              CHUKGO © {new Date().getFullYear()} 축고 Chukgo Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
