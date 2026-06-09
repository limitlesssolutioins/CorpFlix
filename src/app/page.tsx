'use client';

import LandingNav from '@/components/Landing/LandingNav';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection';
import AIHighlight from '@/components/Landing/AIHighlight';
import PricingSection from '@/components/Landing/PricingSection';
import Footer from '@/components/Landing/Footer';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 selection:bg-blue-500/30 selection:text-blue-200">
      <LandingNav />
      
      <main className="w-full">
        <HeroSection />
        
        <div id="features" className="w-full scroll-mt-20">
          <FeaturesSection />
        </div>
        
        <div id="ai" className="w-full scroll-mt-20">
          <AIHighlight />
        </div>
        
        <div id="pricing" className="w-full scroll-mt-20">
          <PricingSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

