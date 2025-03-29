import { Search, Calendar, Zap, MessageCircle, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="text-primary text-2xl" />,
      title: "맞춤 코치 검색",
      description: "지역, 연령대, 레슨 유형을 선택하여 우리 아이에게 딱 맞는 축구 코치를 찾아보세요."
    },
    {
      icon: <ShieldCheck className="text-primary text-2xl" />,
      title: "코치 프로필 확인",
      description: "자격증, 지도 경력, 수업 방식, 리뷰를 확인하고 신뢰할 수 있는 코치를 선택하세요."
    },
    {
      icon: <MessageCircle className="text-primary text-2xl" />,
      title: "상담 및 문의",
      description: "궁금한 점이 있으면 코치에게 직접 질문하고 아이에게 맞는 수업 방식을 상담하세요."
    },
    {
      icon: <Calendar className="text-primary text-2xl" />,
      title: "일정 예약",
      description: "코치의 가능한 시간을 확인하고 아이의 스케줄에 맞는 최적의 시간에 레슨을 예약하세요."
    },
    {
      icon: <Zap className="text-primary text-2xl" />,
      title: "축구 실력 향상",
      description: "체계적인 커리큘럼과 전문 코치의 지도로 아이의 축구 실력과 자신감을 향상시키세요."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">이용 방법</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          간단한 단계로 우리 아이에게 딱 맞는 축구 코치를 만나보세요
        </p>
        
        <div className="flex flex-col items-center max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center w-full mb-8 last:mb-0">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 shrink-0">
                {step.icon}
              </div>
              <div className="md:flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-neutral-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block h-14 border-l-2 border-dashed border-primary/30 my-4 ml-8"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-primary/5 rounded-xl p-6 max-w-3xl mx-auto text-center border border-primary/10">
          <h3 className="text-lg font-semibold mb-2">안전한 예약 및 레슨</h3>
          <p className="text-neutral-600">
            모든 코치는 신원 확인과 검증 과정을 거쳤으며, 신뢰할 수 있는 환경에서 레슨이 이루어집니다.
            예약 및 결제도 안전하게 보호되므로 안심하고 이용하세요.
          </p>
        </div>
      </div>
    </section>
  );
}
