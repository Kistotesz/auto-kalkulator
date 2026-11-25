import { CartProvider } from "@/components/Cart";
import Director from "@/components/Director";
import Flavors from "@/components/Flavors";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Ingredients from "@/components/Ingredients";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import SceneMount from "@/components/SceneMount";
import Shop from "@/components/Shop";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <CartProvider>
      <div className="backdrop" aria-hidden />
      <SceneMount />
      <SmoothScroll />
      <Director />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Process />
        <Flavors />
        <Ingredients />
        <Shop />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </CartProvider>
  );
}
