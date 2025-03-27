import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ContactFormData, contactFormSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiKakao } from "react-icons/si";

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시간 내에 답변 드리겠습니다.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "문의 접수 실패",
        description: error.message || "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: ContactFormData) => {
    mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">문의하기</h2>
            <p className="text-neutral-600 mb-6">
              궁금한 점이 있으신가요? 축구 레슨에 관한 모든 문의사항을 남겨주세요. 
              빠른 시간 내에 답변해 드리겠습니다.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">주소</h3>
                  <p className="text-neutral-600">서울특별시 강남구 테헤란로 123, 5층</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">전화</h3>
                  <p className="text-neutral-600">02-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">이메일</h3>
                  <p className="text-neutral-600">info@soccerlesson.kr</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="bg-neutral-100 hover:bg-neutral-200 rounded-full p-3 transition duration-300">
                <FaInstagram className="h-5 w-5 text-neutral-700" />
              </button>
              <button className="bg-neutral-100 hover:bg-neutral-200 rounded-full p-3 transition duration-300">
                <FaFacebookF className="h-5 w-5 text-neutral-700" />
              </button>
              <button className="bg-neutral-100 hover:bg-neutral-200 rounded-full p-3 transition duration-300">
                <FaYoutube className="h-5 w-5 text-neutral-700" />
              </button>
              <button className="bg-neutral-100 hover:bg-neutral-200 rounded-full p-3 transition duration-300">
                <SiKakao className="h-5 w-5 text-neutral-700" />
              </button>
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-neutral-100 rounded-xl p-6 md:p-8 shadow-sm space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="이름을 입력하세요" {...field} />
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
                        <Input placeholder="이메일을 입력하세요" type="email" {...field} />
                      </FormControl>
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
                        <Input placeholder="연락처를 입력하세요" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>문의 제목</FormLabel>
                      <FormControl>
                        <Input placeholder="문의 제목을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>문의 내용</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="문의 내용을 입력하세요" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "제출 중..." : "문의하기"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
