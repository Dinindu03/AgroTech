import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import HeroPage from "../components/HeroPage";
import AboutUs from "../components/AboutUs";
import ProductAndService from "../components/ProductAndService";
import Problems from "../components/Problems";
import Knowledgehub from "../components/KnowledgeHub";
import Footer from "../components/Footer";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(
        location.state.scrollTo
      );

      if (section) {
        setTimeout(() => {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />

      <div id="home">
        <HeroPage />
      </div>

      <div id="about">
        <AboutUs />
      </div>

      <div id="productandservice">
        <ProductAndService />
      </div>

      <div id="problems">
        <Problems />
      </div>

      <div id="knowledgehub">
        <Knowledgehub />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </>
  );
};

export default Home;