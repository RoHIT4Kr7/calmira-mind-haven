"use client";

import { RevealText } from "@/components/ui/reveal-text";

export default function RevealTextSection() {
  return (
    <div className="w-full flex items-center justify-center pt-20 px-4 md:px-8">
      <RevealText
        text="Welcome to Calmira"
        textColor="text-[#ee4444]"
        overlayColor="text-purple-400"
        fontSize="text-[40px] sm:text-[60px] md:text-[90px] lg:text-[120px]"
        letterDelay={0.06}
        overlayDelay={0.04}
        overlayDuration={0.5}
        springDuration={600}
        letterImages={[
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        ]}
      />
    </div>
  );
}
