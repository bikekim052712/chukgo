import { Star, Star as StarIcon, MessageCircle, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Testimonial = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  course: string;
  age?: string;
  relationship?: string;
};

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "김부모님",
      relationship: "초등학생 자녀",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5,
      comment: "아이가 축구를 시작한 지 겨우 3개월 됐는데 벌써 기본기가 많이 향상됐어요. 개인 레슨이라 아이의 성향과 특성에 맞게 꼼꼼하게 가르쳐주셔서 만족스럽습니다. 무엇보다 아이가 매주 레슨을 기다릴 정도로 즐거워해요!",
      course: "초등 저학년 기초 축구 레슨",
      age: "9세"
    },
    {
      id: 2,
      name: "이아빠님",
      relationship: "유치원생 자녀",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5,
      comment: "6살 아들이 축구에 관심을 보여서 시작했는데, 코치님이 아이 눈높이에 딱 맞게 지도해주세요. 체계적인 커리큘럼과 재미있는 수업 방식 덕분에 아이가 집중력도 많이 향상되었습니다. 소수 그룹 수업이라 개인별 피드백도 꼼꼼히 해주셔서 좋아요.",
      course: "유아 축구 입문 클래스",
      age: "6세"
    },
    {
      id: 3,
      name: "박아빠님",
      relationship: "초등학생 자녀",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 4.5,
      comment: "아이가 학교 축구부에 들어갔는데 기초가 부족해서 시작했어요. 3개월간 집중 레슨 후 실력이 눈에 띄게 향상되어 학교에서도 인정받고 있습니다. 특히 드리블과 패스 능력이 많이 좋아졌어요. 코치님의 열정적인 지도 감사합니다!",
      course: "초등 고학년 실전 축구 프로그램",
      age: "12세"
    },
    {
      id: 4,
      name: "최맘님",
      relationship: "중학생 자녀",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5,
      comment: "중학교 1학년인 아들이 축구부 지원을 위해 김민수 코치님께 개인 레슨을 받았어요. 체계적인 훈련 프로그램과 영상 분석을 통한 피드백이 정말 도움이 많이 되었습니다. 덕분에 축구부 선발에도 합격했어요!",
      course: "중등부 축구 전술 마스터 클래스",
      age: "14세"
    },
    {
      id: 5,
      name: "윤엄마님",
      relationship: "유치원생 자녀",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 4.5,
      comment: "여자아이라 축구를 시킬까 망설였는데, 정말 잘 시작했다고 생각해요. 이지연 코치님이 남녀 차별 없이 아이들 각자의 특성에 맞게 지도해주셔서 딸아이가 자신감을 많이 얻었어요. 아이가 매주 레슨 날짜를 손꼽아 기다릴 정도로 즐겁게 배우고 있습니다.",
      course: "유소년 축구 기초 교실",
      age: "7세"
    },
    {
      id: 6,
      name: "정맘님",
      relationship: "초등학생 자녀",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5,
      comment: "초등학교 3학년 아들이 다른 운동에는 관심이 없었는데, 축구는 정말 좋아해요. 박코치님이 아이 성향을 빠르게 파악하시고 적합한 포지션과 훈련법을 제안해주셔서 빠르게 실력이 향상되었어요. 무엇보다 축구를 통해 협동심과 끈기가 길러진 것 같아 만족합니다.",
      course: "주말 축구 클리닉",
      age: "9세"
    }
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-3">
          <MessageCircle className="text-primary mr-2 h-6 w-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">학부모 후기</h2>
        </div>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          실제 아이들이 레슨을 받은 학부모님들의 생생한 후기를 확인해보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        
        <div className="mt-12 bg-primary/5 rounded-xl p-6 max-w-3xl mx-auto text-center border border-primary/10">
          <h3 className="text-lg font-semibold mb-2">93% 학부모님이 레슨 후 재신청!</h3>
          <p className="text-neutral-600">
            코치들의 전문성과 친절한 지도 방식에 만족하시는 학부모님들이 꾸준히 재등록하고 있습니다.
            아이의 미래를 위한 가장 좋은 선택, 지금 바로 경험해보세요.
          </p>
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
      stars.push(<StarIcon key={`full-${i}`} className="h-4 w-4 fill-current text-[#F9A826]" />);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-4 w-4 text-[#F9A826]" />
          <StarIcon className="absolute top-0 left-0 h-4 w-4 fill-current text-[#F9A826] w-1/2 overflow-hidden" />
        </div>
      );
    }
    
    // Empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-[#F9A826]" />);
    }
    
    return stars;
  };

  return (
    <Card className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition duration-300 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-medium">{testimonial.name}</p>
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          </div>
          <Quote className="h-8 w-8 text-primary/20" />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs">
            {testimonial.age}
          </Badge>
          <Badge variant="outline" className="bg-neutral-100 text-neutral-600 text-xs py-0">
            {testimonial.relationship}
          </Badge>
        </div>
        
        <p className="text-neutral-700 mb-4 flex-grow text-sm">
          "{testimonial.comment}"
        </p>
        
        <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          수강 프로그램: <span className="font-medium text-neutral-700">{testimonial.course}</span>
        </p>
      </CardContent>
    </Card>
  );
}
