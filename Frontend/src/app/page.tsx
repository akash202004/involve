import HeroWithCarousel from "@/app/components/ui/HeroWithCarousel";
import Feature from "@/app/components/ui/Feature/Page";

export default function Home() {
  return (  
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 sm:pt-40 md:pt-48 pb-8">
      <div className="relative w-full bg-transparent flex items-center justify-center overflow-hidden">
        <HeroWithCarousel />
      </div>
      <div className="w-full flex items-center justify-center">
        <Feature />
      </div>
    </div>
  );
}
