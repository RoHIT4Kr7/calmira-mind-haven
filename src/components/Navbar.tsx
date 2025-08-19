import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-red-500/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="font-michroma text-xl font-bold text-red-500">
          Calmira AI
        </div>
        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;