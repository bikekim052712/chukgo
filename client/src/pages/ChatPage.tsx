import { useEffect } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = '실시간 채팅 - 축고';
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">실시간 채팅</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          축고 회원들과 실시간으로 대화를 나눠보세요. 축구 이야기, 레슨 정보, 궁금한 점 등을 자유롭게 이야기할 수 있습니다.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <ChatWindow />
        
        <div className="mt-8 max-w-md mx-auto text-sm text-gray-500">
          <h2 className="font-medium text-gray-700 mb-2">채팅 이용 안내</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>실시간으로 다른 회원들과 대화할 수 있습니다.</li>
            <li>비속어, 광고, 스팸 등의 메시지는 제재 대상이 될 수 있습니다.</li>
            <li>개인정보 공유에 주의해 주세요.</li>
            <li>페이지를 벗어나면 채팅 내역이 저장되지 않습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}