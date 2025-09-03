import React, { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  videoUrl: string;
  fallbackImage?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl,
  fallbackImage,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Load video only when visible
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {isVisible ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={fallbackImage}
          preload="none"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // Show fallback image until video loads
        <img
          ref={videoRef as any}
          src={fallbackImage}
          alt="Background"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default BackgroundVideo;
