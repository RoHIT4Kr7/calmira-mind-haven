import React from "react";

interface BackgroundVideoProps {
  videoUrl: string;
  fallbackImage?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl,
  fallbackImage,
}) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={fallbackImage}
      >
        <source src={videoUrl} type="video/webm" />
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default BackgroundVideo;
