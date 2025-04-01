import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Services from "@/components/home/Services";
import Coaches from "@/components/home/Coaches";
import Lessons from "@/components/home/Lessons";
import Testimonials from "@/components/home/Testimonials";
import RegionalCoachFinder from "@/components/home/RegionalCoachFinder";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
        <RegionalCoachFinder />
      </div>
      <Categories />
      <Services />
      <Coaches />
      <Lessons />
      <Testimonials />
    </>
  );
}
