import React from 'react';
import { useReadingProgress } from '../../hooks/useReadingProgress';

export default function ReadingProgress() {
  const completion = useReadingProgress();

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={completion}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="h-full bg-gradient-to-r from-inkora-teal via-teal-300 to-inkora-amber transition-all duration-150 ease-out shadow-[0_0_10px_rgba(86,224,197,0.8)]"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
