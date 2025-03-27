import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiKakao } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">축구레슨</h3>
            <p className="text-neutral-400 mb-4">
              전문 코치와 함께하는 맞춤형 축구 교육 플랫폼
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition duration-300">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-300">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-300">
                <FaYoutube className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-300">
                <SiKakao className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><Link href="/coaches" className="text-neutral-400 hover:text-white transition duration-300">코치 찾기</Link></li>
              <li><Link href="/lessons" className="text-neutral-400 hover:text-white transition duration-300">레슨 예약</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">팀 코칭</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">기업 프로그램</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">축구 캠프</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">회사 소개</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">회사 소개</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">코치 지원</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">파트너십</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">채용 정보</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">블로그</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li><Link href="#faq" className="text-neutral-400 hover:text-white transition duration-300">자주 묻는 질문</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">이용 가이드</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">이용약관</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-white transition duration-300">개인정보처리방침</Link></li>
              <li><Link href="#contact" className="text-neutral-400 hover:text-white transition duration-300">문의하기</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6">
          <p className="text-neutral-500 text-center text-sm">
            &copy; {new Date().getFullYear()} 축구레슨 주식회사. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
