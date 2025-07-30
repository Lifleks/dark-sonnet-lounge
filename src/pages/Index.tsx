import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import SignupForm from "@/components/SignupForm";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background font-gothic pb-24">
      <Hero />
      <Features />
      <Philosophy />
      <SignupForm />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;