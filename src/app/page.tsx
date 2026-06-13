import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroCTA from "@/components/HeroCTA";
import ProductDemo from "@/components/ProductDemo";
import Gallery from "@/components/Gallery";
import TrendingManga from "@/components/TrendingManga";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyBar />
      <main className="min-h-screen flex flex-col justify-start">
        <Hero />
        <HeroCTA />
        <ProductDemo />
        <Gallery />
        <TrendingManga />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
