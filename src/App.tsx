import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "./data";
import { Background, CursorGlow, Preloader, ScrollProgress } from "./components/Ambient";
import { Contact, Footer } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { About, Education, Experience, Stats } from "./components/Sections";
import { Skills } from "./components/Skills";

const PRELOADER_MS = 1400;

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), PRELOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    // reducedMotion="user": honours the visitor's OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
      <Preloader show={loading} name={profile.personal.firstName} />
      <Background />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <Stats />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
