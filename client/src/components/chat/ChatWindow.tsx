import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  userId?: number;
  username: string;
  message: string;
  timestamp: string;
  isSelf?: boolean;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 웹소켓 연결
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // 웹소켓 연결
    socket.current = new WebSocket(wsUrl);
    
    // 연결 성공 이벤트
    socket.current.onopen = () => {
      console.log('WebSocket 연결 성공');
      setConnected(true);
      toast({
        title: "채팅 서버 연결됨",
        description: "축고 채팅 서버에 연결되었습니다."
      });
    };
    
    // 메시지 수신 이벤트
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('메시지 수신:', data);
      
      switch (data.type) {
        case 'connection':
          // 연결 메시지는 표시하지 않음
          break;
        case 'chat':
          addMessage({
            id: new Date().getTime().toString(),
            userId: data.userId,
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
            isSelf: false
          });
          break;
        case 'error':
          toast({
            title: "오류",
            description: data.message,
            variant: "destructive"
          });
          break;
      }
    };
    
    // 에러 처리
    socket.current.onerror = (error) => {
      console.error('WebSocket 에러:', error);
      toast({
        title: "연결 오류",
        description: "채팅 서버 연결 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    };
    
    // 연결 종료 처리
    socket.current.onclose = () => {
      console.log('WebSocket 연결 종료');
      setConnected(false);
      toast({
        title: "연결 종료",
        description: "채팅 서버와의 연결이 종료되었습니다."
      });
    };
    
    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [toast]);
  
  // 메시지 추가 함수
  const addMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };
  
  // 메시지 전송 함수
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !socket.current || socket.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    // 임시 사용자 정보 (실제 인증 시스템 연동 필요)
    const userId = 1;
    const username = "게스트";
    
    // 현재 시간
    const timestamp = new Date().toISOString();
    
    // 메시지 객체 생성
    const messageObj = {
      type: 'chat',
      userId,
      username,
      message: message.trim(),
      timestamp
    };
    
    // 웹소켓으로 메시지 전송
    socket.current.send(JSON.stringify(messageObj));
    
    // 메시지 목록에 추가 (자신의 메시지)
    addMessage({
      id: new Date().getTime().toString(),
      userId,
      username,
      message: message.trim(),
      timestamp,
      isSelf: true
    });
    
    // 입력창 초기화
    setMessage("");
  };
  
  // 메시지 목록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-center text-primary">
          축고 실시간 채팅
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] p-4">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isSelf && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${msg.username}`} />
                      <AvatarFallback>{msg.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] ${msg.isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                    {!msg.isSelf && (
                      <div className="font-medium text-xs mb-1">{msg.username}</div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground p-4">
                채팅 메시지가 없습니다. 첫 메시지를 보내보세요!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 pt-2">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!connected}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!connected || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}