import Hero from "@/components/home/Hero";
import Search from "@/components/home/Search";
import HowItWorks from "@/components/home/HowItWorks";
import Coaches from "@/components/home/Coaches";
import Lessons from "@/components/home/Lessons";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Contact from "@/components/home/Contact";
import AppPromotion from "@/components/home/AppPromotion";

export default function Home() {
  return (
    <>
      <Hero />
      <Search />
      <HowItWorks />
      <Coaches />
      <Lessons />
      <Testimonials />
      <FAQ />
      <Contact />
      <AppPromotion />
    </>
  );
}
