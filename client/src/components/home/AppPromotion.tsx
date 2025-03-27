import { Button } from "@/components/ui/button";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function AppPromotion() {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">모바일 앱으로 더 편리하게</h2>
            <p className="mb-6">
              언제 어디서나 축구 레슨을 찾고, 예약하고, 관리할 수 있는 모바일 앱을 다운로드하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="bg-black border-black hover:bg-neutral-800">
                <FaApple className="mr-2 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="font-medium">App Store</span>
                </div>
              </Button>
              <Button variant="outline" className="bg-black border-black hover:bg-neutral-800">
                <FaGooglePlay className="mr-2 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">GET IT ON</span>
                  <span className="font-medium">Google Play</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="축구 레슨 모바일 앱" 
              className="max-w-xs w-full rounded-3xl shadow-2xl" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
