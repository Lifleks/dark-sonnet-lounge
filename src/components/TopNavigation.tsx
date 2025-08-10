import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const navigationItems = [
  { title: "EFTA GALLERY", route: "/gallery" },
  { title: "EFTA GPT", route: "/gpt" },
  { title: "EFTA MUSIC", route: "/" },
  { title: "EFTA AI", route: "/ai" }
];

const TopNavigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-2 left-1/2 -translate-x-1/2 w-12 h-8 p-0 bg-background/90 backdrop-blur border border-gothic-accent/30 hover:bg-background/95 hover:scale-110 shadow-gothic transition-all duration-300 ${
          isExpanded ? 'rounded-b-lg' : 'rounded-lg'
        }`}
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gothic-highlight" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gothic-highlight" />
        )}
      </Button>

      {/* Navigation Panel */}
      <div className={`glass-panel transition-all duration-500 ease-gothic ${
        isExpanded 
          ? 'transform translate-y-0 opacity-100' 
          : 'transform -translate-y-full opacity-0'
      }`}>
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gothic-highlight tracking-wider">
              EFTANASYA <span className="text-muted-foreground">TOOLS</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => {
                  navigate(item.route);
                  setIsExpanded(false);
                }}
                className="text-foreground hover:text-gothic-highlight hover:bg-gothic-accent/20 transition-all duration-300 font-medium tracking-wide"
              >
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;