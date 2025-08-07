import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import SignupForm from "@/components/SignupForm";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import RecentTracks from "@/components/RecentTracks";
import TrackRecommendations from "@/components/TrackRecommendations";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background font-gothic pb-24">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-500 ease-in-out ${
          user && sidebarExpanded ? 'lg:pr-80' : ''
        }`}>
          <Hero />
          <Features />
          <Philosophy />
          <SignupForm />
          <Testimonials />
          <FAQ />
          <TrackRecommendations />
          <Footer />
        </div>
        
        {/* Sidebar with Recent Tracks */}
        {user && (
          <>
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className={`hidden lg:block fixed top-1/2 z-50 transition-all duration-500 ease-in-out ${
                sidebarExpanded ? 'right-80' : 'right-4'
              } -translate-y-1/2 w-8 h-12 p-0 bg-background/80 backdrop-blur border border-primary/20 hover:bg-background/90 hover:scale-110 shadow-lg`}
            >
              {sidebarExpanded ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>

            {/* Animated Sidebar */}
            <div className={`hidden lg:block fixed right-0 top-0 h-screen overflow-y-auto bg-background/95 backdrop-blur border-l border-primary/20 transition-all duration-500 ease-in-out ${
              sidebarExpanded 
                ? 'w-80 translate-x-0 opacity-100' 
                : 'w-80 translate-x-full opacity-0'
            }`}>
              <div className="h-full">
                <RecentTracks />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;