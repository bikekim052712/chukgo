import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "레슨은 어떤 방식으로 진행되나요?",
      answer: "레슨은 개인, 그룹, 팀 단위로 진행됩니다. 개인 레슨은 1:1로 진행되며, 그룹 레슨은 최대 5-8명까지, 팀 레슨은 팀 단위로 진행됩니다. 모든 레슨은 실제 필드에서 진행되며, 필요에 따라 이론 교육도 병행합니다. 레슨 시간은 보통 1-2시간으로, 코치와 협의하여 조정 가능합니다."
    },
    {
      question: "초보자도 참여할 수 있나요?",
      answer: "네, 물론입니다! 우리 플랫폼은 모든 레벨의 학습자를 위한 레슨을 제공합니다. 특히 \"기초부터 배우는 축구 입문 코스\"는 축구를 처음 접하는 분들을 위해 설계되었습니다. 코치들은 학습자의 수준에 맞춰 개인화된 교육을 제공하며, 기초부터 차근차근 알려드립니다."
    },
    {
      question: "레슨 예약과 취소는 어떻게 하나요?",
      answer: "레슨 예약은 웹사이트나 앱을 통해 간편하게 할 수 있습니다. 원하는 코치와 프로그램을 선택한 후, 가능한 일정 중에서 선택하시면 됩니다. 취소는 레슨 48시간 전까지 가능하며, 그 이후 취소 시에는 취소 수수료가 발생할 수 있습니다. 자세한 취소 정책은 각 코치의 프로필에서 확인하실 수 있습니다."
    },
    {
      question: "필요한 장비는 무엇인가요?",
      answer: "기본적으로 축구화, 운동복, 신가드(정강이 보호대)가 필요합니다. 대부분의 레슨에서는 공과 훈련 장비는 코치가 제공합니다. 특수한 장비가 필요한 경우, 레슨 설명에 명시되어 있거나 예약 확정 후 안내해 드립니다. 초보자의 경우, 처음에는 운동화로도 참여 가능하며, 지속적인 참여를 원하시면 축구화 구매를 권장합니다."
    },
    {
      question: "코치는 어떤 자격을 갖추고 있나요?",
      answer: "모든 코치는 엄격한 검증 과정을 거쳐 선발됩니다. 대부분 AFC 또는 KFA 코칭 라이센스를 보유하고 있으며, 프로 선수 경력이나 코칭 경험이 풍부합니다. 각 코치의 프로필에서 자격증, 경력, 전문 분야 등 상세 정보를 확인하실 수 있습니다. 또한 모든 코치는 정기적인 평가와 피드백 시스템을 통해 품질 관리를 받습니다."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">자주 묻는 질문</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          축구 레슨에 대한 궁금증을 해결해드립니다
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-neutral-200 rounded-lg overflow-hidden bg-white"
              >
                <AccordionTrigger className="px-5 py-4 font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 pt-0 text-neutral-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
