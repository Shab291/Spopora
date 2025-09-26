import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import HeroDetailsModal from "./HeroDetailsModal";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Hero = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);

  const { products, loading } = useShopContext();

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter products by featured status
      const featuredProducts = products.filter(
        (item) => item.featured === true
      );

      // Create hero slides from featured products
      const slides = featuredProducts.map((product, index) => ({
        id: index + 1,
        src:
          product.image && product.image.length > 0
            ? product.image[0]
            : "/placeholder-image.jpg",

        title: getSlideTitle(index),
        subtitle: getSlideSubtitle(index),
        buttonText: getButtonText(index),
        product: product,
      }));

      setHeroSlides(slides);
    }

    // Close the modal on component unmount
    return () => {
      handleClose();
    };
  }, [products]);

  // Helper functions to generate slide content
  const getSlideTitle = (index) => {
    const titles = [
      "Gift luxury, wear confidence, shop now.",
      "New Arrivals Just For You",
      "Seasonal Special Offers",
    ];
    return titles[index] || "Discover Our Collection";
  };

  const getSlideSubtitle = (index) => {
    const subtitles = [
      "Discover our exclusive collection",
      "Be the first to explore our latest designs",
      "Limited time deals on premium products",
    ];
    return subtitles[index] || "Explore our premium products";
  };

  const getButtonText = (index) => {
    const buttonTexts = ["Explore More", "Shop Now", "View Offers"];
    return buttonTexts[index] || "Shop Now";
  };

  const handleImageClick = (slideId) => {
    setIsZoomed(true);
    setIsModalOpen(true);
    setCurrentSlideIndex(slideId - 1); // Match 0-based index

    // Find the slide by ID
    const clickedSlide = heroSlides.find((slide) => slide.id === slideId);
    if (clickedSlide && clickedSlide.product) {
      setCurrentProduct(clickedSlide.product);
    } else if (products && products.length > 0) {
      // Fallback: use the first product
      setCurrentProduct(products[0]);
    }
  };
  const handleNext = () => {
    if (heroSlides.length === 0) return;

    const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    setCurrentSlideIndex(nextIndex);
    setCurrentProduct(heroSlides[nextIndex].product);
  };

  const handlePrev = () => {
    if (heroSlides.length === 0) return;

    const prevIndex =
      (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
    setCurrentSlideIndex(prevIndex);
    setCurrentProduct(heroSlides[prevIndex].product);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
    setCurrentProduct(null);
  };

  if (loading) {
    return (
      <section className="relative mt-12 h-[75vh] lg:max-h-[75vh] overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">Loading featured products...</div>
      </section>
    );
  }

  return (
    <section className="relative mt-16 h-[84vh] lg:max-h-[75vh]">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          renderBullet: (index, className) => {
            return `<span class="${className} bg-white opacity-70 hover:opacity-100 transition-opacity duration-300"></span>`;
          },
        }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background image */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#ba107c] via-[#FF84CB] to-[#B969FE]" />

            {/* Black overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10 z-1"></div>

            {/* Content container */}
            <div className="container lg:h-full relative z-10 flex justify-between flex-col lg:flex-row items-center px-4 lg:px-20 gap-4 lg:gap-25">
              <div className="max-w-2xl text-center text-white p-8">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 8px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {slide.title}
                </h1>

                <p className="text-xl md:text-2xl mb-10 max-w-lg mx-auto">
                  {slide.subtitle}
                </p>

                <NavLink to="/collection">
                  <button
                    className="bold-18 bg-white text-slate-900 px-10 py-4 w-[250px] rounded-full hover:bg-[#bc107d] hover:text-white transition-all duration-300 font-medium uppercase cursor-pointer"
                    style={{
                      boxShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {slide.buttonText}
                  </button>
                </NavLink>
              </div>
              <div className="relative w-[275px] h-[275px] lg:w-[375px] lg:h-[375px] image-container flex items-center justify-center">
                <img
                  src={slide.src}
                  alt="Stylish Watch"
                  onClick={() => handleImageClick(slide.id)}
                  className={`image image-animation cursor-pointer lg:mr-30 ${
                    isZoomed ? "zoom-out-fade" : ""
                  }`}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom pagination container */}
        {heroSlides.length > 0 && (
          <div className="hero-pagination absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 cursor-pointer"></div>
        )}
      </Swiper>

      {isModalOpen && (
        <HeroDetailsModal
          handleClose={handleClose}
          product={currentProduct}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
};

export default Hero;
