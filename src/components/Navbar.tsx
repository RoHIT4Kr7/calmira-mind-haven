import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/10 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="font-michroma text-xl font-bold gradient-text">
          Calmira AI
        </div>
        <Button variant="hero" size="sm">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;