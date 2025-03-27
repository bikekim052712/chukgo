import { Search, Calendar, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="text-primary text-2xl" />,
      title: "맞춤 코치 탐색",
      description: "지역, 레벨, 레슨 유형 등을 기준으로 나에게 맞는 코치를 찾아보세요."
    },
    {
      icon: <Calendar className="text-primary text-2xl" />,
      title: "일정 예약",
      description: "코치의 가능한 일정을 확인하고 나에게 맞는 시간에 레슨을 예약하세요."
    },
    {
      icon: <Zap className="text-primary text-2xl" />,
      title: "축구 실력 향상",
      description: "전문 코치와 함께 체계적인 레슨을 통해 축구 실력을 향상시키세요."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">이용 방법</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          간단한 단계로 나에게 맞는 축구 레슨을 찾고 예약하세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
