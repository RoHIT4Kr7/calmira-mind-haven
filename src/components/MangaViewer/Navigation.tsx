import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Navigation = ({ goToPreviousPanel, goToNextPanel, isFirstPanel, isLastPanel }: any) => (
  <>
    {/* Desktop Arrows */}
    <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none z-10">
      <Button variant="ghost" size="icon" onClick={goToPreviousPanel} disabled={isFirstPanel} className="pointer-events-auto bg-black/20 text-white">
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button variant="ghost" size="icon" onClick={goToNextPanel} disabled={isLastPanel} className="pointer-events-auto bg-black/20 text-white">
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>

    {/* Mobile Navigation */}
    <div className="md:hidden flex justify-center sm:text-2xl mt-6 space-x-4">
      <Button variant="outline" onClick={goToPreviousPanel} disabled={isFirstPanel} className="bg-black/20 backdrop-blur-sm text-white border-white/20 hover:bg-black/40">
        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
      </Button>
      <Button variant="outline" onClick={goToNextPanel} disabled={isLastPanel} className="bg-black/20 backdrop-blur-sm text-white border-white/20 hover:bg-black/40">
        Next <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  </>
);

export default Navigation;
