import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Services from "@/components/home/Services";
import Coaches from "@/components/home/Coaches";
import Lessons from "@/components/home/Lessons";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Services />
      <Coaches />
      <Lessons />
      <Testimonials />
      <FAQ />
    </>
  );
}
