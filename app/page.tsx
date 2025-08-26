import { Cta } from './(components)/Cta';
import { FAQ } from './(components)/Faq';
import { Features } from './(components)/Features';
import { Hero } from './(components)/Hero';
import { NavBar } from './(components)/NavBar';
import { Pricing } from './(components)/Pricing';
import { Testimonials } from './(components)/Testimonial';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <NavBar />
      <main className='flex-1'>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Cta />
      </main>
    </div>
  );
}
