import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import HeroPage from "../components/HeroPage";
import AboutUs from "../components/AboutUs";
import ProductAndService from "../components/ProductAndService";
import Problems from "../components/Problems";
import Knowledgehub from "../components/KnowledgeHub";
import Footer from "../components/Footer";

const sections = [
  { id: "home", Component: HeroPage },
  { id: "about", Component: AboutUs },
  { id: "productandservice", Component: ProductAndService },
  { id: "problems", Component: Problems },
  { id: "knowledgehub", Component: Knowledgehub },
  { id: "contact", Component: Footer },
];

const Home = () => {
  const location = useLocation();
  const sectionRefs = useRef({});

  // Scroll to a section passed via router state (e.g. from another page)
  useEffect(() => {
    if (!location.state?.scrollTo) return;

    const timer = setTimeout(() => {
      const section = document.getElementById(location.state.scrollTo);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    return () => clearTimeout(timer);
  }, [location.state?.scrollTo]);

  // Fade/slide sections in as they enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {sections.map(({ id, Component }) => (
        <div
          key={id}
          id={id}
          ref={(el) => (sectionRefs.current[id] = el)}
          className="section-reveal scroll-mt-20"
        >
          <Component />
        </div>
      ))}
    </>
  );
};

export default Home;