import { PointerHighlight } from "@/app/components/ui/pointer-highlight";

export function PointerHighlightDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-tight md:text-8xl mb-4 shadows-into-light-regular">
          Problems? Don't panic. Just
        </div>
        <div className="text-4xl font-bold tracking-tight md:text-6xl">
          <PointerHighlight>
            <span className="pacifico-regular">Go-Fix-O</span>
          </PointerHighlight>
        </div>
      </div>
    </div>
  );
}
export default PointerHighlightDemo;
