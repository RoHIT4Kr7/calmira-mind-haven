const VideoSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="relative">
          {/* Curved frame background */}
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-8 h-8 text-primary" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-muted-foreground text-lg">
                  Video coming soon...
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative glow effects */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-glow/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-glow/20 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;