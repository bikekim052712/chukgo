import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaYoutube, FaBlog, FaApple, FaAndroid } from "react-icons/fa";
import { SiKakao } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-6 pb-6">
      <div className="container mx-auto px-4">
        {/* 앱 다운로드 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 mb-6 bg-gray-50 rounded-lg">
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-gray-800">축고 앱 다운로드</h3>
            <p className="text-sm text-gray-600 mt-1">언제 어디서나 쉽고 빠르게 유소년 축구 레슨을 찾아보세요</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-black text-white py-2 px-4 rounded-md">
              <FaApple className="h-5 w-5" />
              <span className="text-sm">App Store</span>
            </button>
            <button className="flex items-center gap-2 bg-black text-white py-2 px-4 rounded-md">
              <FaAndroid className="h-5 w-5" />
              <span className="text-sm">Google Play</span>
            </button>
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
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">개인 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">그룹 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">골키퍼 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">기술 집중 훈련</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">축구 체력 훈련</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">연령대별 레슨</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">초등학생 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">중학생 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">고등학생 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">성인 레슨</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">엘리트 선수 훈련</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">축고 정보</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">회사 소개</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">코치 지원하기</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">이용 가이드</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">자주 묻는 질문</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#6b21ff] transition duration-300">제휴 및 파트너십</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <ul className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
            <li><Link href="#" className="hover:underline font-medium">이용약관</Link></li>
            <li><Link href="#" className="hover:underline font-bold">개인정보처리방침</Link></li>
            <li><Link href="#" className="hover:underline">위치기반 서비스 이용약관</Link></li>
            <li><Link href="#" className="hover:underline">사업자 정보확인</Link></li>
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
