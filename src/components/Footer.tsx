const Footer = () => {
  return (
    <footer className="py-10 px-6 border-t border-border/20">
      <div className="container mx-auto text-center flex flex-col items-center gap-3">
        <img
          src="/apple-touch-icon.png"
          alt="Calmira"
          className="h-20 w-auto select-none rounded-lg"
          draggable={false}
        />
        <p className="text-sm text-muted-foreground">
          © 2025 Calmira AI. Mental wellness for the next generation.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
