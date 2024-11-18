import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import RetroGrid from "./RetroGrid";

export default function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className=" bg-gradient-to-b from-red-600 to-red-800 text-white overflow-hidden relative flex flex-grow flex-col">
      <RetroGrid className="opacity-100 z-0 absolute inset-0" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10">
        <div
          className={`transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-8xl  tracking-widest font-rushford leading-none font-bold text-center mb-4 text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Grab a Slice
          </h1>

          <div className="animate-bounce text-center py-10">
            <p className="text-6xl mx-auto text-yellow-400">🍕</p>
          </div>

          <div className="text-center">
            <a
              href="/menu"
              className="inline-flex items-center gap-2 bg-yellow-400 text-red-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-110"
            >
              ORDER NOW <ChevronRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
