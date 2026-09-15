import React from 'react';

interface TornPaperDividerProps {
  className?: string;
  position?: 'bottom' | 'top';
}

export const TornPaperDivider: React.FC<TornPaperDividerProps> = ({
  className = '',
  position = 'bottom',
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
        position === 'bottom' ? 'absolute bottom-0 left-0 right-0 z-20' : 'relative z-20'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Torn / Ripped paper jagged edge SVG matching travel scrapbook aesthetic */}
      <svg
        viewBox="0 0 1440 85"
        preserveAspectRatio="none"
        className="w-full h-12 sm:h-16 md:h-20 lg:h-24 block drop-shadow-[0_-4px_8px_rgba(0,0,0,0.35)]"
      >
        {/* Soft secondary ripped paper fiber layer */}
        <path
          d="M0,35 Q40,48 80,32 T160,42 T240,28 T320,44 T400,31 T480,45 T560,30 T640,46 T720,33 T800,47 T880,32 T960,46 T1040,30 T1120,45 T1200,33 T1280,47 T1360,32 L1440,42 L1440,85 L0,85 Z"
          className="fill-white/35 dark:fill-white/10"
        />

        {/* Primary ragged torn paper edge matching page background */}
        <path
          d="M0,48 
             L25,54 L50,42 L75,52 L100,40 L130,56 L160,44 L190,58 L220,43 L250,53 
             L280,39 L310,57 L340,45 L370,59 L400,44 L430,54 L460,41 L490,58 L520,46 
             L550,56 L580,42 L610,60 L640,47 L670,57 L700,43 L730,58 L760,46 L790,61 
             L820,42 L850,55 L880,41 L910,58 L940,46 L970,57 L1000,43 L1030,60 L1060,45 
             L1090,56 L1120,40 L1150,58 L1180,46 L1210,61 L1240,44 L1270,55 L1300,41 
             L1330,59 L1360,46 L1390,57 L1415,44 L1440,52 
             L1440,85 L0,85 Z"
          className="fill-[#FAF7F4] dark:fill-[#1A0E08]"
        />
      </svg>
    </div>
  );
};
