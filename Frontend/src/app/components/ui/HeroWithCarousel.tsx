import PointerHighlightDemo from "@/app/components/ui/Hero/page";
import VideoCarousel, { Video } from "@/app/components/ui/VideoCarousel";

const videos: Video[] = [
  {
    id: 1,
    title: "Go-Fix-O",
    src: "/assets/video/Landing_Video.mp4",
    srcLow: "/assets/video/Landing_Video.mp4",
    description: "Watch our demo video showcasing Go-Fix-O features",
  },
];

export default function HeroWithCarousel() {
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="w-full flex items-center justify-center">
        <PointerHighlightDemo />
      </div>
      <div className="w-full flex items-center justify-center">
        <VideoCarousel videos={videos} />
      </div>
    </div>
  );
} 