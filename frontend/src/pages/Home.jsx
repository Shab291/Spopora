import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Features from "../components/Features";
import NewArrivals from "../components/NewArrivals";
import Banner from "../components/Banner";
import Headphone from "../components/Headphone";
import Watches from "../components/Watches";
import PopularProducts from "../components/PopularProducts";
import About from "../components/About";
import Banner2 from "../components/Banner2";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      <Marquee backgroundColor="#2c3e50" className="mt-1" />
      <NewArrivals />
      <Marquee
        text="Special Offer! 50% off all products this weekend only."
        textColor="white"
        backgroundColor="#52b788"
        fontSize="1.4rem"
      />
      <Banner />
      <Headphone />
      <Watches />
      <PopularProducts />
      <Features />
      <About />
      <Banner2 />
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default Home;
