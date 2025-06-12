import { PointerHighlight } from "@/app/components/ui/pointer-highlight";

export function PointerHighlightDemo() {
  return (
    <div className="flex items-center justify-center w-full pt-4">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-tight md:text-8xl mb-2 shadows-into-light-regular">
          Problems? Don't panic. Just
        </div>
        <div className="text-4xl font-bold tracking-tight md:text-6xl text-center flex justify-center">
          <PointerHighlight>
            <span className="pacifico-regular bg-yellow-400 block px-1 py-0.5 leading-none align-baseline border-4 border-black">Go-Fix-O</span>
          </PointerHighlight>
          
        </div>
      </div>
    </div>
  );
}
export default PointerHighlightDemo;
