import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
  category?: string;
};

export default function FAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "유소년 축구 레슨은 몇 살부터 시작할 수 있나요?",
      answer: "일반적으로 5세부터 시작 가능합니다. 이 나이의 아이들은 기본적인 움직임과 간단한 규칙을 이해할 수 있으며, 재미있는 게임 형식의 훈련으로 축구의 기초를 배울 수 있습니다. 만 5세 미만의 아이들은 신체 조절 능력과 집중력이 충분히 발달하지 않아 정규 레슨보다는 놀이 중심의 신체 활동을 권장합니다.",
      category: "레슨 정보"
    },
    {
      question: "아이가 축구를 처음 접하는데, 어떤 코스가 적합한가요?",
      answer: "처음 접하는 아이들에게는 '유소년 축구 기초 교실'이나 '미취학 아동 축구 입문' 같은 기초 프로그램이 적합합니다. 이러한 프로그램은 재미있는 게임과 활동을 통해 기본적인 축구 기술(공 다루기, 패스, 드리블)을 가르치며, 신체 협응력과 사회성 발달에도 도움을 줍니다. 경쟁보다는 참여와 즐거움에 중점을 두어 축구에 대한 긍정적인 첫 경험을 제공합니다.",
      category: "레슨 정보"
    },
    {
      question: "그룹 레슨과 개인 레슨 중 어떤 것이 더 효과적인가요?",
      answer: "두 형태 모두 장단점이 있습니다. 그룹 레슨(4-8명)은 또래와의 상호작용, 팀워크 발달, 실전 경기 경험에 좋으며 비용도 저렴합니다. 개인 레슨은 아이의 개별 수준과 성향에 맞춘 집중 지도가 가능하고 빠른 실력 향상을 기대할 수 있습니다. 아이의 나이, 성격, 목표에 따라 선택하거나, 두 가지 방식을 병행하는 것도 좋은 방법입니다.",
      category: "레슨 유형"
    },
    {
      question: "레슨은 어떤 방식으로 진행되나요?",
      answer: "유소년 축구 레슨은 연령대별로 다르게 진행됩니다. 5-7세는 30-45분 동안 게임 형식의 재미있는 활동으로 기본 동작을 익히고, 8-10세는 60분 수업으로 기본기와 간단한 전술을 배웁니다. 11-13세부터는 포지션별 역할과 팀 전술을 배우며, 90분 동안 실전 경기 위주로 진행됩니다. 모든 수업은 준비운동, 기술 훈련, 게임 또는 경기, 정리운동의 구조로 이루어지며, 아이들의 집중력을 고려해 다양한 활동을 번갈아 진행합니다.",
      category: "레슨 정보"
    },
    {
      question: "레슨 예약과 취소는 어떻게 하나요?",
      answer: "레슨 예약은 웹사이트나 앱에서 간편하게 할 수 있습니다. 원하는 지역, 코치, 연령대, 레슨 유형을 선택하고 가능한 일정 중에서 예약하면 됩니다. 정기 레슨은 한 번 예약으로 매주 같은 시간에 자동 예약됩니다. 취소는 레슨 48시간 전까지 무료이며, 그 이후에는 레슨비의 50%가 취소 수수료로 부과됩니다. 악천후로 인한 취소는 코치가 결정하며 이 경우 전액 환불 또는 일정 변경이 가능합니다.",
      category: "예약 및 결제"
    },
    {
      question: "아이에게 필요한 장비는 무엇인가요?",
      answer: "기본적으로 편안한 운동복, 축구양말, 신가드(정강이 보호대), 그리고 연령에 맞는 축구화가 필요합니다. 초보자나 어린 아이(5-7세)는 처음에는 일반 운동화도 괜찮습니다. 물통과 수건도 준비해주세요. 축구공은 코치가 제공하지만, 집에서 연습용으로 적절한 사이즈(5-8세는 3호, 9-13세는 4호, 14세 이상은 5호)의 공을 준비하면 좋습니다. 날씨에 따라 모자, 장갑, 가벼운 재킷 등도 필요할 수 있습니다.",
      category: "레슨 준비"
    },
    {
      question: "코치는 어떤 자격을 갖추고 있나요?",
      answer: "모든 코치는 엄격한 검증 과정을 거쳐 선발됩니다. 대한축구협회(KFA) 지도자 자격증을 보유하고 있으며, 유소년 지도 경험이 풍부합니다. 또한 응급처치 자격증, 아동 안전 교육 이수 등 안전 관련 자격도 필수적으로 갖추고 있습니다. 각 코치의 세부 자격, 경력, 전문 분야는 프로필에서 확인 가능하며, 학부모와 아이들의 지속적인 피드백을 통해 코치의 수업 품질을 관리하고 있습니다.",
      category: "코치 정보"
    },
    {
      question: "비가 오거나 날씨가 안 좋을 때는 어떻게 하나요?",
      answer: "가벼운 비나 추위는 레슨을 진행하되 운동 강도를 조절합니다. 단, 폭우, 폭염, 미세먼지 경보, 혹한 등 아이들의 건강에 위험한 상황에서는 레슨을 취소하거나 실내 활동으로 대체합니다. 취소 결정은 레슨 시작 2시간 전까지 문자와 앱 알림으로 통보되며, 이 경우 전액 환불 또는 보강 수업으로 대체됩니다. 일부 코치는 날씨가 안 좋을 때를 대비한 실내 대체 프로그램(이론 교육, 축구 영상 분석 등)을 운영하므로 코치 프로필에서 확인해보세요.",
      category: "레슨 정보"
    }
  ];

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-3">
          <HelpCircle className="text-primary mr-2 h-6 w-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">학부모님이 자주 묻는 질문</h2>
        </div>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          유소년 축구 레슨에 대한 궁금한 점들을 모았습니다
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 font-medium hover:no-underline">
                  <div className="text-left flex items-start">
                    <span className="flex-grow">{item.question}</span>
                    {item.category && (
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full ml-2 mt-1 whitespace-nowrap">
                        {item.category}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 pt-0 text-neutral-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-10 text-center">
            <p className="text-neutral-600">
              더 궁금한 점이 있으신가요? <a href="#contact" className="text-primary font-medium">문의하기</a>를 통해 질문해주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}