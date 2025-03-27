import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  course: string;
};

export default function Testimonials() {
  // Normally this would be fetched from the API, but for this demo we'll use static data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "이영준님",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      comment: "김민수 코치님의 기초 축구 레슨을 받았어요. 30대 중반에 처음 축구를 시작했는데, 너무 쉽고 재미있게 알려주셔서 빠르게 실력이 향상되었습니다. 개인의 특성에 맞춰 교육해주시는 점이 정말 좋았습니다.",
      course: "기초부터 배우는 축구 입문 코스"
    },
    {
      id: 2,
      name: "김서연님",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4.5,
      comment: "여성 축구 동호회 활동을 위해 이지연 코치님의 레슨을 받았습니다. 여성의 신체적 특성을 고려한 맞춤형 교육과 친절한 설명이 정말 도움이 많이 되었어요. 동호회에서 실력이 눈에 띄게 향상되었다고 다들 놀라워해요!",
      course: "주말 축구 기술 향상 프로그램"
    },
    {
      id: 3,
      name: "박민석님",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      comment: "저희 팀이 박준호 코치님의 전술 마스터 클래스를 받았습니다. 실전 경기에서 어떻게 움직여야 하는지, 팀으로서 어떻게 호흡을 맞춰야 하는지 정말 체계적으로 배울 수 있었어요. 지역 대회에서 우승할 수 있었던 비결입니다!",
      course: "전술 마스터 클래스"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">수강생 후기</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          실제 레슨을 받은 수강생들의 생생한 후기를 확인해보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current text-[#F9A826]" />);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-[#F9A826]" />
          <Star className="absolute top-0 left-0 fill-current text-[#F9A826] w-1/2 overflow-hidden" />
        </div>
      );
    }
    
    // Empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-[#F9A826]" />);
    }
    
    return stars;
  };

  return (
    <Card className="bg-neutral-100 border-none">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="font-medium">{testimonial.name}</p>
            <div className="flex items-center text-[#F9A826]">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
        
        <p className="text-neutral-700 mb-3">
          "{testimonial.comment}"
        </p>
        
        <p className="text-sm text-neutral-500">수강 과정: {testimonial.course}</p>
      </CardContent>
    </Card>
  );
}
