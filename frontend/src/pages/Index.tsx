import Navbar from "@/components/homepage/Navbar";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import LoginSection from "@/components/homepage/LoginSection";
import Footer from "@/components/homepage/Footer";
import HomepageBackground from "@/components/homepage/HomepageBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      {/* Single continuous animated background that lives behind every section */}
      <HomepageBackground />

      <Navbar />
      <main className="relative">
        <HeroSection />
        <FeaturesSection />
        <LoginSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
