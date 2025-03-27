import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Clock, ChevronLeft, CheckCircle2 } from "lucide-react";
import { InsertBooking, LessonWithDetails } from "@shared/schema";

// Create booking form schema
const bookingFormSchema = z.object({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  phone: z.string().min(10, "올바른 전화번호를 입력해주세요."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Booking() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Get lesson details
  const { data: lesson, isLoading } = useQuery<LessonWithDetails>({
    queryKey: [`/api/lessons/${lessonId}`],
  });
  
  // Form definition
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  
  // Booking mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: InsertBooking) => {
      const res = await apiRequest("POST", "/api/bookings", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setBookingComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast({
        title: "예약 실패",
        description: error.message || "레슨 예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: BookingFormValues) => {
    if (!selectedDate || !lesson) {
      toast({
        title: "날짜를 선택해주세요",
        description: "레슨 날짜를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // Create booking data
    const bookingData: InsertBooking = {
      userId: 4, // Using student user for demo
      lessonId: parseInt(lessonId),
      scheduleDate: selectedDate,
      status: "pending",
    };
    
    mutate(bookingData);
  };
  
  if (isLoading) {
    return <BookingSkeleton />;
  }
  
  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">레슨을 찾을 수 없습니다</h1>
          <p className="text-neutral-600 mb-6">요청하신 레슨 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/lessons")}>
            레슨 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  // Booking success view
  if (bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">예약이 완료되었습니다!</CardTitle>
            <CardDescription>
              {lesson.title} 레슨이 성공적으로 예약되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h3 className="font-medium mb-2">예약 정보</h3>
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>레슨명:</strong> {lesson.title}
                </p>
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>코치:</strong> {lesson.coach.user.fullName}
                </p>
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>날짜:</strong> {selectedDate ? format(selectedDate, 'PPP', { locale: ko }) : ''}
                </p>
                <p className="text-sm text-neutral-600">
                  <strong>장소:</strong> {lesson.location}
                </p>
              </div>
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h3 className="font-medium mb-2">다음 단계</h3>
                <p className="text-sm text-neutral-600 mb-2">
                  1. 예약 확인 이메일이 곧 발송될 예정입니다.
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  2. 결제 정보는 이메일을 통해 안내됩니다.
                </p>
                <p className="text-sm text-neutral-600">
                  3. 레슨 당일 준비물을 지참하여 시간에 맞게 도착해주세요.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
            <Button onClick={() => navigate("/lessons")}>
              다른 레슨 보기
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(`/lessons/${lessonId}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> 레슨 상세로 돌아가기
        </Button>
        <h1 className="text-2xl font-bold">레슨 예약</h1>
        <p className="text-neutral-600">{lesson.title}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>레슨 일정 선택</CardTitle>
              <CardDescription>
                원하시는 레슨 날짜를 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  locale={ko}
                  disabled={(date) => {
                    // Disable past dates and limit future bookings to 60 days
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + 60);
                    
                    return date < today || date > maxDate;
                  }}
                />
              </div>
              
              {selectedDate && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-2">
                    <strong>선택한 날짜:</strong> {format(selectedDate, 'PPP', { locale: ko })}
                  </p>
                  <p className="text-sm text-neutral-600">
                    * 정확한 시간은 예약 후 코치와 협의하여 결정됩니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>레슨 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-neutral-500 mr-2" />
                <p className="text-sm">{lesson.location}</p>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-neutral-500 mr-2" />
                <p className="text-sm">최대 {lesson.groupSize}명</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-neutral-500 mr-2" />
                <p className="text-sm">{lesson.duration}분</p>
              </div>
              
              <div className="pt-2 border-t border-neutral-200">
                <p className="font-bold text-primary">
                  ₩{lesson.price.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>예약자 정보</CardTitle>
          <CardDescription>
            레슨 예약을 위한 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력해주세요" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      예약 확인 정보가 이메일로 발송됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연락처</FormLabel>
                    <FormControl>
                      <Input placeholder="연락처를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending || !selectedDate}>
                  {isPending ? "예약 중..." : "레슨 예약하기"}
                </Button>
                <p className="text-xs text-neutral-500 text-center mt-3">
                  예약 신청 시 <a href="#" className="text-primary hover:underline">이용약관</a> 및 <a href="#" className="text-primary hover:underline">개인정보처리방침</a>에 동의하게 됩니다.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-96 mt-2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <div className="pt-2 border-t border-neutral-200">
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-64" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-80 mx-auto mt-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
