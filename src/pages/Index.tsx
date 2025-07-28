import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Philosophy from "@/components/Philosophy";
import SignupForm from "@/components/SignupForm";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-gothic">
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