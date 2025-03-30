import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Running() {
  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">달리기레슨</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          체력 및 스피드 향상을 위한 전문적인 달리기 트레이닝을 받아보세요. 
          다양한 코스와 프로그램을 통해 당신의 러닝 실력을 향상시킬 수 있습니다.
        </p>
      </div>

      {/* 달리기 레슨 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="md:col-span-3">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5" 
              alt="달리기 레슨" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">체력과 스피드 향상을 위한 맞춤형 레슨</h2>
          <p className="text-gray-600 mb-6">
            체계적인 훈련 프로그램을 통해 내 몸에 맞는 러닝 방법을 배워보세요. 전문 코치의 지도로 자세 교정부터 효과적인 달리기 기술까지 배울 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-none">체력 향상</Badge>
            <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-none">스피드</Badge>
            <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-none">유산소</Badge>
            <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-none">지구력</Badge>
          </div>
          <Button className="w-full" size="lg">레슨 신청하기</Button>
        </div>
      </div>

      {/* 달리기 레슨 유형 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">축구 레슨 유형</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "개인레슨",
              description: "1:1 맞춤형 축구 지도",
              icon: "👤",
              features: ["개인별 맞춤 커리큘럼", "체계적인 자세 교정", "개인 페이스에 맞는 트레이닝"]
            },
            {
              title: "그룹레슨",
              description: "전문코치와 함께하는 그룹 훈련",
              icon: "👥",
              features: ["함께 달리는 즐거움", "경쟁을 통한 성장", "합리적인 레슨 비용"]
            },
            {
              title: "골퍼레슨",
              description: "전문 골퍼기 트레이닝",
              icon: "🥅",
              features: ["포지셔닝 향상", "반사신경 훈련", "골킥 전문 훈련"]
            },
            {
              title: "달리기레슨",
              description: "체력 및 스피드 향상 훈련",
              icon: "🏃",
              features: ["러닝 자세 교정", "인터벌 트레이닝", "유산소 능력 향상"]
            },
          ].map((item, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <div className="text-4xl mb-2">{item.icon}</div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">자세히 보기</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* 달리기 프로그램 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">다양한 달리기 프로그램</h2>
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="beginner">입문자 과정</TabsTrigger>
            <TabsTrigger value="intermediate">중급자 과정</TabsTrigger>
            <TabsTrigger value="advanced">고급자 과정</TabsTrigger>
            <TabsTrigger value="special">특별 과정</TabsTrigger>
          </TabsList>
          <TabsContent value="beginner" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-bold mb-4">입문자를 위한 달리기 프로그램</h3>
            <p className="mb-4">달리기를 처음 시작하시는 분들을 위한 기본 프로그램입니다. 올바른 자세와 호흡법부터 배울 수 있습니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">기초 자세 훈련</h4>
                <p>올바른 달리기 자세와 효율적인 발 디딤법을 배웁니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">호흡법 트레이닝</h4>
                <p>달리기에 최적화된 호흡법으로 지구력을 향상시킵니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">5K 완주 프로그램</h4>
                <p>8주 과정으로 5K 완주를 목표로 체계적인 훈련을 진행합니다.</p>
              </div>
            </div>
            <Button>입문자 과정 신청하기</Button>
          </TabsContent>
          <TabsContent value="intermediate" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-bold mb-4">중급자를 위한 달리기 프로그램</h3>
            <p className="mb-4">달리기 경험이 있는 중급자를 위한 프로그램입니다. 속도와 지구력을 더욱 향상시킬 수 있습니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">인터벌 트레이닝</h4>
                <p>고강도 인터벌 훈련으로 속도와 지구력을 동시에 향상시킵니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">힐 트레이닝</h4>
                <p>언덕 달리기를 통해 하체 근력과 심폐 지구력을 강화합니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">10K 기록 단축 프로그램</h4>
                <p>10K 완주 시간을 단축시키기 위한 체계적인 훈련을 진행합니다.</p>
              </div>
            </div>
            <Button>중급자 과정 신청하기</Button>
          </TabsContent>
          <TabsContent value="advanced" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-bold mb-4">고급자를 위한 달리기 프로그램</h3>
            <p className="mb-4">마라톤이나 대회 참가를 목표로 하는 고급자를 위한 프로그램입니다. 맞춤형 훈련으로 목표 달성을 도와드립니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">레이스 전략 훈련</h4>
                <p>대회 참가를 위한 효과적인 레이스 전략과 페이스 조절법을 배웁니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">스피드 향상 프로그램</h4>
                <p>최고 속도를 끌어올리기 위한 고강도 스피드 훈련을 진행합니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">마라톤 완주 훈련</h4>
                <p>하프/풀 마라톤 완주를 위한 12주 맞춤형 트레이닝 프로그램입니다.</p>
              </div>
            </div>
            <Button>고급자 과정 신청하기</Button>
          </TabsContent>
          <TabsContent value="special" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-bold mb-4">특별 과정</h3>
            <p className="mb-4">특정 목표나 상황에 맞춘 특별 프로그램입니다. 개인 목표에 맞는 맞춤형 훈련을 받을 수 있습니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">체중 감량 러닝</h4>
                <p>체중 감량에 효과적인 러닝 프로그램과 식이 조절 가이드를 제공합니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">트레일 러닝</h4>
                <p>자연 속에서의 트레일 러닝 기술과 안전 가이드를 배웁니다.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">재활 러닝</h4>
                <p>부상 후 안전한 러닝 복귀를 위한 단계별 재활 프로그램입니다.</p>
              </div>
            </div>
            <Button>특별 과정 상담하기</Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* 코치 소개 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">전문 달리기 코치진</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "김달림",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              position: "육상 전문 코치",
              experience: "전 국가대표 중장거리 선수",
              specialty: "마라톤, 지구력 훈련"
            },
            {
              name: "박속도",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
              position: "러닝 테크닉 코치",
              experience: "스포츠 과학 박사",
              specialty: "러닝 동작 분석, 자세 교정"
            },
            {
              name: "이체력",
              image: "https://randomuser.me/api/portraits/men/67.jpg",
              position: "체력 트레이닝 코치",
              experience: "스포츠 트레이너 10년 경력",
              specialty: "체력 향상, 인터벌 트레이닝"
            }
          ].map((coach, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src={coach.image} 
                  alt={coach.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{coach.name}</CardTitle>
                <CardDescription>{coach.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2"><strong>경력:</strong> {coach.experience}</p>
                <p><strong>전문 분야:</strong> {coach.specialty}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">코치 프로필</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* 레슨 비용 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">레슨 비용</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "기본 과정",
              price: "50,000원",
              period: "회당",
              features: [
                "1회 60분 기본 레슨",
                "기초 달리기 자세 교정",
                "개인 맞춤형 피드백",
                "기초 훈련 계획 제공"
              ],
              highlight: false
            },
            {
              title: "정기 과정",
              price: "200,000원",
              period: "월 4회",
              features: [
                "주 1회 60분 레슨",
                "체계적인 달리기 훈련",
                "월간 훈련 계획 설계",
                "러닝 데이터 분석",
                "영양 및 컨디셔닝 가이드"
              ],
              highlight: true
            },
            {
              title: "집중 과정",
              price: "400,000원",
              period: "월 8회",
              features: [
                "주 2회 60분 레슨",
                "고강도 맞춤형 훈련",
                "주간 훈련 계획 설계",
                "전문적인 피드백",
                "실시간 러닝 코칭",
                "영양 및 회복 관리"
              ],
              highlight: false
            }
          ].map((plan, index) => (
            <Card 
              key={index} 
              className={`h-full ${plan.highlight ? 'border-purple-500 border-2 shadow-lg' : ''}`}
            >
              {plan.highlight && (
                <div className="bg-purple-500 text-white text-center py-1 text-sm font-bold">
                  인기 과정
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plan.highlight ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  신청하기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">
          * 모든 과정은 첫 회 무료 상담이 포함되어 있습니다. 개인 목표와 상황에 맞는 커스텀 과정도 가능합니다.
        </p>
      </div>

      {/* 레슨 신청 배너 */}
      <div className="bg-purple-100 rounded-lg p-8 text-center mb-16">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">지금 바로 달리기 레슨을 시작하세요!</h2>
        <p className="text-purple-700 mb-6 max-w-3xl mx-auto">
          전문 코치와 함께 올바른 러닝 자세와 효과적인 훈련 방법을 배우고 여러분의 달리기 목표를 달성하세요.
          첫 상담은 무료로 진행됩니다.
        </p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
          무료 상담 신청하기
        </Button>
      </div>

      {/* FAQ 섹션 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">자주 묻는 질문</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: "어떤 장비가 필요한가요?",
              answer: "기본적으로 러닝화와 편안한 운동복이 필요합니다. 레슨 진행 시 심박수 측정을 위한 스마트워치나 심박계가 있으면 더 효과적인 훈련이 가능합니다. 첫 레슨에서 코치가 개인에게 필요한 장비를 추천해 드립니다."
            },
            {
              question: "초보자도 참여할 수 있나요?",
              answer: "네, 물론입니다. 처음 달리기를 시작하는 분들을 위한 입문 과정이 준비되어 있으며, 개인의 체력과 경험에 맞춰 레슨이 진행됩니다. 지금까지 달려본 경험이 없어도 전혀 걱정하지 않으셔도 됩니다."
            },
            {
              question: "어디서 레슨이 진행되나요?",
              answer: "레슨은 주로 지역 공원, 육상 트랙, 또는 인근 러닝 코스에서 진행됩니다. 개인 레슨의 경우 원하시는 장소에서도 진행 가능하며, 첫 상담 시 최적의 장소를 결정하게 됩니다."
            },
            {
              question: "레슨 취소 및 변경은 어떻게 하나요?",
              answer: "레슨 24시간 전까지 취소 또는 일정 변경이 가능합니다. 그 이후에는 취소 수수료가 발생할 수 있으니 참고해 주세요. 날씨 등의 불가피한 상황으로 인한 취소는 별도의 수수료 없이 일정 조정이 가능합니다."
            },
            {
              question: "달리기가 체중 감량에 효과적인가요?",
              answer: "네, 달리기는 효과적인 유산소 운동으로 체중 감량에 도움이 됩니다. 하지만 적절한 훈련 계획과 식단 관리가 함께 이루어져야 최적의 결과를 얻을 수 있습니다. 저희 특별 과정인 '체중 감량 러닝'에서는 이에 맞춘 프로그램을 제공합니다."
            }
          ].map((faq, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}