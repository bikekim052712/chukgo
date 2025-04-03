import { Star, Star as StarIcon, MessageCircle, Quote, ChevronRight } from "lucide-react";

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
  // 추가적인 후기들 포함하여 6개 표시
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
      name: "정엄마님",
      relationship: "중학생 자녀",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5,
      comment: "중학교 축구부에서 활동중인 아이가 더 실력을 향상시키고 싶어해서 시작했어요. 개인 맞춤형 레슨으로 아이의 약점을 정확히 파악하고 보완해주셔서 한 달 만에 실력이 눈에 띄게 좋아졌습니다. 전문적인 코칭에 정말 감사드립니다.",
      course: "중등 축구 실력향상 프로그램",
      age: "14세"
    },
    {
      id: 5,
      name: "최부모님",
      relationship: "초등학생 자녀",
      avatar: "",
      rating: 4.5,
      comment: "아이가 축구를 처음 접하는데 코치님이 정말 친절하고 인내심 있게 가르쳐주셔서 빠르게 적응했어요. 4주 프로그램 수강 후 아이가 너무 즐거워해서 계속 등록했습니다. 소규모 그룹이라 충분한 관심과 지도를 받을 수 있어 좋았습니다.",
      course: "주말 유소년 축구 클래스",
      age: "8세"
    },
    {
      id: 6,
      name: "한아빠님",
      relationship: "초등학생 자녀",
      avatar: "",
      rating: 5,
      comment: "골키퍼 포지션을 맡게 된 아이를 위해 특화 클래스를 찾다가 이 레슨을 선택했는데 정말 만족스러워요. 코치님이 골키퍼로서의 기본기와 심리적인 부분까지 꼼꼼하게 지도해주셔서 아이의 자신감이 크게 향상되었습니다. 감사합니다!",
      course: "골키퍼 특화 트레이닝",
      age: "11세"
    }
  ];

  return (
    <section className="py-16 bg-[#FAFAFE]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">학부모 추천 후기</h2>
              <p className="text-gray-600">
                축고 레슨을 경험한 학부모님들의 생생한 후기
              </p>
            </div>
            <a 
              href="#" 
              className="flex items-center text-[#5D3FD3] font-medium text-sm mt-4 md:mt-0"
            >
              모든 후기 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="auto-slide-container">
            <div className="auto-slide-content">
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`${testimonial.id}-${index}`}>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
          
          {/* 통계 지표 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#5D3FD3] mb-1">93%</p>
              <p className="text-sm text-gray-600">레슨 후 재신청율</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#5D3FD3] mb-1">4.9/5</p>
              <p className="text-sm text-gray-600">평균 학부모 만족도</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#5D3FD3] mb-1">97%</p>
              <p className="text-sm text-gray-600">기술 향상 경험</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-3xl font-bold text-[#5D3FD3] mb-1">3.5개월</p>
              <p className="text-sm text-gray-600">평균 레슨 기간</p>
            </div>
          </div>
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
      stars.push(<StarIcon key={`full-${i}`} className="h-2 w-2 fill-yellow-400 text-yellow-400" />);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-2 w-2 text-yellow-400" />
          <StarIcon className="absolute top-0 left-0 h-2 w-2 fill-yellow-400 text-yellow-400 w-1/2 overflow-hidden" />
        </div>
      );
    }
    
    // Empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-2 w-2 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 relative h-[280px] flex flex-col">
      {/* 인용부호 */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#5D3FD3] rounded-full flex items-center justify-center text-white shadow-md">
        <Quote className="h-4 w-4" />
      </div>
      
      {/* 평점 */}
      <div className="flex mb-3 justify-end">
        <div className="flex items-center gap-0.5">
          {renderStars(testimonial.rating)}
        </div>
      </div>
      
      {/* 후기 내용 */}
      <p className="text-gray-700 mb-3 text-xs line-clamp-6 flex-grow">
        "{testimonial.comment.length > 140 
          ? `${testimonial.comment.substring(0, 140)}...` 
          : testimonial.comment}"
      </p>
      
      {/* 프로필 */}
      <div className="flex items-center border-t border-gray-100 pt-3 mt-auto">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
          {testimonial.avatar ? (
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-[#F0EBFF] flex items-center justify-center text-[#5D3FD3] font-bold text-xs">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-xs">{testimonial.name}</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="bg-[#F0EBFF] text-[#5D3FD3] px-1.5 py-0.5 rounded-full text-[10px]">
              {testimonial.age}
            </span>
            <span>{testimonial.relationship}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
