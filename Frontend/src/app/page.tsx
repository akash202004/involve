import Image from "next/image";
import ServiceSelection from '@/app/components/Feature/Page';
import WaitingTime from "@/app/components/Waiting-Time/Page";
import FAQ from "@/app/components/FAQ/Page";
export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ServiceSelection />
      <FAQ />
      <WaitingTime />
    </div>
  );
}